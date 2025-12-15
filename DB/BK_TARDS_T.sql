-- File : BK_TARDS_T.sql
-- Oracle 11g - Create table BK_TARDS_T

CREATE TABLE BK_TARDS_T
(
    BTDST_NO             VARCHAR2(9)   NOT NULL,
    BTDST_ITEM           NUMBER(3),
    BTDST_SEQ            NUMBER(3),
    BTDST_DATE_ST        DATE,
    BTDST_DATE_ED        DATE,
    BTDST_EMP_CODE       VARCHAR2(6),
    BTDST_W_CASE         VARCHAR2(500),
    BTDST_C_CASE         VARCHAR2(8),
    BTDST_STATUS         VARCHAR2(1),
    BTDST_STATUS_DATE    DATE,
    BTDST_USER_ID        VARCHAR2(15),
    BTDST_USER_DATE      DATE,
    BTDST_JOB_SERVICE_NO VARCHAR2(8),
    BTDST_PHONE_CALL_FLG VARCHAR2(1),
    BTDST_PHONE_CALL_DET VARCHAR2(100),
    BTDST_CUST_SIGN_FLG  VARCHAR2(1),
    BTDST_SUBMIT_DATE    DATE,
    BTDST_NOK_CASE       VARCHAR2(500),
    BTDST_SCORE          VARCHAR2(1),
    BTDST_ACCEPT_DATE    DATE,
    BTDST_TEL_CUST       NUMBER(3),
    BTDST_TEL_DATE       DATE,
    BTDST_TEL_RMK        VARCHAR2(500),
    BTDST_TEL_EMP        VARCHAR2(6),
    BTDST_CO_TEL_DET     VARCHAR2(500),
    BTDST_CO_TEL_DATE    DATE,
    BTDST_CO_EMP_TEL     VARCHAR2(6),
    BTDST_PR_TEL_DET     VARCHAR2(500),
    BTDST_PR_TEL_DATE    DATE,
    BTDST_PR_EMP_TEL     VARCHAR2(6)
);

-- ===== Column Comments =====
COMMENT ON COLUMN BK_TARDS_T.BTDST_NO             IS 'เลขที่รับเรื่อง ดูตาราง BK_TARD_T';
COMMENT ON COLUMN BK_TARDS_T.BTDST_ITEM           IS 'รายการที่ ดูตาราง BK_TARD_T';
COMMENT ON COLUMN BK_TARDS_T.BTDST_SEQ            IS 'ครั้งที่เปลี่ยน/แก้ไข';
COMMENT ON COLUMN BK_TARDS_T.BTDST_DATE_ST        IS 'วันที่เริ่มไป';
COMMENT ON COLUMN BK_TARDS_T.BTDST_DATE_ED        IS 'ถึงวันที่';
COMMENT ON COLUMN BK_TARDS_T.BTDST_EMP_CODE       IS 'รหัสพนักงานที่ไป';
COMMENT ON COLUMN BK_TARDS_T.BTDST_W_CASE         IS 'รายละเอียดของการแก้ไข/ซ่อม';
COMMENT ON COLUMN BK_TARDS_T.BTDST_C_CASE         IS 'เอกสารอ้างอิง เลขที่เอกสารจ้างซ่อม ใบส่งมอบกรณีที่เปลี่ยนอุปกรณ์ ใบสั่งซื้อ';
COMMENT ON COLUMN BK_TARDS_T.BTDST_STATUS         IS 'สถานะการแก้ไข ว่าง=ยังไม่เสร็จ Y=จบงานรายการนี้';
COMMENT ON COLUMN BK_TARDS_T.BTDST_STATUS_DATE    IS 'วันที่เปลี่ยนแปลงสถานะล่าสุด';
COMMENT ON COLUMN BK_TARDS_T.BTDST_USER_ID        IS 'รหัสผู้ปฏิบัติงาน';
COMMENT ON COLUMN BK_TARDS_T.BTDST_USER_DATE      IS 'วันที่ผู้ปฏิบัติงาน';
COMMENT ON COLUMN BK_TARDS_T.BTDST_JOB_SERVICE_NO IS 'เลขที่ใบแจ้งงาน IYYMM999';
COMMENT ON COLUMN BK_TARDS_T.BTDST_PHONE_CALL_FLG IS 'Y=โทร N=ไม่ได้โทร 0=ส่งจดหมาย ว่ายังไม่ได้ทำอะไรเลย';
COMMENT ON COLUMN BK_TARDS_T.BTDST_PHONE_CALL_DET IS 'กรณีตอบ N ให้บันทึกถึงสาเหตุว่าไม่ได้โทร';
COMMENT ON COLUMN BK_TARDS_T.BTDST_CUST_SIGN_FLG  IS 'Y=มีลายเซ็นต์ ว่าง=ไม่มีลายเซ็นต์';
COMMENT ON COLUMN BK_TARDS_T.BTDST_SUBMIT_DATE    IS 'เวลาที่ทำการสรุป';
COMMENT ON COLUMN BK_TARDS_T.BTDST_NOK_CASE       IS 'รายละเอียดที่ยังไม่แล้วเสร็จ';
COMMENT ON COLUMN BK_TARDS_T.BTDST_SCORE          IS 'ระดับคะแนนที่สามารถให้ มี A,B,C,D,F';
COMMENT ON COLUMN BK_TARDS_T.BTDST_ACCEPT_DATE    IS 'วันเวลาที่รับทราบ';
COMMENT ON COLUMN BK_TARDS_T.BTDST_TEL_CUST       IS 'รหัสผู้ติดต่อส่วนงานที่โทรไปหา';
COMMENT ON COLUMN BK_TARDS_T.BTDST_TEL_DATE       IS 'วันเวลาที่โทร';
COMMENT ON COLUMN BK_TARDS_T.BTDST_TEL_RMK        IS 'หมายเหตุการโทร';
COMMENT ON COLUMN BK_TARDS_T.BTDST_TEL_EMP        IS 'รหัสพนักงานผู้โทร';
COMMENT ON COLUMN BK_TARDS_T.BTDST_CO_TEL_DET     IS 'รายละเอียดการติดต่อกลับไปยังลูกค้าหรือจดหมายประสานงานหลังแก้ไขงานเรียบร้อย';
COMMENT ON COLUMN BK_TARDS_T.BTDST_CO_TEL_DATE    IS 'วันเวลาที่ประสานงานบันทึกการติดต่อภายนอก';
COMMENT ON COLUMN BK_TARDS_T.BTDST_CO_EMP_TEL     IS 'รหัสผู้โทรติดต่อภายนอก';
COMMENT ON COLUMN BK_TARDS_T.BTDST_PR_TEL_DET     IS 'รายละเอียดการติดต่อกลับไปยังลูกค้าหรือจดหมายถึงลูกค้าสัมพันธ์หลังแก้ไขงานเรียบร้อย';
COMMENT ON COLUMN BK_TARDS_T.BTDST_PR_TEL_DATE    IS 'วันเวลาที่ลูกค้าสัมพันธ์บันทึกการติดต่อทางงาน';
COMMENT ON COLUMN BK_TARDS_T.BTDST_PR_EMP_TEL     IS 'รหัสผู้โทรติดต่อ';

