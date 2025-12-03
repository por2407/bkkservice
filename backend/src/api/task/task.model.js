//Feature-based + Layered
export const taskModel = {
  customer: {
    findCustomerInprogress,
    nextRefTask,
    createNewTask,
  },
  employee: {
    findEmployeeInprogress,
  },
  dealer: {
    findDealerInprogress,
  },
  findDetail,
  timeLine,
  getPartialInfo,
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

async function findDetail({ conn, tarNo, type }) {
  const cols = type
    ? ` CASE 
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
        WHEN m.SSMT_STATUS = 'Y' AND m.SSMT_TYPE_SEQ = '5' THEN 'done'
        WHEN m.SSMT_STATUS IS NULL THEN 'in_progress'
    END AS STATUS,
    t.BTDST_SUBMIT_DATE  `;

  const joins = !type
    ? ` join SV_SERVICEM_T m  ON m.SSMT_JOB_NO = s.STT_JOBNO 
        join BK_TARDS_T t on t.BTDST_NO = s.STT_JOBNO`
    : ``;

  return conn.execute(
    `select s.STT_JOBNO, s.STT_TAR_NO, s.STT_ROOM_NO, s.STT_DET, s.STT_IMAGE, s.STT_STATUS, s.STT_DATE, ${cols} from SV_TARM_T s ${joins} where s.STT_TAR_NO =:tarNo`,
    { tarNo }
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
  const cols = type
    ? ``
    : `, t.BTDST_SUBMIT_DATE  `;

  const joins = !type
    ? ` join BK_TARDS_T t on t.BTDST_NO = s.STT_JOBNO`
    : ``;
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
