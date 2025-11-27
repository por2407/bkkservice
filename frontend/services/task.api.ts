import type { Task, TaskDetail, TaskStatus } from "@/types/task";
import { useBuildPayload } from "@/composables/useBuildPayload";

const baseTasks: Task[] = [
  {
    id: "TSK-0001",
    ticket: "TSK-0001",
    room: "1205",
    description: "แอร์ไม่เย็น มีเสียงดังตอนเปิดโหมดเย็น ขอช่างเช็กด่วน",
    status: "in_progress",
    updatedAt: "2025-11-13T09:24:00+07:00",
    dueDate: "2025-11-14T17:00:00+07:00",
    hasImage: true,
    hasVideo: true,
    commentsCount: 3,
    canRate: false,
    rating: null,
  },
  {
    id: "TSK-0002",
    ticket: "TSK-0002",
    room: "803",
    description: "ไฟในห้องน้ำไม่ติด อาจเป็นที่เบรกเกอร์",
    status: "in_progress",
    updatedAt: "2025-11-13T08:10:00+07:00",
    dueDate: "2025-11-15T17:00:00+07:00",
    hasVideo: true,
    commentsCount: 1,
    canRate: false,
    rating: null,
  },
  {
    id: "TSK-0003",
    ticket: "TSK-0003",
    room: "1502",
    description: "ประตูระเบียงปิดไม่สนิท มีเสียงลมแรงตอนกลางคืน",
    status: "in_progress",
    updatedAt: "2025-11-12T15:32:00+07:00",
    dueDate: "2025-11-16T17:00:00+07:00",
    hasImage: true,
    commentsCount: 0,
    canRate: false,
    rating: null,
  },
  {
    id: "TSK-0004",
    ticket: "TSK-0004",
    room: "607",
    description: "เปลี่ยนรีโมตทีวี ลูกค้าทำตกแล้วใช้งานไม่ได้",
    status: "done",
    updatedAt: "2025-11-12T10:18:00+07:00",
    dueDate: "2025-11-12T16:00:00+07:00",
    commentsCount: 2,
    canRate: true,
    rating: 4,
  },
  {
    id: "TSK-0005",
    ticket: "TSK-0005",
    room: "302",
    description: "ฝักบัวรั่ว น้ำกระเด็นออกนอกโซนอาบน้ำ",
    status: "in_progress",
    updatedAt: "2025-11-11T18:42:00+07:00",
    dueDate: "2025-11-17T17:00:00+07:00",
    commentsCount: 0,
    canRate: true,
    rating: null,
  },
];

// descriptions เอาไว้สลับๆ กันให้ดูไม่ซ้ำ
const descriptions = [
  "แอร์ไม่เย็น มีเสียงดังตอนเปิดโหมดเย็น ขอช่างเช็กด่วน",
  "ไฟในห้องน้ำไม่ติด อาจเป็นที่เบรกเกอร์",
  "ประตูระเบียงปิดไม่สนิท มีเสียงลมแรงตอนกลางคืน",
  "ฝักบัวรั่ว น้ำกระเด็นออกนอกโซนอาบน้ำ",
  "อินเทอร์เน็ตช้า หลุดบ่อยระหว่างประชุมออนไลน์",
  "เตียงนอนมีเสียงเอี๊ยดอ๊าดเวลาขยับตัว",
  "ชักโครกมีกลิ่นย้อนขึ้นมาแรง",
];

const mockTasks: Task[] = [...baseTasks];

for (let no = baseTasks.length + 1; no <= 150; no++) {
  const id = `TSK-${no.toString().padStart(4, "0")}`;
  const room = (100 + (no * 7) % 1500).toString(); // สุ่มเลขห้องแบบ deterministic
  const status: TaskStatus = no % 4 === 0 ? "done" : "in_progress";

  const day = 1 + (no % 28);
  const hour = 8 + (no % 10);

  const updatedAt = `2025-11-${String(day).padStart(
    2,
    "0"
  )}T${String(hour).padStart(2, "0")}:00:00+07:00`;

  const dueDay = ((day + 2 - 1) % 28) + 1; // เลื่อนกำหนด 2 วัน
  const dueDate = `2025-11-${String(dueDay).padStart(2, "0")}T17:00:00+07:00`;

  const description =
    descriptions[no % descriptions.length] ??
    "งานซ่อมทั่วไป ใช้สำหรับ mock data";

  const commentsCount = no % 5;
  const canRate = status === "done";
  const rating = canRate && commentsCount > 0 ? (no % 5) + 1 : null;

  mockTasks.push({
    id,
    ticket: id,
    room,
    description,
    status,
    updatedAt,
    dueDate,
    hasImage: no % 2 === 0,
    hasVideo: no % 3 === 0,
    commentsCount,
    canRate,
    rating,
  });
}

const mockTaskDetails: TaskDetail[] = [
  {
    id: "TSK-0001",
    room: "1205",
    description: "แอร์ไม่เย็น มีเสียงดังตอนเปิดโหมดเย็น ขอช่างเช็กด่วน",
    status: "in_progress",
    updatedAt: "2025-11-13T09:24:00+07:00",
    currentStep: 4,
    media: [
      {
        type: "image",
        url: "https://images.pexels.com/photos/3768913/pexels-photo-3768913.jpeg",
      },
      {
        type: "image",
        url: "https://images.pexels.com/photos/3968102/pexels-photo-3968102.jpeg",
      },
      {
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ],
    timeline: [
      {
        step: 1,
        finishedAt: "2025-11-10T10:12:26+07:00",
        operator: "นางสาว ภัทธาวดี อภิชิรัญโชติ",
      },
      {
        step: 2,
        finishedAt: "2025-11-10T10:18:04+07:00",
        operator: "นางสาว ภัทธาวดี อภิชิรัญโชติ",
      },
      {
        step: 3,
        finishedAt: "2025-11-12T08:35:46+07:00",
        operator: "นาย สรวิชญ์ สมจิตร",
      },
      {
        step: 4,
        dueAt: "2025-11-30T00:00:00+07:00",
      },
      {
        step: 5,
        dueAt: "2025-12-01T00:00:00+07:00",
      },
    ],
  },
  {
    id: "TSK-0002",
    room: "803",
    description: "ไฟในห้องน้ำไม่ติด อาจเป็นที่เบรกเกอร์",
    status: "in_progress",
    updatedAt: "2025-11-13T08:10:00+07:00",
    currentStep: 2,
    media: [
      {
        type: "image",
        url: "https://images.pexels.com/photos/4107014/pexels-photo-4107014.jpeg",
      },
    ],
  },
  {
    id: "TSK-0003",
    room: "1502",
    description: "ประตูระเบียงปิดไม่สนิท มีเสียงลมแรงตอนกลางคืน",
    status: "in_progress",
    updatedAt: "2025-11-12T15:32:00+07:00",
    currentStep: 3,
    media: [
      {
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ],
  },
  {
    id: "TSK-0004",
    room: "607",
    description: "เปลี่ยนรีโมตทีวี ลูกค้าทำตกแล้วใช้งานไม่ได้",
    status: "done",
    updatedAt: "2025-11-12T10:18:00+07:00",
    currentStep: 5,
    media: [],
  },
  {
    id: "TSK-0005",
    room: "302",
    description: "ฝักบัวรั่ว น้ำกระเด็นออกนอกโซนอาบน้ำ",
    status: "in_progress",
    updatedAt: "2025-11-11T18:42:00+07:00",
    currentStep: 1,
    media: [],
  },
];

export const taskApi = {
  async getList() {
    await new Promise((r) => setTimeout(r, 500));
    return mockTasks;
    // const config = useRuntimeConfig();
    // return await $fetch<any[]>(`/api/tasks/list`, {
    //   baseURL: config.public.apiBase,
    //   query: useBuildPayload({}),
    // });
  },

  async getDetail(id: string) {
    // return await $fetch<TaskDetail>(`/api/tasks/${id}`);
    await new Promise((r) => setTimeout(r, 500));
    const found = mockTaskDetails.find((t) => t.id === id);
    return found ?? null;
  },
};
