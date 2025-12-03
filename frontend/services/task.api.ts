import type { Task, TaskDetail, TaskStatus } from "@/types/task";
import { useBuildPayload } from "@/composables/useBuildPayload";
import axios, { type AxiosProgressEvent } from "axios";

export interface CreateTaskInput {
  room: string;
  machineNo?: string;
  description: string;
}

export const taskApi = {
  async getList() {
    // await new Promise((r) => setTimeout(r, 500));
    const config = useRuntimeConfig();
    return await $fetch<any[]>(`/api/tasks/list`, {
      baseURL: config.public.apiBase,
      query: useBuildPayload({}),
    });
  },

  async getTimeline(id: string) {
    await new Promise((r) => setTimeout(r, 200))
    const config = useRuntimeConfig();
    return await $fetch<any[]>(`/api/tasks/time-line`, {
      baseURL: config.public.apiBase,
      query: useBuildPayload({ tarNo: id }),
    });
  },

  async getDetail(id: string) {
    await new Promise((r) => setTimeout(r, 200))
    const config = useRuntimeConfig();
    return await $fetch<any>(`/api/tasks/detail`, {
      baseURL: config.public.apiBase,
      query: useBuildPayload({ tarNo: id }),
    });
  },

  /**
   * สร้างงานใหม่ + อัปโหลดไฟล์ พร้อม onUploadProgress สำหรับทำ progress ring
   */
  async createTask(
    data: CreateTaskInput,
    files: File[],
    onUploadProgress?: (e: AxiosProgressEvent) => void
  ) {
    const config = useRuntimeConfig();

    // 1) build payload ตามของเดิม
    const payload = useBuildPayload({
      room: data.room,
      machineNo: data.machineNo,
      description: data.description,
    });

    // 2) FormData
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // 3) แนบไฟล์ทั้งหมดใน key "image"
    files.forEach((file) => {
      formData.append("image", file);
    });

    // 4) ยิงไป backend จริง ผ่าน baseURL จาก runtimeConfig
    return await axios.post(
      `${config.public.apiBase}/api/tasks/create-task`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
      }
    );
  },
};
