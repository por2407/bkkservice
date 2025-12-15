<template>
  <div class="relative w-full max-w-2xl bg-[var(--bg-surface)] rounded-2xl p-6 shadow-xl">
    <div v-if="summaryLoading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-surface)]/90">
      <span class="loader"></span>
      <p class="mt-2 text-sm text-[var(--text-secondary)]">กำลังบันทึกสรุปงาน...</p>
    </div>

    <!-- header modal -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
          <ClipboardList class="h-5 w-5 text-[var(--color-primary-600)]" />
        </div>
        <div>
          <p class="text-base font-semibold text-[var(--text-primary)]">
            บันทึกสรุปงาน
          </p>
          <p class="text-xs text-[var(--text-secondary)]">
            กรอกข้อมูลการปฏิบัติงานหน้างาน
          </p>
        </div>
      </div>

      <button type="button"
        class="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-secondary-100)] text-[var(--text-secondary)] hover:bg-[var(--color-secondary-200)] transition"
        :disabled="summaryLoading" @click="$emit('close')">
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- ฟอร์ม -->
    <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      <!-- วันเวลาเริ่ม -->
      <div>
        <label class="block text-sm font-semibold text-[var(--text-primary)] mb-2">
          วันเวลาเริ่มปฏิบัติงาน
        </label>
        <ThaiDateTimePicker v-model="scheduleStart" variant="popover" size="md" :minute-step="5"
          time-zone="Asia/Bangkok" accent-class="text-[var(--color-primary-600)]" :disabled="false" />
      </div>

      <!-- วันเวลาสิ้นสุด -->
      <div>
        <label class="block text-sm font-semibold text-[var(--text-primary)] mb-2">
          วันเวลาสิ้นสุดปฏิบัติงาน
        </label>
        <ThaiDateTimePicker v-model="scheduleEnd" variant="popover" size="md" :minute-step="5"
          time-zone="Asia/Bangkok" accent-class="text-[var(--color-primary-600)]" :disabled="false" />
      </div>

      <!-- วิธีการดำเนินงาน -->
      <div>
        <label class="block text-sm font-semibold text-[var(--text-primary)] mb-2">
          วิธีการดำเนินงาน / วิธีแก้ไข
        </label>
        <textarea rows="4" v-model="workSummary.process"
          class="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] outline-none transition resize-none"
          placeholder="อธิบายขั้นตอนการแก้ไขโดยย่อ..."></textarea>
      </div>

      <!-- งานค้าง / ต้องติดตาม -->
      <div>
        <label class="block text-sm font-semibold text-[var(--text-primary)] mb-2">
          งานที่ยังไม่เสร็จ / สิ่งที่ต้องติดตามต่อ
        </label>
        <textarea rows="3" v-model="workSummary.pending"
          class="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] outline-none transition resize-none"
          placeholder="ระบุถ้ามีงานค้าง หรือสิ่งที่ต้องตามต่อ..."></textarea>
      </div>
    </div>

    <!-- footer buttons -->
    <div class="mt-6 flex gap-3">
      <button type="button"
        class="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--color-secondary-50)] disabled:opacity-40 disabled:cursor-not-allowed transition"
        :disabled="summaryLoading" @click="$emit('close')">
        ยกเลิก
      </button>
      <button type="button"
        class="flex-1 rounded-xl bg-[var(--color-primary-500)] px-4 py-3 text-sm font-medium text-[var(--text-inverse)] shadow-sm hover:bg-[var(--color-primary-600)] disabled:bg-[var(--color-secondary-300)] disabled:cursor-not-allowed transition"
        :disabled="!canSubmitSummary || summaryLoading" @click="confirmWorkSummaryOpen">
        {{ summaryLoading ? "กำลังบันทึก..." : "บันทึกสรุปงาน" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, ClipboardList } from "lucide-vue-next";
import ThaiDateTimePicker from "@/components/share/ThaiDateTimePicker.vue";
import { fromLocalInputString, toLocalInputString } from "@/utils/date";

type WorkSummary = {
  startTime: string;
  endTime: string;
  process: string;
  pending: string;
};

const props = defineProps<{
  summaryLoading: boolean;
  workSummary: WorkSummary;
  startTime?: string;
  item?: any;
  confirmWorkSummaryOpen: () => void;
  formatSummaryDateTime: (val: string) => string;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const scheduleStart = computed<Date | null>({
  get() {
    return props.workSummary.startTime
      ? fromLocalInputString(props.workSummary.startTime)
      : null;
  },
  set(d) {
    props.workSummary.startTime = d ? toLocalInputString(d) : "";
  },
});

const scheduleEnd = computed<Date | null>({
  get() {
    return props.workSummary.endTime
      ? fromLocalInputString(props.workSummary.endTime)
      : null;
  },
  set(d) {
    props.workSummary.endTime = d ? toLocalInputString(d) : "";
  },
});

const canSubmitSummary = computed(() => {
  return (
    !!props.workSummary.startTime &&
    !!props.workSummary.endTime &&
    props.workSummary.process.trim().length > 0
  );
});

watch(() => props.startTime, (val) => {
  props.workSummary.startTime = val ? toLocalInputString(new Date(val)) : toLocalInputString(new Date());
  props.workSummary.endTime = toLocalInputString(new Date());
});
</script>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid;
  border-color: var(--color-primary-500) transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-secondary-200);
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-secondary-300);
}
</style>





