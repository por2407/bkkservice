<template>
  <div
    class="relative w-full mx-auto bg-white shadow-xl flex flex-col overflow-hidden"
    :style="{ height: 'var(--app-height)', minHeight: 'var(--app-height)' }"
  >
    <!-- Content -->
    <main
    id="app-scroll"
      class="flex-1 min-h-0 overflow-y-auto px-3 pt-3 pb-3 sm:px-4 sm:pt-4"
      style="padding-bottom: calc(84px + env(safe-area-inset-bottom));"
    >
      <slot />
    </main>

    <!-- Bottom nav (อยู่ในกรอบ ไม่ใช้ fixed) -->
    <nav class="absolute bottom-0 left-0 w-full">
      <div
        class="w-full bg-emerald-500 border-t border-emerald-600/60 shadow-[0_-10px_30px_rgba(6,95,70,0.28)]
               rounded-t-3xl px-3 pt-2 pb-3 text-emerald-50"
        style="padding-bottom: calc(12px + env(safe-area-inset-bottom));"
      >
        <ul class="flex items-stretch justify-between">
          <li v-for="(item, index) in sidebarMenu" :key="item.to" class="flex-1">

            <!-- internal route -->
            <NuxtLink
              v-if="!item.external"
              :to="item.to"
              @click="handleNavClick(index, item)"
              class="relative isolate group flex flex-col items-center justify-center py-3 text-[11px]
                     font-medium gap-1.5 w-full transition-all duration-200 ease-out
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-xl"
            >
              <!-- active pill background -->
              <span
                class="absolute inset-x-1 inset-y-1 rounded-xl transition-all duration-200 z-0 pointer-events-none"
                :class="
                  nav.activeIndex === index
                    ? 'bg-white/22 ring-1 ring-white/70 shadow-[0_8px_20px_rgba(2,44,34,0.35)] translate-y-[-2px]'
                    : 'bg-transparent group-hover:bg-white/10'
                "
              />

              <!-- icon -->
              <div class="relative z-10 inline-flex items-center justify-center">
                <component
                  :is="item.icon"
                  class="w-5 h-5 transition-all duration-200 will-change-transform
                         filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
                  :class="
                    nav.activeIndex === index
                      ? 'text-white scale-110 translate-y-[-1px]'
                      : 'text-white/55 group-hover:text-white/85'
                  "
                />
                <!-- underline indicator -->
                <span
                  class="absolute -bottom-1 h-0.5 w-5 rounded-full transition-all duration-200"
                  :class="
                    nav.activeIndex === index
                      ? 'bg-white/90 opacity-100 scale-100'
                      : 'opacity-0 scale-50'
                  "
                />
                <!-- badge -->
                <span
                  v-if="item.badge"
                  class="absolute -top-2.5 -right-3 min-w-[16px] h-[16px] px-1 rounded-full
                         bg-rose-500 text-[9px] leading-[13px] text-white flex items-center
                         justify-center shadow ring-[1.5px] ring-white/90"
                >
                  {{ item.badge }}
                </span>
              </div>

              <!-- label -->
              <span
                class="relative z-10 mt-0.5 max-w-[80px] text-center leading-snug whitespace-normal
                       break-words transition-colors duration-200 min-h-[28px]"
                :class="
                  nav.activeIndex === index
                    ? 'text-white font-semibold'
                    : 'text-white/70 group-hover:text-white/90'
                "
              >
                {{ item.label }}
              </span>
            </NuxtLink>

            <!-- external -->
            <button
              v-else
              type="button"
              @click="handleNavClick(index, item)"
              class="relative isolate group flex flex-col items-center justify-center py-3 text-[11px]
                     font-medium gap-1.5 transition-all duration-200 ease-out
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-xl w-full"
            >
              <span
                class="absolute inset-x-1 inset-y-1 rounded-xl transition-all duration-200 z-0 pointer-events-none"
                :class="
                  nav.activeIndex === index
                    ? 'bg-white/22 ring-1 ring-white/70 shadow-[0_8px_20px_rgba(2,44,34,0.35)] translate-y-[-2px]'
                    : 'bg-transparent group-hover:bg-white/10'
                "
              />

              <div class="relative z-10 inline-flex items-center justify-center">
                <component
                  :is="item.icon"
                  class="w-5 h-5 transition-all duration-200 will-change-transform
                         filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
                  :class="
                    nav.activeIndex === index
                      ? 'text-white scale-110 translate-y-[-1px]'
                      : 'text-white/55 group-hover:text-white/85'
                  "
                />
                <span
                  class="absolute -bottom-1 h-0.5 w-5 rounded-full transition-all duration-200"
                  :class="
                    nav.activeIndex === index
                      ? 'bg-white/90 opacity-100 scale-100'
                      : 'opacity-0 scale-50'
                  "
                />
                <span
                  v-if="item.badge"
                  class="absolute -top-2.5 -right-3 min-w-[16px] h-[16px] px-1 rounded-full
                         bg-rose-500 text-[9px] leading-[13px] text-white flex items-center
                         justify-center shadow ring-[1.5px] ring-white/90"
                >
                  {{ item.badge }}
                </span>
              </div>

              <span
                class="relative z-10 mt-0.5 max-w-[80px] text-center leading-snug whitespace-normal
                       break-words transition-colors duration-200 min-h-[28px]"
                :class="
                  nav.activeIndex === index
                    ? 'text-white font-semibold'
                    : 'text-white/70 group-hover:text-white/90'
                "
              >
                {{ item.label }}
              </span>
            </button>

          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useSidebarMenu } from "@/composables/sidebar/sidebarItem"
import { useNavStore } from "@/stores/nav.stores"
import type { menu } from "@/types/sidebar"
import { refreshNuxtData } from "#app"

const route = useRoute();
const { sidebarMenu } = useSidebarMenu();
const nav = useNavStore();

// scroll container จริง
const scrollContainer = ref<HTMLElement | null>(null);
const isFirstRoute = ref(true);

onMounted(() => {
  scrollContainer.value = document.getElementById("app-scroll") as HTMLElement | null;
});

// เลื่อนขึ้นบนสุดแบบ smooth
const scrollToTopSmooth = () => {
  if (!scrollContainer.value) {
    scrollContainer.value = document.getElementById("app-scroll") as HTMLElement | null;
  }
  scrollContainer.value?.scrollTo({ top: 0, behavior: "smooth" });
};

const syncActiveWithRoute = () => {
  const i = sidebarMenu.value.findIndex(
    (m) => !m.external && m.to === route.path
  );
  if (i !== -1) nav.setActive(i);
};

const handleNavClick = async (index: number, item: menu) => {
  if (item.external) {
    if (import.meta.client) window.open(item.to, "_self");
    return;
  }

  const isSameRoute =
    nav.activeIndex === index &&
    route.path === item.to;

  if (isSameRoute) {
    // แค่เลื่อนขึ้นบนสุด
    if (import.meta.client) {
      scrollToTopSmooth();
    }

    await refreshNuxtData();

    return;
  }

  nav.setActive(index);
  // *** ไม่เลื่อนตรงนี้แล้ว ปล่อยให้เลื่อนตอน route เปลี่ยนแทน ***
};

// เมื่อ route/path เปลี่ยน → ค่อยเลื่อน container ขึ้นบนสุดแบบ smooth
watch(
  () => route.path,
  async () => {
    syncActiveWithRoute();

    // skip ครั้งแรกตอนเข้าแอป (ไม่ต้องเลื่อนอะไร)
    if (isFirstRoute.value) {
      isFirstRoute.value = false;
      return;
    }

    await nextTick(); // รอให้เนื้อหาใหม่เริ่ม mount ก่อนนิดนึง

    if (import.meta.client) {
      scrollToTopSmooth();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* default ใช้ svh เพื่อไม่หดตาม keyboard */
:global(:root) {
  --app-height: 100svh;
}

/* fallback สำหรับ browser เก่า */
@supports not (height: 100svh) {
  :global(:root) {
    --app-height: 100vh;
  }
}

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
