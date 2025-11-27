<template>
  <div
    class="relative w-full rounded-t-3xl bg-white p-4 pb-5 shadow-lg"
  >
    <!-- 🌀 LOADING OVERLAY ตอนบันทึก -->
    <div
      v-if="summaryLoading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-t-3xl bg-white/80 sm:rounded-2xl"
    >
      <span class="loader"></span>
      <p class="mt-2 text-[11px] text-slate-600">กำลังบันทึกสรุปงาน...</p>
    </div>
    <!-- 🔚 END LOADING OVERLAY -->
    <!-- header modal -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50"
        >
          <ClipboardList class="h-4 w-4 text-indigo-600" />
        </div>
        <div>
          <p class="text-[13px] font-semibold text-slate-900">
            {{ summarySaved ? "สรุปงานที่บันทึกไว้" : "บันทึกสรุปงาน" }}
          </p>
          <p class="text-[10px] text-slate-500">
            {{
              summarySaved
                ? "ดูรายละเอียดการปฏิบัติงานที่บันทึกแล้ว"
                : "กรอกข้อมูลการปฏิบัติงานหน้างาน"
            }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
        :disabled="summaryLoading"
        @click="closeSummaryModal"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- ฟอร์ม / แสดงผล -->
    <!-- ยังไม่บันทึก = แสดง input -->
    <div
      v-if="!summarySaved"
      class="space-y-3 max-h-[60vh] overflow-y-auto pr-1"
    >
      <!-- วันเวลาเริ่ม -->
      <div>
        <p class="text-[12px] font-semibold text-slate-800">
          วันเวลาเริ่มปฏิบัติงาน
        </p>
        <input
          type="datetime-local"
          v-model="workSummary.startTime"
          class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <!-- วันเวลาสิ้นสุด -->
      <div>
        <p class="text-[12px] font-semibold text-slate-800">
          วันเวลาสิ้นสุดปฏิบัติงาน
        </p>
        <input
          type="datetime-local"
          v-model="workSummary.endTime"
          class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <!-- วิธีการดำเนินงาน -->
      <div>
        <p class="text-[12px] font-semibold text-slate-800">
          วิธีการดำเนินงาน / วิธีแก้ไข
        </p>
        <textarea
          rows="3"
          v-model="workSummary.process"
          class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          placeholder="อธิบายขั้นตอนการแก้ไขโดยย่อ..."
        ></textarea>
      </div>

      <!-- งานค้าง / ต้องติดตาม -->
      <div>
        <p class="text-[12px] font-semibold text-slate-800">
          งานที่ยังไม่เสร็จ / สิ่งที่ต้องติดตามต่อ
        </p>
        <textarea
          rows="2"
          v-model="workSummary.pending"
          class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          placeholder="ระบุถ้ามีงานค้าง หรือสิ่งที่ต้องตามต่อ..."
        ></textarea>
      </div>
    </div>

    <!-- บันทึกแล้ว = แสดงเป็น text read-only -->
    <div v-else class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
      <div>
        <p class="text-[12px] font-semibold text-slate-800">
          วันเวลาเริ่มปฏิบัติงาน
        </p>
        <p
          class="mt-1 rounded-xl bg-slate-50 px-3 py-2 text-[12px] text-slate-800"
        >
          {{ formatSummaryDateTime(workSummary.startTime) || "-" }}
        </p>
      </div>

      <div>
        <p class="text-[12px] font-semibold text-slate-800">
          วันเวลาสิ้นสุดปฏิบัติงาน
        </p>
        <p
          class="mt-1 rounded-xl bg-slate-50 px-3 py-2 text-[12px] text-slate-800"
        >
          {{ formatSummaryDateTime(workSummary.endTime) || "-" }}
        </p>
      </div>

      <div>
        <p class="text-[12px] font-semibold text-slate-800">
          วิธีการดำเนินงาน / วิธีแก้ไข
        </p>
        <p
          class="mt-1 rounded-xl bg-slate-50 px-3 py-2 text-[12px] text-slate-800 whitespace-pre-line"
        >
          {{ workSummary.process || "-" }}
        </p>
      </div>

      <div>
        <p class="text-[12px] font-semibold text-slate-800">
          งานที่ยังไม่เสร็จ / สิ่งที่ต้องติดตามต่อ
        </p>
        <p
          class="mt-1 rounded-xl bg-slate-50 px-3 py-2 text-[12px] text-slate-800 whitespace-pre-line"
        >
          {{ workSummary.pending || "-" }}
        </p>
      </div>
    </div>

    <!-- footer buttons -->
    <div class="mt-4 flex gap-2">
      <!-- ยังไม่บันทึก = มี ยกเลิก + Confirm -->
      <template v-if="!summarySaved">
        <button
          type="button"
          class="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="summaryLoading"
          @click="closeSummaryModal"
        >
          ยกเลิก
        </button>
        <button
          type="button"
          class="flex-1 rounded-full bg-indigo-600 px-3 py-2 text-[12px] font-medium text-white shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
          :disabled="!canSubmitSummary || summaryLoading"
          @click="saveWorkSummary"
        >
          {{ summaryLoading ? "กำลังบันทึก..." : "บันทึกสรุปงาน" }}
        </button>
      </template>

      <!-- บันทึกแล้ว = ปุ่ม ปิด อย่างเดียว -->
      <template v-else>
        <button
          type="button"
          class="w-full rounded-full bg-emerald-500 px-3 py-2 text-[12px] font-medium text-white shadow-sm active:scale-95"
          @click="closeSummaryModal"
        >
          ปิด
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  X,
  ClipboardList,
} from "lucide-vue-next";

type WorkSummary = {
  startTime: string;
  endTime: string;
  process: string;
  pending: string;
};
defineProps<{
  summaryLoading: boolean;
  summarySaved: boolean;
  canSubmitSummary: boolean;
  workSummary: WorkSummary;
  saveWorkSummary: () => void;
  closeSummaryModal: () => void;
  formatSummaryDateTime: (val: string) => string;
}>();
</script>

<style scoped>
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid;
  border-color: #ff3d00 transparent; /* ส้ม + โปร่งใส */
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
