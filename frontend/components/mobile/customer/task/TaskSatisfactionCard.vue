<template>
  <section class="px-4 mb-2 mt-1">
    <div class="flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 shadow-sm">
      <div class="flex items-center gap-2">
        <div class="flex h-8 w-8 items-center justify-center rounded-full"
          :class="hasRatedThisTask ? 'bg-primary-50' : 'bg-warning-50'">
          <Star v-if="isEmployee" class="h-4 w-4"
            :class="hasRatedThisTask ? 'text-emerald-500 fill-emerald-500' : 'text-amber-400'" />
          <img v-else :src="hasRatedThisTask ? '/images/coin.png' : '/images/lock_coin.png'" alt=""></img>
        </div>
        <div>
          <p class="text-[13px] font-semibold text-secondary-900">{{ isEmployee ? "คะแนนที่ได้จากงานนี้" :
            "ประเมินเพื่อสะสม Coin แลกรางวัล" }}</p>
          <p v-if="hasRatedThisTask && averageRating" class="flex items-center gap-0.5 text-xs text-primary-600">
            <!-- แสดงดาวตามค่า averageRating -->
            <Star v-for="n in 5" :key="n" class="h-3.5 w-3.5" :class="n <= Number(averageRating)
              ? 'text-amber-400 fill-amber-400'
              : 'text-slate-300'
              " />
          </p>
          <p v-else class="text-xs text-secondary-400">ยังไม่มีการให้คะแนน</p>
        </div>
      </div>
      <button v-if="!hasRatedThisTask && !isEmployee" type="button"
        class="rounded-full px-3 py-1.5 text-xs font-medium shadow-sm"
        :class="hasRatedThisTask ? 'bg-primary-50 text-primary-700' : 'bg-warning-500 text-white'" :disabled="loading"
        @click="$emit('click')">
        ให้คะแนน
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Star,
} from "lucide-vue-next";
defineProps<{
  isEmployee: boolean;
  hasRatedThisTask: boolean
  averageRating: string | null
  loading?: boolean
}>()
defineEmits<{ (e: 'click'): void }>()
</script>