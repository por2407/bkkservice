-- File: SV_SERVICED_T.sql
-- Oracle 11g - Create table SV_SERVICED_T

CREATE TABLE SV_SERVICED_T
(
    SSDT_JOB_NO      VARCHAR2(10),
    SSDT_TYPE_CODE   VARCHAR2(1),
    SSDT_TYPE_SEQ    NUMBER(2),
    SSDT_DATA_TYPE   VARCHAR2(1),
    SSDT_DATE        DATE,
    SSDT_DET         VARCHAR2(4000),
    SSDT_USERNAME    VARCHAR2(20),
    SSDT_EMPCODE     VARCHAR2(6),
    SSDT_USER_ID     VARCHAR2(20),
    SSDT_USER_DATE   DATE,
    SSDT_IMAGE       VARCHAR2(1000)
);

-- ===== Column Comments =====

COMMENT ON COLUMN SV_SERVICED_T.SSDT_JOB_NO      IS 'รหัสแจ้งรับงาน ดูตาราง BK_TARM_T';
COMMENT ON COLUMN SV_SERVICED_T.SSDT_TYPE_CODE   IS 'รหัสประเภทงานให้บริการ ดูตาราง SV_SERVICE_TYPE_R';
COMMENT ON COLUMN SV_SERVICED_T.SSDT_TYPE_SEQ    IS 'เลขลำดับงาน';
COMMENT ON COLUMN SV_SERVICED_T.SSDT_DATA_TYPE   IS 'ประเภทข้อมูลดำเนินการ ดูตาราง SV_DATA_TYPE_R';
COMMENT ON COLUMN SV_SERVICED_T.SSDT_DATE        IS 'วันเวลาที่ทำรายการ';
COMMENT ON COLUMN SV_SERVICED_T.SSDT_DET         IS 'รายละเอียด สถานะ ปัญหา ผลการให้บริการ สรุปผล เป็นต้น';
COMMENT ON COLUMN SV_SERVICED_T.SSDT_USERNAME    IS 'username ของการเข้าที่ login';
COMMENT ON COLUMN SV_SERVICED_T.SSDT_EMPCODE     IS 'รหัสพนักงานที่ดำเนินการ ดูตาราง BK_MASTER_R';
COMMENT ON COLUMN SV_SERVICED_T.SSDT_USER_ID     IS 'รหัสเครื่องที่ใช้งาน';
COMMENT ON COLUMN SV_SERVICED_T.SSDT_USER_DATE   IS 'วันเวลาผู้ใช้งาน';
COMMENT ON COLUMN SV_SERVICED_T.SSDT_IMAGE       IS 'รูปภาพที่แนบ (path/ชื่อไฟล์)';

