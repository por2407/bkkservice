<template>
    <div class="relative w-full bg-[var(--bg-surface)] p-6">
        <!-- 🌀 LOADING OVERLAY ตอนบันทึกคะแนน -->
        <div v-if="ratingLoading"
            class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-t-3xl bg-white/80 sm:rounded-2xl">
            <span class="loader"></span>
            <p class="mt-2 text-xs text-[var(--text-secondary)]">กำลังบันทึกคะแนน...</p>
        </div>
        <!-- header modal -->
        <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-warning-50)]">
                    <Star class="h-5 w-5 text-[var(--color-warning-500)] fill-[var(--color-warning-500)]" />
                </div>
                <div>
                    <p class="text-base font-bold text-[var(--text-primary)]">
                        ให้คะแนนงานนี้
                    </p>
                    <p class="text-xs text-[var(--text-secondary)]">
                        เลือกดาว 1–5 ต่อข้อ
                    </p>
                </div>
            </div>
            <button type="button"
                class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-secondary-100)] text-[var(--text-secondary)] hover:bg-[var(--color-secondary-200)] transition"
                @click="closeRatingModal">
                <X class="h-4 w-4" />
            </button>
        </div>

        <!-- legend 5–1 -->
        <div class="mb-4 rounded-xl bg-[var(--color-secondary-50)] px-4 py-3 border border-[var(--border-subtle)]">
            <div class="flex flex-wrap justify-between gap-y-2 text-xs font-medium">
                <span class="text-[var(--color-success-600)]">5 พึงพอใจมากที่สุด</span>
                <span class="text-[var(--color-success-500)]">4 พึงพอใจมาก</span>
                <span class="text-[var(--text-secondary)]">3 ปานกลาง</span>
                <span class="text-[var(--color-warning-500)]">2 พึงพอใจน้อย</span>
                <span class="text-[var(--color-error-500)]">1 น้อยที่สุด</span>
            </div>
        </div>

        <!-- 6 ข้อ -->
        <div class="max-h-[60vh] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="(item, index) in ratingItems" :key="item.id"
                class="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 hover:border-[var(--color-primary-200)] transition">
                <div class="mb-2 flex items-center justify-between">
                    <span class="text-sm font-medium text-[var(--text-primary)]">
                        {{ index + 1 }}. {{ item.label }}
                    </span>
                    <span v-if="tempRatingScores[item.id]" class="text-xs font-bold text-[var(--color-warning-600)]">
                        {{ tempRatingScores[item.id] }}/5
                    </span>
                </div>

                <div class="flex gap-2">
                    <button v-for="n in 5" :key="n" type="button"
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--color-warning-300)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition"
                        :disabled="hasRatedThisTask || ratingLoading"
                        @click="!hasRatedThisTask && setTempScore(item.id, n)">
                        <Star class="h-4 w-4" :class="tempRatingScores[item.id] >= n
                            ? 'text-[var(--color-warning-400)] fill-[var(--color-warning-400)]'
                            : 'text-[var(--color-secondary-300)]'
                            " />
                    </button>
                </div>
            </div>
        </div>

        <!-- footer buttons -->
        <div class="mt-6 flex gap-3">
            <!-- ยังไม่เคยให้คะแนน = ยกเลิก + บันทึก -->
            <template v-if="!hasRatedThisTask">
                <button type="button"
                    class="flex-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--color-secondary-50)] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    :disabled="ratingLoading" @click="closeRatingModal">
                    ยกเลิก
                </button>
                <button type="button"
                    class="flex-1 rounded-xl bg-[var(--color-warning-500)] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[var(--color-warning-600)] disabled:bg-[var(--color-secondary-300)] disabled:cursor-not-allowed transition"
                    :disabled="!canSubmitRating || ratingLoading" @click="submitRating">
                    {{ ratingLoading ? "กำลังบันทึก..." : "บันทึกคะแนน" }}
                </button>
            </template>

            <!-- เคยให้คะแนนแล้ว = ปุ่มปิดอย่างเดียว -->
            <template v-else>
                <button type="button"
                    class="w-full rounded-xl bg-[var(--color-success-500)] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[var(--color-success-600)] disabled:opacity-40 disabled:cursor-not-allowed transition"
                    :disabled="ratingLoading" @click="closeRatingModal">
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
    tempRatingScores: Record<string, number>;
    setTempScore: (id: string, score: number) => void;
    submitRating: () => void;
    closeRatingModal: () => void;
}>();
</script>

<style scoped>
.loader {
    width: 48px;
    height: 48px;
    border: 5px solid;
    border-color: #ff3d00 transparent;
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

/* Custom Scrollbar for Web */
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
