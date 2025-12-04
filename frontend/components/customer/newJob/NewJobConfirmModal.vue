<template>
  <div class="relative w-full rounded-t-3xl bg-white px-5 pt-4 pb-5 shadow-lg">
    <!-- overlay ตอนกำลังบันทึก + วงกลมเปอร์เซ็น -->
    <div
      v-if="saving"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-white/90"
    >
      <div class="progress-ring" :style="{ '--value': saveProgress + '%' }">
        <span class="progress-ring__label">{{ saveProgress }}%</span>
      </div>
      <p class="mt-2 text-xs text-slate-600">กำลังบันทึกงาน...</p>
    </div>

    <div class="mb-4 mt-3 flex items-center gap-3">
      <div
        class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50"
      >
        <ClipboardCheck class="h-5 w-5 text-emerald-500" />
      </div>

      <div class="flex-1 text-left">
        <p class="text-[15px] font-semibold text-slate-900">
          ยืนยันการส่งงานแจ้งซ่อม
        </p>
        <p class="text-xs text-slate-600">
          กรุณาตรวจสอบข้อมูลก่อนยืนยัน ระบบจะบันทึกข้อมูลตามรายละเอียดด้านล่าง
        </p>
      </div>
    </div>

    <!-- SUMMARY DETAIL โทนเข้มบนพื้นเทาอ่อน -->
    <div
      class="mb-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-sm text-slate-800"
    >
      <p class="flex items-start gap-2">
        <DoorOpen class="mt-0.5 h-4 w-4 text-sky-500" />
        <span class="flex-1">
          <span class="text-slate-500">หมายเลขห้อง</span>
          <span class="ml-1 font-semibold text-slate-900">
            {{ form.room || "-" }}
          </span>
        </span>
      </p>

      <p class="flex items-start gap-2">
        <Hash class="mt-0.5 h-4 w-4 text-sky-500" />
        <span class="flex-1">
          <span class="text-slate-500">หมายเลขเครื่อง</span>
          <span
            class="ml-1 max-w-[150px] truncate text-right font-semibold text-slate-900"
          >
            {{ form.machineNo || "-" }}
          </span>
        </span>
      </p>

      <div class="flex items-start gap-2">
        <FileText class="mt-0.5 h-4 w-4 text-sky-500" />
        <div class="flex-1">
          <span class="text-slate-500">รายละเอียดงาน</span>
          <p
            class="mt-1 max-h-24 overflow-y-auto rounded-xl bg-white px-2 py-1 text-[11px] leading-snug text-slate-900"
          >
            {{ form.description || "-" }}
          </p>
        </div>
      </div>

      <p class="flex items-start gap-2">
        <Paperclip class="mt-0.5 h-4 w-4 text-sky-500" />
        <span class="flex-1">
          <span class="text-slate-500">ไฟล์แนบ</span>
          <span class="ml-1 text-slate-900">
            {{
              uploads.length
                ? `${uploads.length} ไฟล์ · รูป ${imageCount} · วิดีโอ ${videoCount}`
                : "ไม่มีไฟล์แนบ"
            }}
          </span>
        </span>
      </p>
    </div>

    <div class="flex gap-2">
      <button
        type="button"
        class="min-h-[44px] flex-1 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="saving"
        @click="emit('close')"
      >
        ยกเลิก
      </button>
      <button
        type="button"
        class="min-h-[44px] flex-1 rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 flex items-center justify-center gap-1.5"
        :disabled="saving"
        @click="emit('confirm')"
      >
        <Save class="h-4 w-4" />
        <span>{{ saving ? "กำลังบันทึก..." : "ยืนยันส่งงาน" }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ClipboardCheck,
  DoorOpen,
  Hash,
  FileText,
  Paperclip,
  Save,
} from "lucide-vue-next";
import type { UploadItem } from "@/composables/task/customer/useNewJob";

defineProps<{
  form: {
    room: string;
    machineNo: string;
    description: string;
  };
  uploads: UploadItem[];
  imageCount: number;
  videoCount: number;
  saving: boolean;
  saveProgress: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm"): void;
}>();
</script>

<style scoped>
/* วงกลม progress: ใช้สีส้มเดิม */
.progress-ring {
  --size: 56px;
  --thickness: 2px;
  --value: 0%;

  position: relative;
  width: var(--size);
  height: var(--size);
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: conic-gradient(#ff3d00 var(--value), transparent 0),
    conic-gradient(#e5e7eb 0 360deg);
  transform: rotate(-90deg);
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(50% - var(--thickness)),
    #000 calc(50% - var(--thickness) + 1px)
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(50% - var(--thickness)),
    #000 calc(50% - var(--thickness) + 1px)
  );
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
  transition: background 0.15s linear;
}

.progress-ring__label {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--size) - var(--thickness) * 6);
  height: calc(var(--size) - var(--thickness) * 6);
  border-radius: 9999px;
  background: #ffffff;
  font-size: 11px;
  font-weight: 600;
  color: #ff3d00;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(148, 163, 184, 0.25);
}
</style>
