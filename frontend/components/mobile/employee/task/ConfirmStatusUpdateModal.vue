<template>
  <div class="relative w-full rounded-t-3xl bg-white px-5 pt-4 pb-5 shadow-lg">
    <!-- หัวข้อ + ไอคอนแจ้งเตือน -->

    <div v-if="Loading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-t-3xl bg-white/80 sm:rounded-2xl">
      <span class="loader"></span>
      <p class="mt-2 text-xs text-secondary-600">กำลังอัปเดตการทำงาน...</p>
    </div>

    <div class="px-6 pb-4 text-center">
      <div class="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full"
        :class="isFinalStep ? 'text-info-700' : 'text-error-600'">
        <AlertCircle class="w-6 h-6" />
      </div>
      <h2 class="text-lg font-semibold" :class="isFinalStep ? 'text-info-800' : 'text-error-700'">
        {{
          isFinalStep ? "ยืนยันในการบันทึกสรุปงาน" : "ยืนยันในการอัปเดตสถานะ"
        }}
      </h2>
      <p class="mt-2 text-base font-semibold text-primary-600">
        {{ questionText }}
      </p>
    </div>

    <!-- การ์ดรายละเอียด -->
    <div class="px-1 py-4">
      <div class="rounded-xl bg-secondary-50 border border-secondary-200 p-4 text-sm text-secondary-700 space-y-2">
        <p class="flex items-start gap-2">
          <FileText class="w-4 h-4 mt-0.5" :class="isFinalStep ? 'text-info-600' : 'text-error-500'" />
          <span>
            <span class="font-medium text-secondary-900">หมายเลขงาน:</span>
            {{ jobNo }}
          </span>
        </p>

        <p v-if="room" class="flex items-start gap-2">
          <DoorOpen class="w-4 h-4 mt-0.5" :class="isFinalStep ? 'text-info-600' : 'text-error-500'" />
          <span>
            <span class="font-medium text-secondary-900">ห้อง:</span>
            {{ room }}
          </span>
        </p>

        <p class="flex items-start gap-2">
          <CheckCircle2 class="w-4 h-4 mt-0.5 text-primary-500" />
          <span>
            <span class="font-medium text-secondary-900"> สถานะที่จะบันทึก: </span>
            {{ statusLabel }}
          </span>
        </p>

        <p v-if="assignee" class="flex items-start gap-2">
          <User class="w-4 h-4 mt-0.5" :class="isFinalStep ? 'text-info-600' : 'text-error-500'" />
          <span>
            <span class="font-medium text-secondary-900">ผู้ดำเนินการ:</span>
            {{ assignee }}
          </span>
        </p>

        <p v-if="updatedAt" class="flex items-start gap-2">
          <Clock3 class="w-4 h-4 mt-0.5" :class="isFinalStep ? 'text-info-600' : 'text-error-500'" />
          <span>
            <span class="font-medium text-secondary-900">เวลาอัปเดต:</span>
            {{ updatedAt }}
          </span>
        </p>
      </div>
    </div>

    <!-- ปุ่มกด -->

    <div class="flex gap-2">
      <button type="button"
        class="min-h-[44px] flex-1 rounded-full border border-secondary-300 bg-white px-3 py-2 text-sm font-semibold text-secondary-700 hover:bg-secondary-50 disabled:cursor-not-allowed disabled:opacity-40"
        @click="onCancel">
        ยกเลิก
      </button>
      <button type="button"
        class="min-h-[44px] flex-1 rounded-full px-3 py-2 text-sm font-semibold text-white shadow-sm active:scale-95 disabled:cursor-not-allowed disabled:bg-secondary-300 flex items-center justify-center gap-1.5"
        :class="isFinalStep
            ? 'bg-info-600 hover:bg-info-700'
            : 'bg-error-500 hover:bg-error-600'
          " @click="onConfirm">
        <Save class="h-4 w-4" />
        <span>
          {{ isFinalStep ? "ยืนยันบันทึกสรุปงาน" : "ยืนยันบันทึกสถานะ" }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AlertCircle,
  FileText,
  MapPin,
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid;
  border-color: #ff3d00 transparent;
  /* ส้ม + โปร่งใส */
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
