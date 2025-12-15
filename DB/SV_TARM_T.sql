-- File: SV_TARM_T.sql
-- Oracle 11g - Create table SV_TARM_T

CREATE TABLE SV_TARM_T
(
    STT_CUST_CODE  VARCHAR2(5),
    STT_CUST_SEQ   NUMBER(3),
    STT_DATE       DATE,
    STT_ROOM_NO    VARCHAR2(500),
    STT_COMP_SN    VARCHAR2(500),
    STT_DET        VARCHAR2(4000),
    STT_JOBNO      VARCHAR2(10),
    STT_STATUS     VARCHAR2(1),
    STT_IMAGE      VARCHAR2(1000),
    STT_TAR_NO     VARCHAR2(10),
    STT_USER_ID    VARCHAR2(20),
    STT_USER_DATE  DATE,
    STT_NUMDAY     NUMBER(5)
);

-- ===== Column Comments =====
COMMENT ON COLUMN SV_TARM_T.STT_CUST_CODE  IS 'รหัสลูกค้า ดูตาราง BK_CUSTM_R';
COMMENT ON COLUMN SV_TARM_T.STT_CUST_SEQ   IS 'ลำดับที่ผู้ติดต่อหน่วยงาน';
COMMENT ON COLUMN SV_TARM_T.STT_DATE       IS 'วันเวลาที่แจ้งเรื่อง';
COMMENT ON COLUMN SV_TARM_T.STT_ROOM_NO    IS 'หมายเลขห้อง';
COMMENT ON COLUMN SV_TARM_T.STT_COMP_SN    IS 'หมายเลขเครื่อง / SN';
COMMENT ON COLUMN SV_TARM_T.STT_DET        IS 'รายละเอียดงานที่แจ้ง';
COMMENT ON COLUMN SV_TARM_T.STT_JOBNO      IS 'หมายเลขรับงานจากประสานงาน';
COMMENT ON COLUMN SV_TARM_T.STT_STATUS     IS 'สถานะการให้บริการ';
COMMENT ON COLUMN SV_TARM_T.STT_IMAGE      IS 'ชื่อไฟล์ประกอบการแจ้งงาน';
COMMENT ON COLUMN SV_TARM_T.STT_TAR_NO     IS 'หมายเลขแจ้งเรื่อง';
COMMENT ON COLUMN SV_TARM_T.STT_USER_ID    IS 'รหัสเครื่องที่ใช้งาน';
COMMENT ON COLUMN SV_TARM_T.STT_USER_DATE  IS 'วันที่ผู้ใช้งาน';
COMMENT ON COLUMN SV_TARM_T.STT_NUMDAY     IS 'จำนวนวันที่แล้วเสร็จ';
