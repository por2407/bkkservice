<template>
  <div class="relative w-full rounded-t-3xl bg-white p-5 pb-5 shadow-lg">
    <!-- 🌀 LOADING OVERLAY ตอนบันทึกคะแนน -->
    <div
      v-if="ratingLoading"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-t-3xl bg-white/80 sm:rounded-2xl"
    >
      <span class="loader"></span>
      <p class="mt-2 text-[11px] text-slate-600">กำลังบันทึกคะแนน...</p>
    </div>
    <!-- header modal -->
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50"
        >
          <Star class="h-4 w-4 text-amber-500 fill-amber-500" />
        </div>
        <div>
          <p class="text-[13px] font-semibold text-slate-900">
            {{
              hasRatedThisTask ? "คะแนนที่คุณให้กับงานนี้" : "ให้คะแนนงานนี้"
            }}
          </p>
          <p class="text-[10px] text-slate-500">
            {{
              hasRatedThisTask
                ? "ดูรายละเอียดคะแนนที่เคยให้ไปแล้ว"
                : "เลือกดาว 1–5 ต่อข้อ"
            }}
          </p>
        </div>
      </div>
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
        @click="closeRatingModal"
      >
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- legend 5–1 -->
    <div class="mb-3 rounded-2xl bg-slate-50 px-3 py-2">
      <div
        class="flex flex-wrap justify-between gap-y-1 text-[9px] font-medium"
      >
        <span class="text-emerald-600">5 พึงพอใจมากที่สุด</span>
        <span class="text-emerald-500">4 พึงพอใจมาก</span>
        <span class="text-slate-600">3 ปานกลาง</span>
        <span class="text-amber-500">2 พึงพอใจน้อย</span>
        <span class="text-red-500">1 น้อยที่สุด</span>
      </div>
    </div>

    <!-- 6 ข้อ -->
    <div class="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
      <div
        v-for="(item, index) in ratingItems"
        :key="item.id"
        class="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2"
      >
        <div class="mb-1 flex items-center justify-between">
          <span class="text-[12px] font-medium text-slate-900">
            {{ index + 1 }}. {{ item.label }}
          </span>
          <span
            v-if="tempRatingScores[index]"
            class="text-[10px] font-medium text-amber-600"
          >
            {{ tempRatingScores[index] }}/5
          </span>
        </div>

        <div class="flex gap-1.5">
          <button
            v-for="n in 5"
            :key="n"
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-full bg-white active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="hasRatedThisTask || ratingLoading"
            @click="!hasRatedThisTask && setTempScore(index, n)"
          >
            <Star
              class="h-4 w-4"
              :class="
                tempRatingScores[index] >= n
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300'
              "
            />
          </button>
        </div>
      </div>
    </div>

    <!-- footer buttons -->
    <div class="mt-4 flex gap-2">
      <!-- ยังไม่เคยให้คะแนน = ยกเลิก + บันทึก -->
      <template v-if="!hasRatedThisTask">
        <button
          type="button"
          class="flex-1 rounded-full border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="ratingLoading"
          @click=""
        >
          ยกเลิก
        </button>
        <button
          type="button"
          class="flex-1 rounded-full bg-amber-500 px-3 py-2 text-[12px] font-medium text-white shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
          :disabled="!canSubmitRating || ratingLoading"
          @click="submitRating"
        >
          {{ ratingLoading ? "กำลังบันทึก..." : "บันทึกคะแนน" }}
        </button>
      </template>

      <!-- เคยให้คะแนนแล้ว = ปุ่มปิดอย่างเดียว -->
      <template v-else>
        <button
          type="button"
          class="w-full rounded-full bg-emerald-500 px-3 py-2 text-[12px] font-medium text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="ratingLoading"
          @click="closeRatingModal"
        >
          ปิด
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, Star } from "lucide-vue-next";
import type { RatingItem } from "@/types/task";
defineProps<{
  ratingLoading: boolean;
  hasRatedThisTask: boolean;
  canSubmitRating: boolean;
  ratingItems: RatingItem[];
  tempRatingScores: number[];
  setTempScore: (index: number, score: number) => void;
  submitRating: () => void;
  closeRatingModal: () => void;
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
