import type { PayLoadActive, PayLoadActiveFinish, PayLoadRate, RateResult } from "@/types/task";
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

  async getTimeline(id: string, isCanRate: boolean) {
    await new Promise((r) => setTimeout(r, 200));
    const config = useRuntimeConfig();
    return await $fetch<any[]>(`/api/tasks/time-line`, {
      baseURL: config.public.apiBase,
      query: useBuildPayload({ tarNo: id, isCanRate }),
    });
  },

  async getDetail(id: string) {
    await new Promise((r) => setTimeout(r, 200));
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

    await new Promise((r) => setTimeout(r, 200));
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

  async activeTask(data = {} as PayLoadActive) {
    const config = useRuntimeConfig();
    await new Promise((r) => setTimeout(r, 200));
    return await $fetch<any>(`/api/tasks/update-status/${data.typeSeq}`, {
      baseURL: config.public.apiBase,
      method: "put",
      body: useBuildPayload({ jobNo: data.jobNo, typeCode: data.typeCode }),
    });
  },

  async getTaskDate(jobNo: string) {
    const config = useRuntimeConfig();
    return await $fetch<any>(`/api/tasks/date-task`, {
      baseURL: config.public.apiBase,
      method: "get",
      query: useBuildPayload({ jobNo }),
    });
  },

  async activeTaskFinish(data = {} as PayLoadActiveFinish) {
    const config = useRuntimeConfig();
    await new Promise((r) => setTimeout(r, 200));
    return await $fetch<any>(
      `/api/tasks/update-status-finish/${data.typeSeq}`,
      {
        baseURL: config.public.apiBase,
        method: "put",
        body: useBuildPayload({ ...data }),
      }
    );
  },

  async rateTask(data = {} as PayLoadRate) {
    const config = useRuntimeConfig();
    await new Promise((r) => setTimeout(r, 200));
    return await $fetch<RateResult>(`/api/tasks/process-job-scoring-workflow`, {
      baseURL: config.public.apiBase,
      method: "post",
      body: useBuildPayload({ ...data }),
    });
  },
};
