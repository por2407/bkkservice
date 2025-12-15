<template>
    <!-- Modal ให้คะแนน -->
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-[var(--bg-surface)] rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <TaskRatingDialog :ratingLoading="ratingLoading" :hasRatedThisTask="hasRatedThisTask"
                :canSubmitRating="canSubmitRating" :ratingItems="ratingItems" :tempRatingScores="tempRatingScores"
                :setTempScore="setTempScore" :submitRating="submitRating" :closeRatingModal="closeRatingModal" />
        </div>
    </div>

    <!-- Modal success -->
    <div v-if="successOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-[var(--bg-surface)] rounded-2xl shadow-xl w-full max-w-md p-6 text-center relative">
            <!-- หัวข้อ -->
            <h4 class="mb-3 text-lg font-bold text-[var(--color-primary-600)]">
                ขอบคุณสำหรับการให้คะแนนการบริการ
            </h4>

            <!-- ⭐ สรุปดาว -->
            <div class="mb-6 flex justify-center gap-1">
                <Star v-for="n in 5" :key="n" class="h-8 w-8" :class="(successSummary?.star ?? 0) >= n
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-[var(--color-secondary-300)]'
                    " />
            </div>

            <!-- วันที่แจ้ง / วันที่ดำเนินการ -->
            <div class="mb-6 text-sm font-medium text-[var(--text-secondary)] space-y-1">
                <p class="flex justify-between px-8">
                    <span>วันที่แจ้งเรื่อง :</span>
                    <span class="text-[var(--text-primary)]">{{ successSummary?.datest ?? '-' }}</span>
                </p>
                <p class="flex justify-between px-8">
                    <span>วันที่ดำเนินการเรียบร้อย :</span>
                    <span class="text-[var(--text-primary)]">{{ successSummary?.dateed ?? '-' }}</span>
                </p>
            </div>

            <!-- แต้มที่ได้รับ -->
            <div
                class="mb-6 inline-block rounded-xl border border-red-500 bg-red-500 px-6 py-4 text-base font-bold text-white shadow-md">
                BKK BitCoin ที่อาจารย์ได้รับครั้งนี้
                <div class="mt-1 flex items-center justify-center gap-2">
                    <span class="text-3xl text-yellow-300 font-extrabold">
                        {{ successSummary?.vpoint ?? '-' }}
                    </span>
                    <span class="text-lg">coin</span>
                </div>
            </div>

            <!-- เกณฑ์การให้แต้ม -->
            <div
                class="mb-6 text-sm leading-relaxed text-[var(--text-secondary)] bg-[var(--color-secondary-50)] p-4 rounded-xl text-left">
                <h4 class="mb-2 font-semibold text-[var(--color-primary-600)]">เกณฑ์การให้ BKK BitCoin</h4>
                <ul class="space-y-1 list-disc list-inside">
                    <li>6 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินไม่เกิน 7 วัน</li>
                    <li>5 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินไม่เกิน 8 วัน</li>
                    <li>4 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินไม่เกิน 9 วัน</li>
                    <li>3 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินไม่เกิน 10 วัน</li>
                    <li>2 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินไม่เกิน 11 วัน</li>
                    <li>1 coin เมื่อช่างดำเนินการเสร็จและอาจารย์ประเมินเกิน 12 วัน</li>
                </ul>
            </div>

            <!-- รูปภาพ -->
            <div class="mb-6 flex justify-center">
                <img src="/images/hands.png" alt="ขอบคุณ" class="h-24 w-24 object-contain" />
            </div>

            <!-- ปุ่มปิด -->
            <button type="button"
                class="w-full rounded-xl bg-[var(--color-primary-500)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-600)] transition"
                @click="emit('update:successOpen', false)">
                ปิด
            </button>
        </div>
    </div>

</template>

<script setup lang="ts">
import { Star } from "lucide-vue-next";
import TaskRatingDialog from "@/components/web/customer/task/rating/TaskRatingDialog.vue";

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
