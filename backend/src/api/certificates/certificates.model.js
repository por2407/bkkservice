export const certificatesModel = {
  findCourse,
};

async function findCourse({ conn, userCode }) {
  return conn.execute(
    `
    SELECT 
    A.BCTT_COURSE AS ID_COURSE, 
	B.BCTR_GROUP,
	C.BCGR_DESC,
    B.BCTR_DESC AS COURSENAME,
	A.BCTT_FILE_UPLOAD,
	A.BCTT_DATE_ST, 
    A.BCTT_DATE_SC 
FROM psn.BK_COURSE_TRAIN_T A 
INNER JOIN psn.BK_COURSE_TRAIN_R B 
    ON B.BCTR_CODE = A.BCTT_COURSE 
JOIN psn.BK_COURSE_GROUP_R C
    ON C.BCGR_CODE = B.BCTR_GROUP
WHERE 
    A.BCTT_EMPCODE = :userCode 
ORDER BY A.BCTT_DATE_ST DESC
    `,
    { userCode }
  );
}

async function uploadCertificateRecord({ conn, data }) {
  const {

  } = data;
    return conn.execute(
    `
    UPDATE BK_COURSE_TRAIN_T 
    SET BCTT_DATE_SC = TO_DATE(:datesend, 'DD/MM/YYYY') , 
    BCTT_FILE_UPLOAD =:fileNameImg 
    WHERE BCTT_EMPCODE = :user_code AND BCTT_COURSE =:course_id
    `,
    
  );
}
