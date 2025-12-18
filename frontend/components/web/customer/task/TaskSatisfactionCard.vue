<template>
  <section
    class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-sm mb-6"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full"
          :class="
            isEmployee
              ? hasRatedThisTask
                ? 'bg-[var(--color-primary-50)]'
                : 'bg-[var(--color-warning-50)]'
              : ''
          "
        >
          <Star
            v-if="isEmployee"
            class="h-5 w-5"
            :class="
              hasRatedThisTask
                ? 'text-[var(--color-success-500)] fill-[var(--color-success-500)]'
                : 'text-[var(--color-warning-500)]'
            "
          />
          <img
            v-else
            :src="
              hasRatedThisTask ? '/images/coin.png' : '/images/lock_coin.png'
            "
            alt=""
            :class="isMobile ?'h-5 w-5' : 'h-10 w-10'"
          />
        </div>
        <div>
          <p class="text-sm font-semibold text-[var(--text-primary)]">
            {{
              isEmployee
                ? "คะแนนที่ได้จากงานนี้"
                : "ประเมินเพื่อสะสม Coin แลกรางวัล"
            }}
          </p>
          <p
            v-if="hasRatedThisTask && averageRating"
            class="flex items-center gap-1 text-xs text-[var(--color-primary-600)] mt-1"
          >
            <Star
              v-for="n in 5"
              :key="n"
              class="h-3.5 w-3.5"
              :class="
                n <= Number(averageRating)
                  ? 'text-[var(--color-warning-400)] fill-[var(--color-warning-400)]'
                  : 'text-[var(--color-secondary-300)]'
              "
            />
          </p>
          <p v-else class="text-xs text-[var(--text-secondary)] mt-1">
            ยังไม่มีการให้คะแนน
          </p>
        </div>
      </div>
      <button
        v-if="!hasRatedThisTask && !isEmployee && isMine"
        type="button"
        class="rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow-md"
        :class="
          hasRatedThisTask
            ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
            : 'bg-[var(--color-warning-500)] text-[var(--text-inverse)] hover:bg-[var(--color-warning-600)]'
        "
        :disabled="loading"
        @click="$emit('click')"
      >
        ให้คะแนน
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Star } from "lucide-vue-next";

defineProps<{
  isEmployee: boolean;
  isMine: boolean;
  hasRatedThisTask: boolean;
  averageRating: string | null;
  loading?: boolean;
  isMobile?: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>
