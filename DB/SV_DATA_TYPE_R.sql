-- File: SV_DATA_TYPE_R.sql
-- Oracle 11g - Create table SV_DATA_TYPE_R

CREATE TABLE SV_DATA_TYPE_R
(
    SDTR_CODE      VARCHAR2(1),
    SDTR_DESC      VARCHAR2(100),
    SDTR_USER_ID   VARCHAR2(20),
    SDTR_USER_DATE DATE
);

-- ===== Column Comments =====
COMMENT ON COLUMN SV_DATA_TYPE_R.SDTR_CODE      IS 'รหัสประเภทข้อมูล';
COMMENT ON COLUMN SV_DATA_TYPE_R.SDTR_DESC      IS 'ชื่อประเภทข้อมูล';
COMMENT ON COLUMN SV_DATA_TYPE_R.SDTR_USER_ID   IS 'รหัสเครื่องที่ใช้งาน';
COMMENT ON COLUMN SV_DATA_TYPE_R.SDTR_USER_DATE IS 'วันที่ผู้ใช้งาน';
