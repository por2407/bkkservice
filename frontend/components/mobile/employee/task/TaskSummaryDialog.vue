<template>
  <div class="relative w-full rounded-t-3xl bg-white p-4 pb-5 shadow-lg">
    <!-- 🌀 LOADING OVERLAY ตอนบันทึก -->
    <div v-if="summaryLoading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-t-3xl bg-white/80 sm:rounded-2xl">
      <span class="loader"></span>
      <p class="mt-2 text-[11px] text-secondary-600">กำลังบันทึกสรุปงาน...</p>
    </div>
    <!-- 🔚 END LOADING OVERLAY -->
    <!-- header modal -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-info-50">
          <ClipboardList class="h-4 w-4 text-info-600" />
        </div>
        <div>
          <p class="text-[13px] font-semibold text-secondary-900">
            บันทึกสรุปงาน
          </p>
          <p class="text-[10px] text-secondary-500">
            กรอกข้อมูลการปฏิบัติงานหน้างาน
          </p>
        </div>
      </div>

      <button type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 text-secondary-500"
        :disabled="summaryLoading" @click="$emit('close')">
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- ฟอร์ม / แสดงผล -->
    <!-- ยังไม่บันทึก = แสดง input -->
    <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
      <!-- วันเวลาเริ่ม -->
      <div>
        <p class="text-[12px] font-semibold text-secondary-800">
          วันเวลาเริ่มปฏิบัติงาน
        </p>
        <ThaiDateTimePicker v-model="scheduleStart" variant="popover" size="sm" :minute-step="5"
          time-zone="Asia/Bangkok" accent-class="text-warning-600" :disabled="false" />
      </div>

      <!-- วันเวลาสิ้นสุด -->
      <div>
        <p class="text-[12px] font-semibold text-secondary-800">
          วันเวลาสิ้นสุดปฏิบัติงาน
        </p>
        <ThaiDateTimePicker v-model="scheduleEnd" variant="popover" size="sm" :minute-step="5" time-zone="Asia/Bangkok"
          accent-class="text-warning-600" :disabled="false" />
      </div>

      <!-- วิธีการดำเนินงาน -->
      <div>
        <p class="text-[12px] font-semibold text-secondary-800">
          วิธีการดำเนินงาน / วิธีแก้ไข
        </p>
        <textarea rows="3" v-model="workSummary.process"
          class="mt-1 w-full rounded-xl border border-secondary-200 bg-secondary-50 px-3 py-2 text-[12px] text-secondary-900 placeholder:text-secondary-400 focus:border-info-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-info-100"
          placeholder="อธิบายขั้นตอนการแก้ไขโดยย่อ..."></textarea>
      </div>

      <!-- งานค้าง / ต้องติดตาม -->
      <div>
        <p class="text-[12px] font-semibold text-secondary-800">
          งานที่ยังไม่เสร็จ / สิ่งที่ต้องติดตามต่อ
        </p>
        <textarea rows="2" v-model="workSummary.pending"
          class="mt-1 w-full rounded-xl border border-secondary-200 bg-secondary-50 px-3 py-2 text-[12px] text-secondary-900 placeholder:text-secondary-400 focus:border-info-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-info-100"
          placeholder="ระบุถ้ามีงานค้าง หรือสิ่งที่ต้องตามต่อ..."></textarea>
      </div>
    </div>

    <!-- footer buttons -->
    <div class="mt-4 flex gap-2">
      <!-- ยังไม่บันทึก = มี ยกเลิก + Confirm -->

      <button type="button"
        class="flex-1 rounded-full border border-secondary-200 bg-white px-3 py-2 text-[12px] font-medium text-secondary-600 disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="summaryLoading" @click="$emit('close')">
        ยกเลิก
      </button>
      <button type="button"
        class="flex-1 rounded-full bg-info-600 px-3 py-2 text-[12px] font-medium text-white shadow-sm disabled:bg-secondary-300 disabled:cursor-not-allowed"
        :disabled="!canSubmitSummary || summaryLoading" @click="confirmWorkSummaryOpen">
        {{ summaryLoading ? "กำลังบันทึก..." : "บันทึกสรุปงาน" }}
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { X, ClipboardList } from "lucide-vue-next";
import ThaiDateTimePicker from "../../../share/ThaiDateTimePicker.vue";
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
})


</script>

<style scoped>
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
