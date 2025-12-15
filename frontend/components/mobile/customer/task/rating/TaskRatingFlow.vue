<template>
  <!-- Modal ให้คะแนน -->
  <ResponsiveModal :model-value="open" @update:model-value="closeRatingModal">
    <TaskRatingDialog :ratingLoading="ratingLoading" :hasRatedThisTask="hasRatedThisTask"
      :canSubmitRating="canSubmitRating" :ratingItems="ratingItems" :tempRatingScores="tempRatingScores"
      :setTempScore="setTempScore" :submitRating="submitRating" :closeRatingModal="closeRatingModal" />
  </ResponsiveModal>

  <!-- Modal success -->
  <ResponsiveModal :model-value="successOpen" @update:model-value="emit('update:successOpen', $event)">
    <div class="w-full rounded-3xl bg-white p-6 pb-5 text-center shadow-lg">
      <!-- หัวข้อ -->
      <h4 class="mb-3 text-base font-bold text-primary">
        ขอบคุณสำหรับการให้คะแนนการบริการ
      </h4>

      <!-- ⭐ สรุปดาว -->
      <div class="mb-4 flex justify-center gap-1">
        <Star v-for="n in 5" :key="n" class="h-6 w-6" :class="(successSummary?.star ?? 0) >= n
          ? 'text-amber-400 fill-amber-400'
          : 'text-slate-300'
          " />
      </div>

      <!-- วันที่แจ้ง / วันที่ดำเนินการ -->
      <div class="mb-4 text-sm font-semibold text-primary">
        <p class="text-emerald-600">
          วันที่แจ้งเรื่อง : {{ successSummary?.datest ?? '-' }}
        </p>
        <p class="text-emerald-600">
          วันที่ดำเนินการเรียบร้อย : {{ successSummary?.dateed ?? '-' }}
        </p>
      </div>

      <!-- แต้มที่ได้รับ -->
      <div class="mb-5 inline-block rounded-md border border-red-500 bg-red-500 px-4 py-3 text-sm font-bold text-white">
        BKK BitCoin ที่อาจารย์ได้รับครั้งนี้
        <span class="px-1 text-2xl text-yellow-300">
          {{ successSummary?.vpoint ?? '-' }}
        </span>
        coin
      </div>

      <!-- เกณฑ์การให้แต้ม -->
      <div class="mb-4 text-[13px] leading-relaxed text-slate-700">
        <h4 class="mb-1 font-semibold text-sky-600">เกณฑ์การให้ BKK BitCoin</h4>
        <p>6 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินไม่เกิน 7 วัน</p>
        <p>5 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินไม่เกิน 8 วัน</p>
        <p>4 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินไม่เกิน 9 วัน</p>
        <p>3 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินไม่เกิน 10 วัน</p>
        <p>2 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินไม่เกิน 11 วัน</p>
        <p>1 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินเกิน 12 วัน</p>
      </div>

      <!-- รูปภาพ -->
      <div class="mb-4 flex justify-center">
        <!-- แก้ path รูปตามโปรเจ็กต์จริง -->
        <img src="/images/hands.png" alt="ขอบคุณ" class="h-20 w-20" />
      </div>

      <!-- ปุ่มปิด -->
      <button type="button"
        class="mt-2 w-full rounded-full bg-primary px-3 py-2 text-[13px] font-medium text-white shadow-sm"
        @click="emit('update:successOpen', false)">
        ปิด
      </button>
    </div>
  </ResponsiveModal>

</template>

<script setup lang="ts">
import { Star } from "lucide-vue-next";
import TaskRatingDialog from "./TaskRatingDialog.vue";
import ResponsiveModal from "@/components/share/ResponsiveModal.vue";

interface RatingItem {
  id: string;
  label: string;
}

interface RatingSuccessSummary {
  star: number;        // คะแนนดาว 1–5
  datest: string;      // วันที่แจ้งเรื่อง (string ที่ format มาแล้ว)
  dateed: string;      // วันที่ดำเนินการเรียบร้อย
  vpoint: number;      // แต้มที่อาจารย์ได้รับ
}

const props = defineProps<{
  open: boolean;
  successOpen: boolean;

  ratingLoading: boolean;
  hasRatedThisTask: boolean;
  canSubmitRating: boolean;
  ratingItems: RatingItem[];
  tempRatingScores: Record<string, number>;
  setTempScore: (id: string, score: number) => void;
  submitRating: () => Promise<void>;
  closeRatingModal: () => void;

  successSummary: RatingSuccessSummary | null;
}>();

const emit = defineEmits<{
  (e: "update:open", v: boolean): void;
  (e: "update:successOpen", v: boolean): void;
}>();
</script>