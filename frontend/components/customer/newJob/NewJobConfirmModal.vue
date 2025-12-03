<template>
  <div class="relative w-full rounded-t-3xl bg-white p-5 pb-5 shadow-lg">
    <!-- overlay ตอนกำลังบันทึก + วงกลมเปอร์เซ็น -->
    <div
      v-if="saving"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/90"
    >
      <div class="progress-ring" :style="{ '--value': saveProgress + '%' }">
        <span class="progress-ring__label">{{ saveProgress }}%</span>
      </div>
      <p class="mt-2 text-xs text-slate-600">กำลังบันทึกงาน...</p>
    </div>

    <div
      class="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50"
    >
      <AlertTriangle class="h-6 w-6 text-amber-600" />
    </div>

    <p class="mb-1 text-base font-semibold text-slate-900">
      ยืนยันการส่งงานแจ้งซ่อม
    </p>
    <p class="mb-3 text-[11px] text-slate-600">
      กรุณาตรวจสอบข้อมูลก่อนยืนยัน ระบบจะบันทึกข้อมูลตามรายละเอียดด้านล่าง
    </p>

    <!-- summary detail -->
    <div
      class="mb-4 space-y-1.5 rounded-2xl bg-slate-50 px-3 py-2 text-left text-[11px] text-slate-700"
    >
      <div class="flex justify-between gap-2">
        <span class="text-slate-500">หมายเลขห้อง</span>
        <span class="font-semibold">{{ form.room || "-" }}</span>
      </div>
      <div class="flex justify-between gap-2">
        <span class="text-slate-500">หมายเลขเครื่อง</span>
        <span class="max-w-[150px] truncate text-right">
          {{ form.machineNo || "-" }}
        </span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-slate-500">รายละเอียดงาน</span>
        <p
          class="max-h-24 overflow-y-auto rounded-xl bg-white px-2 py-1 text-[11px] leading-snug"
        >
          {{ form.description || "-" }}
        </p>
      </div>
      <div class="flex justify-between gap-2">
        <span class="text-slate-500">ไฟล์แนบ</span>
        <span class="text-right">
          {{
            uploads.length
              ? `${uploads.length} ไฟล์ · รูป ${imageCount} · วิดีโอ ${videoCount}`
              : "ไม่มีไฟล์แนบ"
          }}
        </span>
      </div>
    </div>

    <div class="flex gap-2">
      <button
        type="button"
        class="min-h-[44px] flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="saving"
        @click="emit('close')"
      >
        ยกเลิก
      </button>
      <button
        type="button"
        class="min-h-[44px] flex-1 rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
        :disabled="saving"
        @click="emit('confirm')"
      >
        {{ saving ? "กำลังบันทึก..." : "ยืนยันส่งงาน" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle } from "lucide-vue-next";
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
/* วงกลม progress ขึ้นตามเปอร์เซ็นจาก axios */
.progress-ring {
  --size: 56px;
  --thickness: 4px;
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
