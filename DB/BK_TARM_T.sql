-- File : BK_TARM_T.sql
-- Oracle 11g - Create table BK_TARM_T

CREATE TABLE BK_TARM_T
(
    BTMT_NO           VARCHAR2(9)   NOT NULL,
    BTMT_DATE         DATE,
    BTMT_JOB_CODE     VARCHAR2(100),
    BTMT_ITEM         NUMBER(3),
    BTMT_EMP_CODE     VARCHAR2(6),
    BTMT_CUST_SEQ     NUMBER(3),
    BTMT_JOB_STATUS   VARCHAR2(1),
    BTMT_EMP_CODE_W   VARCHAR2(6),
    BTMT_CALL_TYPE    VARCHAR2(1),
    BTMT_WORK_DATE_ST DATE,
    BTMT_WORK_DATE_ED DATE,
    BTMT_FINISH_DATE  DATE,
    BTMT_USER_ID      VARCHAR2(15),
    BTMT_USER_DATE    DATE,
    BTMT_TAR_TYPE     VARCHAR2(1),
    BTMT_EMPCODE_FINAL VARCHAR2(6),
    BTMT_DATE_V       DATE,
    BTMT_EMPCODE_V    VARCHAR2(6),
    BTMT_TRACK_DATE   DATE
);

-- ===== Column Comments =====
COMMENT ON COLUMN BK_TARM_T.BTMT_NO            IS 'เลขที่รับเรื่อง GEN อัตโนมัติ TYYMMNNN';
COMMENT ON COLUMN BK_TARM_T.BTMT_DATE          IS 'วันที่รับเรื่อง มีเวลาด้วย';
COMMENT ON COLUMN BK_TARM_T.BTMT_JOB_CODE      IS 'รหัสงาน ดูตาราง BK_JOB_R';
COMMENT ON COLUMN BK_TARM_T.BTMT_ITEM          IS 'จำนวนรายการที่รับเรื่อง';
COMMENT ON COLUMN BK_TARM_T.BTMT_EMP_CODE      IS 'รหัสพนักงานที่รับเรื่อง ดูตาราง BK_MASTER_R';
COMMENT ON COLUMN BK_TARM_T.BTMT_CUST_SEQ      IS 'ลำดับที่ของลูกค้าที่แจ้งเรื่อง ดูตาราง BK_CUSTD_R';
COMMENT ON COLUMN BK_TARM_T.BTMT_JOB_STATUS    IS 'Y=ปิดงานเรียบร้อยแล้ว ว่าง=รายการยังค้าง';
COMMENT ON COLUMN BK_TARM_T.BTMT_EMP_CODE_W    IS 'รหัสพนักงานที่ไปทำงาน ดูตาราง BK_MASTER_R';
COMMENT ON COLUMN BK_TARM_T.BTMT_CALL_TYPE     IS 'รหัสวิธีการรับเรื่อง ดูตาราง BK_CALL_TYPE_R';
COMMENT ON COLUMN BK_TARM_T.BTMT_WORK_DATE_ST  IS 'วันที่เริ่มไปปฏิบัติงาน';
COMMENT ON COLUMN BK_TARM_T.BTMT_WORK_DATE_ED  IS 'ถึงวันที่';
COMMENT ON COLUMN BK_TARM_T.BTMT_FINISH_DATE   IS 'วันที่งานเรียบร้อยแล้วทุกกรณี';
COMMENT ON COLUMN BK_TARM_T.BTMT_USER_ID       IS 'รหัสผู้ปฏิบัติงาน';
COMMENT ON COLUMN BK_TARM_T.BTMT_USER_DATE     IS 'วันที่ผู้ปฏิบัติงาน';
COMMENT ON COLUMN BK_TARM_T.BTMT_TAR_TYPE      IS 'I=Service ภายใน  O=Service ภายนอก';
COMMENT ON COLUMN BK_TARM_T.BTMT_EMPCODE_FINAL IS 'รหัสพนักงานที่ไปตามงานใบรับเรื่อง';
COMMENT ON COLUMN BK_TARM_T.BTMT_DATE_V        IS 'วันเวลาที่ตรวจถาม';
COMMENT ON COLUMN BK_TARM_T.BTMT_EMPCODE_V     IS 'รหัสพนักงานที่ตรวจถาม';
COMMENT ON COLUMN BK_TARM_T.BTMT_TRACK_DATE    IS 'วันที่มีการติดต่อทางงานของลูกค้าสัมพันธ์ กรณีงานเกิน 48 ชม.';
