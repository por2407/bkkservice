//Feature-based + Layered
import oracledb from "oracledb";
export const taskModel = {
  customer: {
    findCustomerInprogress,
    nextRefTask,
    createNewTask,
    findDescriptionTaskScore,
    updateTaskScore,
    getStartEndDatesByJobNo,
    getWeekDiffFromThaiStartDate,
    getNumSdayByJobNoAndWeekDiff,
    insertJobServiceDetailScore,
    insertCustomerPointTransaction,
  },
  employee: {
    findEmployeeInprogress,
    updateStatus,
    checkPendingTasks,
    findTaskStartDate,
    updateTaskSummaryDetail,
    updateTaskFinish,
  },
  dealer: {
    findDealerInprogress,
  },
  findDetail,
  timeLine,
  getPartialInfo,
  getTaskComment,
  getRefNoComment,
  findUserName,
  insertTaskComment,
  findNameComment,
  getLocation,
};

async function findCustomerInprogress({ conn, userCode, custSeq }) {
  return conn.execute(
    `
      SELECT 
    s.STT_IMAGE,
    s.STT_DATE,
    s.STT_ROOM_NO,
    s.STT_COMP_SN,
    s.STT_DET,
    s.STT_JOBNO,
    s.STT_STATUS,
    s.STT_TAR_NO,
    CASE
       WHEN TRIM(NVL(CO.GETTARTYPE(s.STT_JOBNO), '')) = '(Demo/Present)' THEN 0
       ELSE 1
    END AS CANRATING,
    t.BTDST_SCORE,
    CASE 
        WHEN s.STT_CUST_SEQ = :custSeq THEN 1 
        ELSE 2 
    END AS ORDERING,
    CASE 
        WHEN (
                (
                    (s.STT_STATUS IS NULL OR s.STT_STATUS <> 'Y')
                    AND s.STT_JOBNO IS NOT NULL
                    AND EXISTS (
                        SELECT 1
                        FROM co.BK_TARM_T b
                        WHERE b.BTMT_NO = s.STT_JOBNO
                          AND b.BTMT_JOB_STATUS IS NULL
                    )
                )
                OR (s.STT_STATUS IS NULL AND s.STT_JOBNO IS NULL)
             )
        THEN 'in_progress'
        WHEN s.STT_STATUS = 'Y' THEN 'done'
    END AS STATUS,
    m.SSMT_ENDJOB_DATE,
    c.SSMT_TYPE_SEQ 
FROM 
    SV_TARM_T s
    -- สรุป ENDJOB_DATE ให้เหลือ 1 แถวต่อ JOBNO ก่อน
    LEFT JOIN (
        SELECT
            SSMT_JOB_NO,
            MAX(SSMT_ENDJOB_DATE) AS SSMT_ENDJOB_DATE
        FROM SV_SERVICEM_T
        WHERE SSMT_TYPE_SEQ = '5'
        GROUP BY SSMT_JOB_NO
    ) m
        ON m.SSMT_JOB_NO = s.STT_JOBNO
    -- สรุปคะแนนให้เหลือ 1 แถวต่อ JOBNO ก่อน
    LEFT JOIN (
        SELECT
            BTDST_NO,
            MAX(BTDST_SCORE) AS BTDST_SCORE
        FROM BK_TARDS_T
        GROUP BY BTDST_NO
    ) t
        ON t.BTDST_NO = s.STT_JOBNO
       AND s.STT_STATUS = 'Y' 
    LEFT JOIN (
    SELECT
        SSMT_JOB_NO,
        MAX(SSMT_TYPE_SEQ) AS SSMT_TYPE_SEQ
    FROM SV_SERVICEM_T
    WHERE SSMT_STATUS = 'Y'
    GROUP BY SSMT_JOB_NO
) c
   ON c.SSMT_JOB_NO = s.STT_JOBNO 
WHERE 
    s.STT_CUST_CODE = :userCode 
    AND s.STT_DATE  >= ADD_MONTHS(SYSDATE, -48)
    AND NOT EXISTS (
        SELECT 1
        FROM co.BK_TARM_T b2
        WHERE b2.BTMT_NO         = s.STT_JOBNO
          AND b2.BTMT_JOB_STATUS = 'X'
    )
    AND getflagsendmail(s.STT_JOBNO) = 'T'
ORDER BY 
    s.STT_TAR_NO DESC
    `,
    { userCode, custSeq }
  );
}

async function findEmployeeInprogress({ conn, userCode }) {
  return conn.execute(
    `SELECT
    s.JOB_NO,
    t.STT_DATE,
    t.STT_ROOM_NO,
    t.STT_COMP_SN,
    t.STT_DET,
    t.STT_STATUS,
    t.STT_IMAGE,
    t.STT_TAR_NO,
    t.STT_CUST_SEQ,
    getcustnx(t.STT_CUST_CODE) AS CUSTNAME,
    CASE
        WHEN s.SSMT_STATUS = 'Y' AND s.SSMT_TYPE_SEQ = '5' THEN 'done'
        WHEN s.SSMT_STATUS IS NULL THEN 'in_progress'
    END AS STATUS,
    m.SSMT_ENDJOB_DATE,
    sc.BTDST_SCORE,
    c.SSMT_TYPE_SEQ 
FROM (
    SELECT
        SSMT_JOB_NO AS JOB_NO,
        MAX(SSMT_STATUS)   AS SSMT_STATUS,
        MAX(SSMT_TYPE_SEQ) AS SSMT_TYPE_SEQ
    FROM SV_SERVICEM_T
    WHERE SSMT_EMPCODE = :userCode 
	   AND (SSMT_STATUS = 'Y' AND SSMT_TYPE_SEQ = '5' OR SSMT_STATUS IS NULL)
    GROUP BY SSMT_JOB_NO
) s
JOIN SV_TARM_T t
    ON t.STT_JOBNO = s.JOB_NO 
   AND t.STT_DATE  >= ADD_MONTHS(SYSDATE, -48)
LEFT JOIN SV_SERVICEM_T m 
   ON m.SSMT_JOB_NO   = t.STT_JOBNO
  AND m.SSMT_TYPE_SEQ = '5'
LEFT JOIN (
        SELECT
            BTDST_NO,
            MAX(BTDST_SCORE) AS BTDST_SCORE
        FROM BK_TARDS_T
        GROUP BY BTDST_NO
    ) sc
        ON sc.BTDST_NO = s.JOB_NO 
LEFT JOIN (
    SELECT
        SSMT_JOB_NO,
        MAX(SSMT_TYPE_SEQ) AS SSMT_TYPE_SEQ
    FROM SV_SERVICEM_T
    WHERE SSMT_STATUS = 'Y'
    GROUP BY SSMT_JOB_NO
) c
   ON c.SSMT_JOB_NO = t.STT_JOBNO  
ORDER BY
    t.STT_DATE DESC
`,
    { userCode }
  );
}

async function findDealerInprogress({ conn, userCode }) {
  return conn.execute(
    `SELECT
    s.STT_DATE,
    s.STT_ROOM_NO,
    s.STT_COMP_SN,
    s.STT_DET,
    s.STT_JOBNO,
    s.STT_STATUS,
    s.STT_IMAGE,
    s.STT_TAR_NO,
    nvl(s.STT_NUMDAY, '0') AS STT_NUMDAY,
    getcustnx(s.STT_CUST_CODE) AS CUSTNAME,
    CASE
        -- งานกำลังดำเนินการ
        WHEN (
                (
                    (s.STT_STATUS IS NULL OR s.STT_STATUS <> 'Y')
                    AND s.STT_JOBNO IS NOT NULL
                    AND EXISTS (
                        SELECT 1
                        FROM co.BK_TARM_T b
                        WHERE b.BTMT_NO = s.STT_JOBNO
                          AND b.BTMT_JOB_STATUS IS NULL
                    )
                )
                OR (s.STT_STATUS IS NULL AND s.STT_JOBNO IS NULL)
             )
        THEN 'in_progress'
        -- งานเสร็จแล้ว
        WHEN s.STT_STATUS = 'Y'
        THEN 'done'
    END AS STATUS,
    m.SSMT_ENDJOB_DATE,
         to_char(SSMT_DATE_ED,'dd Mon YYYY hh24:mi','NLS_CALENDAR=''THAI BUDDHA''NLS_DATE_LANGUAGE=THAI') as END_SV_DATE,
         getjobservicedate(s.STT_JOBNO,'C') AS EXHIBITION_48,
      c.SSMT_TYPE_SEQ 
FROM SV_TARM_T s 
   LEFT JOIN SV_SERVICEM_T m 
   ON m.SSMT_JOB_NO = s.STT_JOBNO
      AND m.SSMT_TYPE_SEQ = '5' 
  LEFT JOIN (
    SELECT
        SSMT_JOB_NO,
        MAX(SSMT_TYPE_SEQ) AS SSMT_TYPE_SEQ
    FROM SV_SERVICEM_T
    WHERE SSMT_STATUS = 'Y'
    GROUP BY SSMT_JOB_NO
) c
   ON c.SSMT_JOB_NO = s.STT_JOBNO  
WHERE
    -- เงื่อนไขแทน STT_CUST_CODE IN (SELECT DISTINCT BJR_DPM_CODE ...)
    EXISTS (
        SELECT 1
        FROM BK_JOB_R r
        WHERE r.BJR_DPM_CODE  = s.STT_CUST_CODE
          AND r.BJR_W_DATE_ED > TRUNC(SYSDATE)
          AND r.BJR_COMP_CODE = :userCode
    )
    -- แทน NVL(STT_JOBNO,' ') NOT IN (...)
    AND NOT EXISTS (
        SELECT 1
        FROM co.BK_TARM_T x
        WHERE x.BTMT_NO         = s.STT_JOBNO
          AND x.BTMT_JOB_STATUS = 'X'
    )
    AND getflagsendmail(s.STT_JOBNO) = 'T' 
    AND s.STT_DATE  >= ADD_MONTHS(SYSDATE, -48)
ORDER BY 
    s.STT_DATE DESC
`,
    { userCode }
  );
}

async function findDetail({ conn, userCode, custSeq, tarNo, type }) {
  const cols = type
    ? ` CASE 
            WHEN  s.STT_CUST_CODE = :userCode and s.STT_CUST_SEQ = :custSeq THEN 1 
            ELSE 2
        END AS ORDERING
     , CASE 
        WHEN (
                (
                    (s.STT_STATUS IS NULL OR s.STT_STATUS <> 'Y')
                    AND s.STT_JOBNO IS NOT NULL
                    AND EXISTS (
                        SELECT 1
                        FROM co.BK_TARM_T b
                        WHERE b.BTMT_NO = s.STT_JOBNO
                          AND b.BTMT_JOB_STATUS IS NULL
                    )
                )
                OR (s.STT_STATUS IS NULL AND s.STT_JOBNO IS NULL)
             )
        THEN 'in_progress'
        WHEN s.STT_STATUS = 'Y' THEN 'done'
    END AS STATUS `
    : ` CASE
        WHEN m.SSMT_STATUS = 'Y' THEN 'done'
        WHEN m.SSMT_STATUS IS NULL THEN 'in_progress'
    END AS STATUS,
    t.BTDST_SUBMIT_DATE `;

  const joins = !type
    ? ` join SV_SERVICEM_T m  ON m.SSMT_JOB_NO = s.STT_JOBNO  and m.SSMT_TYPE_SEQ = '5' `
    : ``;

  return conn.execute(
    `select s.STT_JOBNO, s.STT_TAR_NO, s.STT_ROOM_NO, s.STT_DET, s.STT_IMAGE, s.STT_STATUS, s.STT_DATE, 
    CASE
       WHEN TRIM(NVL(CO.GETTARTYPE(s.STT_JOBNO), '')) = '(Demo/Present)' THEN 0
       ELSE 1
    END AS CANRATING, 
    t.BTDST_SCORE, 
    ${cols} from SV_TARM_T s ${joins} left join BK_TARDS_T t on t.BTDST_NO = s.STT_JOBNO where s.STT_TAR_NO =:tarNo`,
    { tarNo, ...(type ? { userCode, custSeq } : {}) }
  );
}

async function timeLine({ conn, JobNo }) {
  return conn.execute(
    `SELECT 
    s.SSMT_TYPE_CODE, s.SSMT_TYPE_SEQ, 
    s.SSMT_ENDJOB_DATE,
    s.SSMT_STATUS, 
    s.SSMT_DATE_ST,
    s.SSMT_DATE_ED,
    s.SSMT_EMPCODE,
    getdemp(s.SSMT_EMPCODE,'N') as EMP_NAME,
    t.SSSR_DESC  
    FROM SV_SERVICEM_T s 
      JOIN SV_SERVICE_SEQ_R t 
       ON t.SSSR_TYPE = s.SSMT_TYPE_CODE
      AND t.SSSR_SEQ = s.SSMT_TYPE_SEQ
    WHERE s.SSMT_JOB_NO =:JobNo 
    ORDER BY s.SSMT_TYPE_SEQ DESC`,
    { JobNo }
  );
}

async function getPartialInfo({ conn, tarNo, type }) {
  const cols = type ? `` : `, t.BTDST_SUBMIT_DATE  `;

  const joins = !type ? ` join BK_TARDS_T t on t.BTDST_NO = s.STT_JOBNO` : ``;
  return conn.execute(
    `
    select s.STT_JOBNO ${cols} from SV_TARM_T s ${joins} where s.STT_TAR_NO =:tarNo 
    `,
    { tarNo }
  );
}

async function nextRefTask({ conn }) {
  return conn.execute(`
    WITH date_part AS (
      SELECT 'BS'
             || SUBSTR(
                  TO_CHAR(
                    SYSDATE,
                    'YYYY',
                    'NLS_CALENDAR=''THAI BUDDHA'' NLS_DATE_LANGUAGE=THAI'
                  ),
                  3, 2
                )
             || TO_CHAR(SYSDATE, 'MM') AS prefix
      FROM dual
    ),
    max_no AS (
      SELECT d.prefix,
             MAX(t.STT_TAR_NO) AS max_tar_no
      FROM date_part d
           LEFT JOIN SV_TARM_T t
             ON t.STT_TAR_NO LIKE d.prefix || '%'
      GROUP BY d.prefix
    )
    SELECT
      prefix
      || LPAD(
           NVL(TO_NUMBER(SUBSTR(max_tar_no, -4)), 0) + 1,
           4,
           '0'
         ) AS STT_TAR_NO
    FROM max_no
    `);
}

async function createNewTask({ conn, payload }) {
  const { userCode, custSeq, room, machineNo, description, nameFile, tarNo } =
    payload;

  const sql = `
    INSERT INTO SV_TARM_T (
      STT_CUST_CODE,
      STT_CUST_SEQ,
      STT_DATE,
      STT_ROOM_NO,
      STT_COMP_SN,
      STT_DET,
      STT_IMAGE,
      STT_TAR_NO
    ) VALUES (
      :userCode,
      :custSeq,
      SYSDATE,
      :room,
      :machineNo,
      :description,
      :nameFile,
      :tarNo
    )
  `;

  return conn.execute(
    sql,
    {
      userCode,
      custSeq,
      room,
      machineNo,
      description,
      nameFile,
      tarNo,
    },
    { autoCommit: false }
  );
}

async function updateStatus({ conn, payload, startTime }) {
  const { userCode, jobNo, typeCode, typeSeq } = payload;
  const cols = startTime
    ? `SSMT_DATE_ST  = :startTime, `
    : `SSMT_DATE_ST  = sysdate, `;
  return conn.execute(
    `
    UPDATE SV_SERVICEM_T
    SET 
      SSMT_STATUS   = 'Y', 
      ${cols}
      SSMT_DATE_ED  = sysdate   
    WHERE SSMT_JOB_NO   = :jobNo 
      AND SSMT_EMPCODE  = :userCode 
      AND SSMT_TYPE_SEQ = :typeSeq 
      AND SSMT_TYPE_CODE= :typeCode 
    RETURNING 
      SSMT_DATE_ED,
      getdemp(SSMT_EMPCODE, 'N')
    INTO
      :outDate,
      :empName
    `,
    {
      ...(startTime ? { startTime: new Date(startTime) } : {}),
      jobNo,
      userCode,
      typeSeq,
      typeCode,
      outDate: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
      empName: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
    },
    { autoCommit: false }
  );
}

async function checkPendingTasks({ conn, userCode, jobNo }) {
  return conn.execute(
    `
    select count(SSMT_TYPE_SEQ) as CNT 
    from SV_SERVICEM_T 
    where SSMT_JOB_NO =:jobNo 
    and SSMT_EMPCODE =:userCode 
    and SSMT_STATUS is null
    `,
    { jobNo, userCode }
  );
}

async function findTaskStartDate({ conn, userCode, jobNo }) {
  return conn.execute(
    `
  SELECT SSMT_DATE_ST 
  FROM SV_SERVICEM_T 
  WHERE SSMT_JOB_NO =:jobNo 
  AND SSMT_TYPE_SEQ = '4' 
  AND SSMT_EMPCODE =:userCode
  `,
    { userCode, jobNo }
  );
}

async function updateTaskSummaryDetail({ conn, payload }) {
  const { jobNo, userCode, process, pending, startTime, endTime } = payload;

  return conn.execute(
    `
    UPDATE BK_TARDS_T 
      SET BTDST_W_CASE      = :process,
          BTDST_NOK_CASE    = :pending,
          BTDST_DATE_ST     = :startTime,
          BTDST_DATE_ED     = :endTime,
          BTDST_SUBMIT_DATE = trunc(sysdate)  
    WHERE BTDST_NO = :jobNo 
      AND BTDST_EMP_CODE = :userCode 
      AND BTDST_SUBMIT_DATE IS NULL 
    `,
    {
      jobNo,
      userCode,
      process,
      pending,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
    { autoCommit: false }
  );
}

async function updateTaskFinish({ conn, jobNo }) {
  const { rows } = await conn.execute(
    `select getjobservicedate(:jobNo,'N') as DATE_FINIS from dual`,
    { jobNo }
  );
  return conn.execute(
    `
    UPDATE SV_TARM_T SET STT_STATUS = 'Y', 
          STT_NUMDAY =:date_tofinis 
    WHERE STT_JOBNO =:jobNo
    `,
    {
      jobNo,
      date_tofinis: rows?.[0].DATE_FINIS ?? null,
    },
    { autoCommit: false }
  );
}

async function findDescriptionTaskScore({ conn }) {
  return conn.execute(
    `
    select SJSR_CODE,
      SJSR_DESC as DVNAME 
    from SV_JOBSV_R 
    where SJSR_STATUS is null 
    order by SJSR_CODE
    `
  );
}

async function getStartEndDatesByJobNo({ conn, jobNo }) {
  return conn.execute(
    `
    select to_char(BTMT_DATE,'dd/mm/yyyy hh24:mi','NLS_CALENDAR=''THAI BUDDHA''NLS_DATE_LANGUAGE=THAI') as DATE_ST,
       to_char(BTMT_WORK_DATE_ED,'dd/mm/yyyy hh24:mi','NLS_CALENDAR=''THAI BUDDHA''NLS_DATE_LANGUAGE=THAI') as DATE_ED, 
       to_char(BTMT_DATE,'dd/mm/yyyy','NLS_CALENDAR=''THAI BUDDHA''NLS_DATE_LANGUAGE=THAI') as DATE_ST_TH,
       to_char(BTMT_WORK_DATE_ED,'dd/mm/yyyy','NLS_CALENDAR=''THAI BUDDHA''NLS_DATE_LANGUAGE=THAI') as DATE_ED_TH  
    from co.BK_TARM_T where BTMT_NO = :jobNo
    `,
    { jobNo }
  );
}

async function getWeekDiffFromThaiStartDate({ conn, dateStTh }) {
  return conn.execute(
    `
    with dd as 
    (select TO_DATE(:dateStTh,'dd/mm/yyyy','NLS_CALENDAR=''THAI BUDDHA''NLS_DATE_LANGUAGE=THAI') fdt, 
    trunc(sysdate) ldt from dual)
    SELECT   (next_day(ldt,'sunday')-next_day(fdt-1,'sunday'))/7 as SDAY  
    FROM   dd
    `,
    { dateStTh }
  );
}

async function getNumSdayByJobNoAndWeekDiff({ conn, sDay, jobNo }) {
  return conn.execute(
    `
      select 
          (trunc(sysdate) - trunc(BTMT_DATE) ) - :sDay as NUMSDAY  
      from co.BK_TARM_T where BTMT_NO = :jobNo
    `,
    { sDay, jobNo }
  );
}

async function insertJobServiceDetailScore({ conn, payload }) {
  const { jobNo, vCode, i, vScore } = payload;
  return conn.execute(
    `
    insert into SV_JOBSVD_T(SJVD_JOB_NO,SJVD_SVCODE,SJVD_ITEM,SJVD_SCORE)
		values(:jobNo, :vCode, :i, :vScore)
    `,
    { jobNo, vCode, i, vScore },
    { autoCommit: false }
  );
}

async function insertCustomerPointTransaction({ conn, payload }) {
  const { userCode, custSeq, jobNo, dateSt, dateEd, vPoint } = payload;
  return conn.execute(
    `
    insert into SV_POINT_T(
    SPT_CUST_CODE,
    SPT_CUST_SEQ,
    SPT_JOB_NO,
    SPT_DATE_ST,
    SPT_DATE_ED,
    SPT_POINT,
    SPT_INSERT_DATE)
		values(
    :userCode,
    :custSeq,
    :jobNo,
    to_date(:dateSt,'dd/mm/yyyy','NLS_CALENDAR=''THAI BUDDHA''NLS_DATE_LANGUAGE=THAI'),
    to_date(:dateEd,'dd/mm/yyyy','NLS_CALENDAR=''THAI BUDDHA''NLS_DATE_LANGUAGE=THAI'),
    :vPoint, sysdate)
    `,
    {
      userCode,
      custSeq,
      jobNo,
      dateSt,
      dateEd,
      vPoint,
    },
    { autoCommit: false }
  );
}

async function updateTaskScore({ conn, jobNo, star }) {
  return conn.execute(
    `
  UPDATE BK_TARDS_T SET BTDST_SCORE =:star WHERE BTDST_NO =:jobNo
    `,
    { jobNo, star },
    { autoCommit: false }
  );
}

async function getTaskComment({ conn, jobNo, custSeq, type }) {
  const joins = type
    ? `LEFT JOIN SV_USER_R u
         ON u.SUR_USERNAME = t.SSDT_USERNAME
        AND u.SUR_CUSTSEQ  = :custSeq`
    : `JOIN SV_TARM_T tm
         ON tm.STT_JOBNO = t.SSDT_JOB_NO
       LEFT JOIN SV_USER_R u
         ON u.SUR_CUSTCODE = tm.STT_CUST_CODE
        AND u.SUR_CUSTSEQ  = tm.STT_CUST_SEQ`;

  return conn.execute(
    `
    SELECT
      t.SSDT_DATE AS DATE_COMMENT,
      t.SSDT_DET,
      t.SSDT_USERNAME,
      t.SSDT_EMPCODE,
      t.SSDT_IMAGE,
      CASE
        WHEN t.SSDT_EMPCODE IS NOT NULL THEN getdemp(t.SSDT_EMPCODE, 'N')
        WHEN t.SSDT_USERNAME IS NOT NULL THEN getcustdpmnx(u.SUR_CUSTCODE, u.SUR_CUSTSEQ)
        ELSE NULL
      END AS NAME_X
    FROM SV_SERVICED_T t
    ${joins}
    WHERE t.SSDT_JOB_NO = :jobNo
    ORDER BY t.SSDT_DATE ASC
    `,
    { jobNo, ...(type ? { custSeq } : {}) }
  );
}

async function getRefNoComment({ conn, jobNo }) {
  return conn.execute(
    `
    SELECT NVL(
         MAX(
           CASE
             WHEN REGEXP_LIKE(REGEXP_SUBSTR(SSDT_IMAGE, '_([0-9]+)\.[^.]+$', 1, 1, NULL, 1), '^[0-9]+$')
             THEN TO_NUMBER(REGEXP_SUBSTR(SSDT_IMAGE, '_([0-9]+)\.[^.]+$', 1, 1, NULL, 1))
           END
         ), 0
       ) + 1 AS SUB
    FROM SV_SERVICED_T
    WHERE SSDT_JOB_NO = :jobNo
  `,
    { jobNo }
  );
}

async function findUserName({ conn, userCode, custSeq }) {
  return conn.execute(
    `
   SELECT SUR_USERNAME as USERNAME 
   FROM SV_USER_R 
   WHERE SUR_CUSTCODE =:userCode 
      AND SUR_CUSTSEQ =:custSeq
    `,
    { userCode, custSeq }
  );
}

async function insertTaskComment({ conn, payload, type }) {
  const { jobNo, typeCode, typeSeq, det, empCode, userName, imageNames } =
    payload;

  const cols = type ? `, SSDT_USERNAME` : ` , SSDT_EMPCODE `;
  const vals = type ? `, :userName` : `, :empCode `;
  return conn.execute(
    `
    INSERT INTO SV_SERVICED_T 
    (SSDT_JOB_NO, SSDT_TYPE_CODE, SSDT_TYPE_SEQ, SSDT_DET, SSDT_DATE, SSDT_IMAGE ${cols}) 
    VALUES (:jobNo, :typeCode, :typeSeq, :det, sysdate, :imageNames ${vals})
    `,
    {
      jobNo,
      typeCode,
      typeSeq,
      det,
      ...(type ? { userName } : { empCode }),
      imageNames,
    },
    { autoCommit: false }
  );
}

async function findNameComment({ conn, userCode, custSeq, type }) {
  const cols = type
    ? ` getcustdpmnx(:userCode, :custSeq) `
    : ` getdemp(:userCode, 'N') `;

  return conn.execute(
    `
   SELECT ${cols} as NAME_X FROM dual
    `,
    { userCode, ...(type ? { custSeq } : {}) }
  );
}

async function getLocation({ conn, empCode }) {
  return conn.execute(
    `
    SELECT SLT_EMPCODE as USERCODE, 
    getdemp(SLT_EMPCODE,'N') as USERNAME,
    SLT_LATITUDE as USERLATI,
    SLT_LONGITUDE as USERLONGI,
    SLT_DATETIME as DATETIMELOC
    FROM SV_LOCATION_T WHERE SLT_EMPCODE =:empCode 
    ORDER BY SLT_DATETIME DESC
    `,
    { empCode }
  );
}
