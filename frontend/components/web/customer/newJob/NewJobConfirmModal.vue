<template>
  <div class="relative w-full max-w-lg bg-[var(--bg-surface)] rounded-2xl p-6 shadow-xl">
    <div v-if="saving"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-surface)]/90">
      <div class="progress-ring" :style="{ '--value': saveProgress + '%' }">
        <span class="progress-ring__label">{{ saveProgress }}%</span>
      </div>
      <p class="mt-2 text-sm text-[var(--text-secondary)]">กำลังบันทึกงาน...</p>
    </div>

    <div class="mb-6 flex items-center gap-3">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--color-secondary-50)]">
        <ClipboardCheck class="h-6 w-6 text-[var(--color-primary-500)]" />
      </div>

      <div class="flex-1">
        <p class="text-lg font-semibold text-[var(--text-primary)]">
          ยืนยันการส่งงานแจ้งซ่อม
        </p>
        <p class="text-sm text-[var(--text-secondary)]">
          กรุณาตรวจสอบข้อมูลก่อนยืนยัน ระบบจะบันทึกข้อมูลตามรายละเอียดด้านล่าง
        </p>
      </div>
    </div>

    <!-- SUMMARY DETAIL -->
    <div class="mb-6 space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--color-secondary-50)] p-4">
      <p class="flex items-start gap-2 text-sm">
        <DoorOpen class="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary-500)]" />
        <span class="flex-1">
          <span class="text-[var(--text-secondary)]">หมายเลขห้อง</span>
          <span class="ml-2 font-semibold text-[var(--text-primary)]">
            {{ form.room || "-" }}
          </span>
        </span>
      </p>

      <p class="flex items-start gap-2 text-sm">
        <Hash class="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary-500)]" />
        <span class="flex-1">
          <span class="text-[var(--text-secondary)]">หมายเลขเครื่อง</span>
          <span class="ml-2 font-semibold text-[var(--text-primary)]">
            {{ form.machineNo || "-" }}
          </span>
        </span>
      </p>

      <div class="flex items-start gap-2 text-sm">
        <FileText class="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary-500)]" />
        <div class="flex-1">
          <span class="text-[var(--text-secondary)]">รายละเอียดงาน</span>
          <p
            class="mt-1 max-h-32 overflow-y-auto rounded-lg bg-[var(--bg-surface)] px-3 py-2 text-xs leading-relaxed text-[var(--text-primary)]">
            {{ form.description || "-" }}
          </p>
        </div>
      </div>

      <p class="flex items-start gap-2 text-sm">
        <Paperclip class="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary-500)]" />
        <span class="flex-1">
          <span class="text-[var(--text-secondary)]">ไฟล์แนบ</span>
          <span class="ml-2 text-[var(--text-primary)]">
            {{
              uploads.length
                ? `${uploads.length} ไฟล์ · รูป ${imageCount} · วิดีโอ ${videoCount}`
                : "ไม่มีไฟล์แนบ"
            }}
          </span>
        </span>
      </p>
    </div>

    <div class="flex gap-3">
      <button type="button"
        class="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--color-secondary-50)] disabled:cursor-not-allowed disabled:opacity-40 transition"
        :disabled="saving" @click="emit('close')">
        ยกเลิก
      </button>
      <button type="button"
        class="flex-1 rounded-xl bg-[var(--color-primary-500)] px-4 py-3 text-sm font-semibold text-[var(--text-inverse)] shadow-sm hover:bg-[var(--color-primary-600)] disabled:cursor-not-allowed disabled:bg-[var(--color-secondary-300)] flex items-center justify-center gap-2 transition"
        :disabled="saving" @click="emit('confirm')">
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
.progress-ring {
  --size: 64px;
  --thickness: 3px;
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
  background: conic-gradient(var(--color-error-500) var(--value), transparent 0),
    conic-gradient(var(--color-secondary-200) 0 360deg);
  transform: rotate(-90deg);
  -webkit-mask: radial-gradient(farthest-side,
      transparent calc(50% - var(--thickness)),
      #000 calc(50% - var(--thickness) + 1px));
  mask: radial-gradient(farthest-side,
      transparent calc(50% - var(--thickness)),
      #000 calc(50% - var(--thickness) + 1px));
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
  background: var(--bg-surface);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-error-500);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08),
    0 0 0 1px var(--border-subtle);
}
</style>





