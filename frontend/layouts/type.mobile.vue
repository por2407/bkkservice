<template>
  <div
    class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 flex justify-center"
  >
    <!-- layout หลัก -->
    <div
      class="w-full max-w-md flex flex-col min-h-screen bg-white/90 backdrop-blur border-x border-slate-200/60"
    >
      <!-- Content -->
      <main
        class="flex-1 min-h-0 overflow-y-auto px-3 pt-3 pb-3 sm:px-4 sm:pt-4"
      >
        <Transition name="page" mode="out-in">
          <NuxtPage />
        </Transition>
      </main>

      <!-- Bottom nav -->
      <nav class="mt-auto w-full">
        <div
          class="mx-auto max-w-md bg-emerald-500 border-t border-emerald-600/60 shadow-[0_-10px_30px_rgba(6,95,70,0.28)] rounded-t-3xl px-3 pt-2 pb-3 text-emerald-50"
        >
          <ul class="flex items-stretch justify-between">
            <li v-for="item in navItems" :key="item.to" class="flex-1">
              <NuxtLink
                :to="item.to"
                v-bind="isActive(item.to) ? { 'aria-current': 'page' } : {}"
                class="relative group flex flex-col items-center justify-center py-3 text-[11px] font-medium gap-1.5 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-xl"
              >
                <!-- active pill background -->
                <span
                  class="absolute inset-x-1 inset-y-1 rounded-xl transition-all duration-200 -z-10"
                  :class="
                    isActive(item.to)
                      ? 'bg-white/22 ring-1 ring-white/70 shadow-[0_8px_20px_rgba(2,44,34,0.35)] translate-y-[-2px]'
                      : 'bg-transparent group-hover:bg-white/10'
                  "
                />

                <!-- icon -->
                <div class="relative inline-flex items-center justify-center">
                  <component
                    :is="item.icon"
                    class="w-5 h-5 transition-all duration-200 will-change-transform filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
                    :class="
                      isActive(item.to)
                        ? 'text-white scale-110 translate-y-[-1px]'
                        : 'text-white/55 group-hover:text-white/85'
                    "
                  />
                  <!-- underline indicator -->
                  <span
                    class="absolute -bottom-1 h-0.5 w-5 rounded-full transition-all duration-200"
                    :class="
                      isActive(item.to)
                        ? 'bg-white/90 opacity-100 scale-100'
                        : 'opacity-0 scale-50'
                    "
                  />
                  <!-- badge -->
                  <span
                    v-if="item.badge"
                    class="absolute -top-2.5 -right-3 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-[9px] leading-[13px] text-white flex items-center justify-center shadow ring-[1.5px] ring-white/90"
                  >
                    {{ item.badge }}
                  </span>
                </div>

                <!-- label -->
                <span
                  class="mt-0.5 truncate max-w-[72px] tracking-[0.02em] transition-colors duration-200"
                  :class="
                    isActive(item.to)
                      ? 'text-white font-semibold'
                      : 'text-white/70 group-hover:text-white/90'
                  "
                >
                  {{ item.label }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "#imports";
import {
  HomeIcon,
  FilePlus2,
  History,
  Gift,
  GraduationCap,
} from "lucide-vue-next";

const route = useRoute();

const navItems = [
  {
    label: "หน้าแรก",
    to: "/employee",
    icon: HomeIcon,
  },
  {
    label: "แจ้งงานใหม่",
    to: "/employee/jobs",
    icon: FilePlus2,
    badge: "3",
  },
  {
    label: "สอบถามประวัติ",
    to: "/employee/tracking",
    icon: History,
  },
  {
    label: "แลกรางวัล",
    to: "/employee/rewards",
    icon: Gift,
  },
  {
    label: "168 Training",
    to: "/employee/training",
    icon: GraduationCap,
  },
];

const isActive = (path: string) =>
  route.path === path || route.path.startsWith(path + "/");
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none !important;
  }
}
</style>
