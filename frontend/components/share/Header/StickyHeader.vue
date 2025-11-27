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
          <slot/>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">  
  defineProps<{
    show: boolean;
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
  