// composables/useEmployeeLearning.ts
import { computed, ref } from "vue";

export type LearningContentType = "video" | "pdf";

export interface LearningContent {
  id: string;
  type: LearningContentType;
  label?: string;
  description?: string;
  url: string;
  // video เท่านั้น
  duration?: string;
  // pdf เท่านั้น
  pages?: number;
}

export interface LearningSubTopic {
  id: string;
  title: string;
  summary?: string;
  contents: LearningContent[]; // video / pdf เท่านั้น
}

export interface LearningPost {
  id: string;
  title: string;
  description: string; // ใช้แสดงในหน้า index เป็นคำบรรยายสั้น ๆ
  coverUrl: string;
  estimatedMinutes: number;
  createdAt: string; // ISO string
  author: string; // คนโพสต์
  viewCount: number; // จำนวนคนเข้าชม
  subTopics: LearningSubTopic[];
}

/** --------------- สร้าง mock data --------------- **/

const basePosts: LearningPost[] = [
  {
    id: "PPE-BASE",
    title: "ความปลอดภัยพื้นฐานในการทำงานภายในอาคาร",
    description:
      "ทำความรู้จัก PPE, ขั้นตอนตรวจเช็กอุปกรณ์ และตัวอย่างสถานการณ์เสี่ยงที่พบบ่อยหน้างาน.",
    coverUrl:
      "https://images.pexels.com/photos/4492041/pexels-photo-4492041.jpeg",
    estimatedMinutes: 25,
    createdAt: "2025-10-01T09:00:00+07:00",
    author: "ฝ่ายความปลอดภัย",
    viewCount: 120,
    subTopics: [
      {
        id: "ppe-overview",
        title: "ภาพรวมอุปกรณ์ป้องกันส่วนบุคคล (PPE)",
        summary:
          "ชนิดของ PPE ที่ใช้บ่อยในงานอาคาร และหลักการเลือกให้เหมาะกับความเสี่ยง.",
        contents: [
          {
            id: "ppe-video-1",
            type: "video",
            label: "วิดีโอแนะนำ PPE สำหรับพนักงานใหม่",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: "08:45",
            description:
              "แนะนำหมวกนิรภัย, ถุงมือ, แว่นตา และรองเท้านิรภัย พร้อมตัวอย่างการใช้งานจริง.",
          },
          {
            id: "ppe-pdf-1",
            type: "pdf",
            label: "คู่มือ PPE ฉบับย่อ",
            url: "https://example.com/mock-ppe-guide.pdf",
            pages: 4,
            description:
              "สรุปขั้นตอนตรวจเช็ก PPE ก่อนใช้งาน และวิธีเก็บรักษาอย่างถูกต้อง.",
          },
        ],
      },
      {
        id: "ppe-ladder",
        title: "การใช้บันไดและทำงานบนที่สูงอย่างปลอดภัย",
        summary:
          "พื้นฐานการตั้งบันได มุมเอียงที่ปลอดภัย และตัวอย่างกรณีอุบัติเหตุจากการใช้บันไดผิดวิธี.",
        contents: [
          {
            id: "ladder-video-1",
            type: "video",
            label: "ตัวอย่างสถานการณ์เสี่ยงจากการใช้บันไดผิดวิธี",
            url: "https://www.youtube.com/watch?v=V-_O7nl0Ii0",
            duration: "06:30",
          },
          {
            id: "ladder-pdf-1",
            type: "pdf",
            label: "เช็กลิสต์ก่อนใช้บันได",
            url: "https://example.com/mock-ladder-checklist.pdf",
            pages: 2,
          },
        ],
      },
    ],
  },
  {
    id: "ELEC-BASE",
    title: "พื้นฐานระบบไฟฟ้าภายในอาคารสำหรับช่างใหม่",
    description:
      "ทำความเข้าใจวงจรไฟฟ้าพื้นฐาน, เมนเบรกเกอร์, เซอร์กิตย่อย และความเสี่ยงหลักที่ต้องระวัง.",
    coverUrl:
      "https://images.pexels.com/photos/4254168/pexels-photo-4254168.jpeg",
    estimatedMinutes: 35,
    createdAt: "2025-09-10T13:30:00+07:00",
    author: "ทีมวิศวกรรมอาคาร",
    viewCount: 230,
    subTopics: [
      {
        id: "elec-panel",
        title: "โครงสร้างตู้เมนไฟและเซอร์กิตย่อย",
        summary:
          "การอ่านสติ๊กเกอร์ระบุวงจร, การปิดเปิดเบรกเกอร์อย่างปลอดภัย และการแยกโหลด.",
        contents: [
          {
            id: "elec-video-1",
            type: "video",
            label: "วิดีโอแนะนำตู้เมนไฟในคอนโด",
            url: "https://www.youtube.com/watch?v=ysz5P8qQRiQ",
            duration: "10:20",
          },
          {
            id: "elec-pdf-1",
            type: "pdf",
            label: "คู่มือการปิด-เปิดเบรกเกอร์",
            url: "https://example.com/mock-elec-breaker.pdf",
            pages: 6,
          },
        ],
      },
      {
        id: "elec-lockout",
        title: "แนวทาง Lockout/Tagout เบื้องต้น",
        summary:
          "การป้องกันการเปิดสวิตช์โดยไม่ตั้งใจระหว่างดำเนินงาน และตัวอย่างป้ายเตือน.",
        contents: [
          {
            id: "elec-pdf-2",
            type: "pdf",
            label: "ตัวอย่างฟอร์ม Lockout/Tagout",
            url: "https://example.com/mock-lockout-tagout.pdf",
            pages: 3,
          },
        ],
      },
    ],
  },
  {
    id: "SERVICE-BASE",
    title: "การบริการลูกบ้านและการอธิบายงานซ่อมอย่างเข้าใจง่าย",
    description:
      "สื่อการเรียนรู้สำหรับการอธิบายงานให้ลูกบ้านเข้าใจ และสร้างความมั่นใจในงานบริการ.",
    coverUrl:
      "https://images.pexels.com/photos/3790842/pexels-photo-3790842.jpeg",
    estimatedMinutes: 20,
    createdAt: "2025-09-20T10:15:00+07:00",
    author: "ฝ่ายบริการลูกบ้าน",
    viewCount: 95,
    subTopics: [
      {
        id: "service-communication",
        title: "ตัวอย่างบทสนทนาก่อนเริ่มงานซ่อม",
        summary:
          "วิธีอธิบายปัญหาและขั้นตอนการซ่อมให้ลูกบ้านเข้าใจตั้งแต่ต้น.",
        contents: [
          {
            id: "service-video-1",
            type: "video",
            label: "ตัวอย่างการสื่อสารกับลูกบ้าน (Simulation)",
            url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
            duration: "07:05",
          },
        ],
      },
      {
        id: "service-pdf",
        title: "สคริปต์คำพูดแนะนำการใช้งานหลังซ่อมเสร็จ",
        summary:
          "ตัวอย่างคำพูดสั้น ๆ ที่ใช้อธิบายวิธีใช้งาน และการแจ้งหากพบปัญหาในอนาคต.",
        contents: [
          {
            id: "service-pdf-1",
            type: "pdf",
            label: "ตัวอย่างสคริปต์แนะนำลูกบ้าน",
            url: "https://example.com/mock-service-script.pdf",
            pages: 2,
          },
        ],
      },
    ],
  },
];

// สร้างโพสต์จำนวนมากไว้ใช้ทดสอบ load more
function createManyPosts(): LearningPost[] {
  const result: LearningPost[] = [];

  // 8 รอบ = 24 posts (อยากได้เยอะกว่านี้ เพิ่มตัวเลขนี้ได้เลย)
  for (let batch = 0; batch < 8; batch++) {
    basePosts.forEach((base, idx) => {
      const index = batch * basePosts.length + idx + 1;
      const baseDate = new Date(base.createdAt);
      baseDate.setDate(baseDate.getDate() + batch * 3);

      result.push({
        ...base,
        id: `${base.id}-${index}`,
        title: `${base.title} (รุ่นที่ ${batch + 1})`,
        createdAt: baseDate.toISOString(),
        // ปรับ viewCount ให้ดูเปลี่ยนไปแต่ละรุ่น
        viewCount: base.viewCount + batch * 40 + idx * 10,
      });
    });
  }

  return result;
}

/** --------------- state + helper --------------- **/

const postsState = ref<LearningPost[]>(createManyPosts());

export function useEmployeeLearning() {
  const posts = computed(() => postsState.value);

  const findPostById = (id: string) =>
    posts.value.find((p) => p.id === id);

  return {
    posts,
    findPostById,
  };
}
