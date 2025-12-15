-- File: SV_STATUS_R.sql
-- Oracle 11g - Create table SV_STATUS_R

CREATE TABLE SV_STATUS_R
(
    STR_CODE      VARCHAR2(1),
    STR_DESC      VARCHAR2(250),
    STR_USER_ID   VARCHAR2(20),
    STR_USER_DATE DATE
);

-- ===== Column Comments =====
COMMENT ON COLUMN SV_STATUS_R.STR_CODE      IS 'รหัสสถานะ';
COMMENT ON COLUMN SV_STATUS_R.STR_DESC      IS 'รายละเอียดสถานะ';
COMMENT ON COLUMN SV_STATUS_R.STR_USER_ID   IS 'รหัสเครื่องที่ใช้งาน';
COMMENT ON COLUMN SV_STATUS_R.STR_USER_DATE IS 'วันที่ผู้ใช้งาน';