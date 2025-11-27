<template>
    <section v-if="canRateThisTask" class="px-4 mb-2 mt-1">
      <div class="flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 shadow-sm">
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full"
            :class="hasRatedThisTask ? 'bg-emerald-50' : 'bg-amber-50'"
          >
            <Star
              class="h-4 w-4"
              :class="hasRatedThisTask ? 'text-emerald-500 fill-emerald-500' : 'text-amber-400'"
            />
          </div>
          <div>
            <p class="text-[12px] font-semibold text-slate-900">ความพึงพอใจงานนี้</p>
            <p v-if="hasRatedThisTask && averageRating" class="text-[11px] text-emerald-600">
              {{ averageRating ?? 0 }}/5 · 6 ข้อ
            </p>
            <p v-else class="text-[11px] text-slate-400">ยังไม่มีการให้คะแนน</p>
          </div>
        </div>
        <button
          type="button"
          class="rounded-full px-3 py-1.5 text-[11px] font-medium shadow-sm"
          :class="hasRatedThisTask ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-500 text-white'"
          :disabled="loading"
          @click="$emit('click')"
        >
          {{ hasRatedThisTask ? 'ดูคะแนน' : 'ให้คะแนน' }}
        </button>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import {
  Star,
} from "lucide-vue-next";
  defineProps<{
    canRateThisTask: boolean
    hasRatedThisTask: boolean
    averageRating: string | null
    loading?: boolean
  }>()
  defineEmits<{ (e: 'click'): void }>()
  </script>
  