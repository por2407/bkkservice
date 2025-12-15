-- File: SV_SERVICE_SEQ_R.sql
-- Oracle 11g - Create table SV_SERVICE_SEQ_R

CREATE TABLE SV_SERVICE_SEQ_R
(
    SSSR_TYPE      VARCHAR2(1),
    SSSR_SEQ       NUMBER(2),
    SSSR_DESC      VARCHAR2(1000),
    SSSR_DAY       NUMBER(2),
    SSSR_HOUR      NUMBER(2),
    SSSR_USER_ID   VARCHAR2(20),
    SSSR_USER_DATE DATE
);

-- ===== Column Comments =====
COMMENT ON COLUMN SV_SERVICE_SEQ_R.SSSR_TYPE      IS 'ประเภทการให้บริการ';
COMMENT ON COLUMN SV_SERVICE_SEQ_R.SSSR_SEQ       IS 'ลำดับการดำเนินงาน';
COMMENT ON COLUMN SV_SERVICE_SEQ_R.SSSR_DESC      IS 'รายละเอียดขั้นตอนการดำเนินงาน';
COMMENT ON COLUMN SV_SERVICE_SEQ_R.SSSR_DAY       IS 'จำนวนวันที่แล้วเสร็จ';
COMMENT ON COLUMN SV_SERVICE_SEQ_R.SSSR_HOUR      IS 'จำนวนชั่วโมงที่แล้วเสร็จ';
COMMENT ON COLUMN SV_SERVICE_SEQ_R.SSSR_USER_ID   IS 'รหัสผู้ใช้งาน';
COMMENT ON COLUMN SV_SERVICE_SEQ_R.SSSR_USER_DATE IS 'วันที่ผู้ใช้งาน';
