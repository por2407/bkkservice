<template>
  <Transition name="fade-slide">
    <div
      v-show="show"
      class="fixed inset-x-0 top-0 z-40 max-w-[430px] mx-auto pointer-events-none"
      aria-hidden="false"
    >
      <div
        class="pointer-events-auto mx-auto px-4 pt-2.5 pb-2 bg-slate-50/90 backdrop-blur supports-[backdrop-filter]:bg-slate-50/70 border-b border-slate-200/70 shadow-sm rounded-b-2xl"
      >
        <div class="flex items-center justify-between gap-3">
          <!-- left: back + title -->
          <div class="flex items-center gap-3 min-w-0">
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95 touch-manipulation"
              @click="$emit('back')"
            >
              <ArrowLeft class="h-4 w-4 text-slate-700" />
            </button>

            <span class="text-[15px] font-semibold text-slate-900 truncate">
              รายละเอียดงาน
            </span>
          </div>

          <!-- right: task id chip -->
          <span class="px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
            {{ taskId }}
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";

defineProps<{
  show: boolean;
  taskId: string;
}>();

defineEmits<{
  (e: "back"): void;
}>();
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
