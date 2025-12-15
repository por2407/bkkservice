<template>
  <div class="relative w-full max-w-lg bg-[var(--bg-surface)] rounded-2xl p-6 shadow-xl">
    <div v-if="Loading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-[var(--bg-surface)]/90">
      <span class="loader"></span>
      <p class="mt-2 text-sm text-[var(--text-secondary)]">กำลังอัปเดตการทำงาน...</p>
    </div>

    <div class="text-center mb-6">
      <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full"
        :class="isFinalStep ? 'bg-[var(--color-primary-50)]' : 'bg-[var(--color-error-50)]'">
        <AlertCircle class="w-7 h-7"
          :class="isFinalStep ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-error-600)]'" />
      </div>
      <h2 class="text-xl font-semibold mb-2"
        :class="isFinalStep ? 'text-[var(--color-primary-700)]' : 'text-[var(--color-error-700)]'">
        {{ isFinalStep ? "ยืนยันในการบันทึกสรุปงาน" : "ยืนยันในการอัปเดตสถานะ" }}
      </h2>
      <p class="text-base font-medium text-[var(--color-primary-600)]">
        {{ questionText }}
      </p>
    </div>

    <!-- การ์ดรายละเอียด -->
    <div class="mb-6 rounded-xl bg-[var(--color-secondary-50)] border border-[var(--border-subtle)] p-4 space-y-3">
      <p class="flex items-start gap-2 text-sm">
        <FileText class="w-4 h-4 mt-0.5 shrink-0"
          :class="isFinalStep ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-error-500)]'" />
        <span>
          <span class="font-medium text-[var(--text-primary)]">หมายเลขงาน:</span>
          <span class="ml-1 text-[var(--text-secondary)]">{{ jobNo }}</span>
        </span>
      </p>

      <p v-if="room" class="flex items-start gap-2 text-sm">
        <DoorOpen class="w-4 h-4 mt-0.5 shrink-0"
          :class="isFinalStep ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-error-500)]'" />
        <span>
          <span class="font-medium text-[var(--text-primary)]">ห้อง:</span>
          <span class="ml-1 text-[var(--text-secondary)]">{{ room }}</span>
        </span>
      </p>

      <p class="flex items-start gap-2 text-sm">
        <CheckCircle2 class="w-4 h-4 mt-0.5 shrink-0 text-[var(--color-primary-500)]" />
        <span>
          <span class="font-medium text-[var(--text-primary)]">สถานะที่จะบันทึก:</span>
          <span class="ml-1 text-[var(--text-secondary)]">{{ statusLabel }}</span>
        </span>
      </p>

      <p v-if="assignee" class="flex items-start gap-2 text-sm">
        <User class="w-4 h-4 mt-0.5 shrink-0"
          :class="isFinalStep ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-error-500)]'" />
        <span>
          <span class="font-medium text-[var(--text-primary)]">ผู้ดำเนินการ:</span>
          <span class="ml-1 text-[var(--text-secondary)]">{{ assignee }}</span>
        </span>
      </p>

      <p v-if="updatedAt" class="flex items-start gap-2 text-sm">
        <Clock3 class="w-4 h-4 mt-0.5 shrink-0"
          :class="isFinalStep ? 'text-[var(--color-primary-600)]' : 'text-[var(--color-error-500)]'" />
        <span>
          <span class="font-medium text-[var(--text-primary)]">เวลาอัปเดต:</span>
          <span class="ml-1 text-[var(--text-secondary)]">{{ updatedAt }}</span>
        </span>
      </p>
    </div>

    <!-- ปุ่มกด -->
    <div class="flex gap-3">
      <button type="button"
        class="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--color-secondary-50)] disabled:cursor-not-allowed disabled:opacity-40 transition"
        @click="onCancel">
        ยกเลิก
      </button>
      <button type="button"
        class="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-[var(--text-inverse)] shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:bg-[var(--color-secondary-300)] flex items-center justify-center gap-2 transition"
        :class="isFinalStep
          ? 'bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)]'
          : 'bg-[var(--color-error-500)] hover:bg-[var(--color-error-600)]'"
        @click="onConfirm">
        <Save class="h-4 w-4" />
        <span>{{ isFinalStep ? "ยืนยันบันทึกสรุปงาน" : "ยืนยันบันทึกสถานะ" }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AlertCircle,
  FileText,
  DoorOpen,
  User,
  Clock3,
  CheckCircle2,
  Save,
} from "lucide-vue-next";

defineProps<{
  jobNo?: string;
  room?: string;
  statusLabel?: string;
  assignee?: string;
  updatedAt?: string;
  questionText?: string;
  isFinalStep?: boolean;
  Loading: boolean;
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

const onCancel = () => {
  emit("cancel");
};

const onConfirm = () => {
  emit("confirm");
};
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
</style>





