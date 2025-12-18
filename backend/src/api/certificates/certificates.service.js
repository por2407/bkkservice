import { withTransaction, withConnect } from "../../shared/db/transaction.js";
import { certificatesModel } from "./certificates.model.js";
import { AppErrors } from "../../shared/error/appError.js";

export const certificatesService = { getCertificatesList };

async function getCertificatesList({ userCode, userType }) {
  if (userType !== "e") {
    throw new AppErrors({
      message: "Only employees can access certificates",
      statusCode: 404,
    });
  }
  if (!userCode) {
    throw new AppErrors({ message: "userCode is required", statusCode: 400 });
  }
  return withConnect(async (conn) => {
    const { rows } = await certificatesModel.findCourse({ conn, userCode });
    return rows.map((row) => {
      const certificateFileType = row.BCTT_FILE_UPLOAD
        ? [".jpg", ".jpeg", ".png"].some((ext) =>
            row.BCTT_FILE_UPLOAD?.toLowerCase().endsWith(ext)
          )
          ? "image"
          : "pdf"
        : undefined;
      return {
        id: `${row.BCTR_GROUP}-${row.ID_COURSE}`,
        code: row.ID_COURSE,
        name: row.COURSENAME,
        type: row.BCGR_DESC,
        ...(row.BCTT_FILE_UPLOAD
          ? {
              certificateUrl: `http://localhost:3001/certificates/${row.BCTT_FILE_UPLOAD}`,
            }
          : {}),
        certificateFileType,
        uploadedAt: new Date(row.BCTT_DATE_ST).toISOString(),  // วันที่เริ่มอัปโหลดได้
        ...(row.BCTT_DATE_SC
          ? { trainingCompletedAt: new Date(row.BCTT_DATE_SC).toISOString() }
          : {}),  // วันที่จบการอบรมจากการอัปโหลด
      };
    });
  });
}
