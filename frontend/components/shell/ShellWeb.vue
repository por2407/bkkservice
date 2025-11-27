<template>
  <div
    class="h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 flex overflow-hidden"
  >
    <!-- Sidebar (desktop) -->
    <aside
      class="hidden md:flex md:flex-col w-64 flex-shrink-0 md:sticky md:top-0 md:h-screen bg-white/90 backdrop-blur border-r border-slate-200/60 shadow-sm"
    >
      <!-- Logo / Brand -->
      <div class="h-16 flex items-center px-5 border-b border-slate-100/70">
        <NuxtLink
          to="/customer"
          class="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl"
        >
          <div class="h-10 w-10 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="BKKService"
              class="h-6 w-auto object-contain"
            />
          </div>
          <div class="leading-tight">
            <p class="text-[13px] font-semibold tracking-tight text-slate-900">
              BKKService
            </p>
            <p class="text-[11px] text-slate-400">Customer Portal</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Nav (DESKTOP) -->
      <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <template v-for="(item, index) in sidebarMenu">
          <NuxtLink
            v-if="!item.external"
            :key="item.to"
            :to="item.to"
            @click="handleNavClick(index, item)"
            class="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            :class="
              nav.activeIndex === index
                ? 'bg-blue-400 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 ring-1 ring-transparent hover:ring-slate-200'
            "
          >
            <span
              class="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full transition-colors"
              :class="
                nav.activeIndex === index
                  ? 'bg-white/80'
                  : 'bg-transparent group-hover:bg-slate-300'
              "
            />
            <component
              :is="item.icon"
              class="w-5 h-5 shrink-0 transition-colors"
              :class="
                nav.activeIndex === index
                  ? 'text-white'
                  : 'text-slate-400 group-hover:text-slate-700'
              "
            />
            <span class="truncate">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="ml-auto text-[10px] px-2 py-0.5 rounded-full leading-none transition bg-red-600 text-white shadow-sm"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
          <button
            v-else
            type="button"
            @click="handleNavClick(index, item)"
            class="group relative flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            :class="
              nav.activeIndex === index
                ? 'bg-blue-400 text-white shadow-sm'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 ring-1 ring-transparent hover:ring-slate-200'
            "
          >
            <span
              class="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full transition-colors"
              :class="
                nav.activeIndex === index
                  ? 'bg-white/80'
                  : 'bg-transparent group-hover:bg-slate-300'
              "
            />
            <component
              :is="item.icon"
              class="w-5 h-5 shrink-0 transition-colors"
              :class="
                nav.activeIndex === index
                  ? 'text-white'
                  : 'text-slate-400 group-hover:text-slate-700'
              "
            />
            <span class="truncate">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="ml-auto text-[10px] px-2 py-0.5 rounded-full leading-none transition bg-red-600 text-white shadow-sm"
            >
              {{ item.badge }}
            </span>
          </button>
        </template>
      </nav>
    </aside>

    <!-- Main (right) -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top bar -->
      <header
        class="h-16 flex items-center justify-between px-3 sm:px-5 md:px-7 border-b border-slate-200/70 bg-white/80 backdrop-blur sticky top-0 z-50"
      >
        <!-- Left -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Mobile menu button -->
          <button
            type="button"
            aria-label="เปิดเมนู"
            class="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white h-9 w-9 text-slate-600 hover:bg-slate-50 active:scale-[0.97] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            @click="sidebarOpen = !sidebarOpen"
            :aria-expanded="sidebarOpen"
          >
            <Menu class="w-4 h-4" />
          </button>
        </div>

        <!-- Right -->
        <div class="relative flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <!-- Notification (container = button + dropdown) -->
          <div class="relative" ref="notifRoot" @keydown.escape="closeAllMenus">
            <button
              type="button"
              aria-label="การแจ้งเตือน"
              class="relative inline-flex items-center justify-center rounded-full border border-slate-300 bg-white h-8 w-8 sm:h-9 sm:w-9 text-slate-600 hover:bg-slate-50 active:scale-[0.97] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              @click.stop="toggleNotif"
              :aria-expanded="notifOpen"
            >
              <span
                v-if="unreadCount > 0"
                class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 ring-2 ring-white text-[10px] leading-[14px] text-white flex items-center justify-center"
              >
                {{ unreadCount > 9 ? "9+" : unreadCount }}
              </span>
              <Bell class="w-4 h-4" />
            </button>

            <!-- Dropdown -->
            <transition name="dropdown">
              <div
                v-if="notifOpen"
                class="absolute right-0 top-11 z-40 w-[22rem] max-w-[92vw] rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-lg ring-1 ring-slate-200 p-3 space-y-2 origin-top-right"
              >
                <!-- Pointer -->
                <div
                  class="absolute -top-2 right-8 h-4 w-4 bg-white border border-slate-200 ring-1 ring-slate-200 rotate-45 rounded-sm"
                ></div>

                <!-- Header -->
                <div class="flex items-center justify-between px-1">
                  <div>
                    <p class="text-[13px] font-semibold text-slate-900">
                      การแจ้งเตือน
                    </p>
                    <p class="text-[11px] text-slate-400">อัปเดตล่าสุด</p>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <button
                      type="button"
                      class="text-[11px] px-2 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                      @click="markAllRead"
                    >
                      อ่านทั้งหมด
                    </button>
                    <NuxtLink
                      to="/customer/notifications"
                      class="text-[11px] px-2 py-1 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700"
                    >
                      ดูทั้งหมด
                    </NuxtLink>
                  </div>
                </div>

                <!-- เส้นคั่นระหว่างหัวกับรายการ -->
                <div class="mt-2 mb-1 border-t border-slate-100"></div>

                <!-- List -->
                <ul class="max-h-80 overflow-y-auto">
                  <li
                    v-for="n in notifications"
                    :key="n.id"
                    class="group flex items-start gap-3 px-2 py-2.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 transition"
                  >
                    <component
                      :is="typeToIcon(n.type)"
                      class="w-5 h-5 mt-0.5 shrink-0"
                      :class="typeStyles[n.type]"
                    />
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                        <p
                          class="text-[13px] font-medium text-slate-900 truncate"
                        >
                          {{ n.title }}
                        </p>
                        <span
                          v-if="!n.read"
                          class="inline-block h-1.5 w-1.5 rounded-full bg-blue-600"
                        ></span>
                      </div>
                      <p class="text-[12px] text-slate-600 line-clamp-2">
                        {{ n.desc }}
                      </p>
                      <p class="text-[11px] text-slate-400 mt-0.5">
                        {{ formatTime(n.time) }}
                      </p>
                    </div>
                    <div class="flex gap-1.5">
                      <button
                        type="button"
                        class="rounded-md border border-slate-300 bg-white px-1.5 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
                        @click.stop="toggleRead(n.id)"
                      >
                        {{ n.read ? "ยังไม่อ่าน" : "อ่านแล้ว" }}
                      </button>
                      <button
                        type="button"
                        class="rounded-md border border-slate-300 bg-white px-1.5 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
                        @click.stop="removeNotif(n.id)"
                        aria-label="ลบการแจ้งเตือน"
                      >
                        ลบ
                      </button>
                    </div>
                  </li>

                  <li v-if="notifications.length === 0" class="p-4 text-center">
                    <p class="text-[13px] text-slate-500">
                      ยังไม่มีการแจ้งเตือน
                    </p>
                  </li>
                </ul>
              </div>
            </transition>

            <!-- click-away overlay (ต่ำกว่า dropdown และ header) -->
            <transition name="fade">
              <div
                v-if="notifOpen"
                class="fixed inset-0 z-30"
                @click="closeAllMenus"
              ></div>
            </transition>
          </div>

          <!-- User menu (container = buttons + dropdown) -->
          <div class="relative" ref="userMenuRoot">
            <!-- User pill (desktop/tablet) -->
            <button
              type="button"
              class="hidden sm:flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/60"
              :class="[
                userMenuOpen
                  ? 'bg-white border-blue-300 ring-2 ring-blue-200 shadow-sm'
                  : 'bg-white border-slate-300 hover:bg-slate-50',
              ]"
              @click.stop="toggleUserMenu"
              :aria-expanded="userMenuOpen"
            >
              <div
                class="h-7 w-7 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[11px] font-semibold text-slate-700 shadow-sm"
              >
                CU
              </div>
              <div class="leading-tight min-w-0">
                <p class="text-[11px] font-medium text-slate-800 truncate">
                  Customer User
                </p>
                <p class="text-[10px] text-slate-400 truncate">
                  โรงเรียนรัตนโกสินทร์
                </p>
              </div>
              <ChevronDown
                class="w-4 h-4 ml-0.5 transition-transform duration-200 text-slate-400"
                :class="userMenuOpen ? 'rotate-180 text-slate-600' : ''"
              />
            </button>

            <!-- Avatar button (mobile) -->
            <button
              type="button"
              class="sm:hidden inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-100 h-8 w-8 text-[11px] font-semibold text-slate-700 active:scale-[0.97] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              @click.stop="toggleUserMenu"
              :aria-expanded="userMenuOpen"
            >
              CU
            </button>

            <!-- Dropdown user card -->
            <transition name="dropdown">
              <div
                v-if="userMenuOpen"
                class="absolute right-0 top-11 w-64 sm:w-72 max-w-[92vw] rounded-2xl bg-white/95 backdrop-blur border border-slate-200 shadow-lg ring-1 ring-slate-200 p-3 space-y-3 origin-top-right z-40"
                @keydown.escape="closeAllMenus"
              >
                <!-- Pointer -->
                <div
                  class="absolute -top-2 right-8 h-4 w-4 bg-white border border-slate-200 ring-1 ring-slate-200 rotate-45 rounded-sm"
                ></div>

                <div class="relative flex items-center gap-3">
                  <div
                    class="h-9 w-9 rounded-full bg-white border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    CU
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold text-slate-800 truncate">
                      Customer User
                    </p>
                    <p class="text-[11px] text-slate-400 truncate">
                      โรงเรียนรัตนโกสินทร์
                    </p>
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    class="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-200 active:scale-[0.98] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  >
                    <LogOut class="w-3.5 h-3.5" />
                    ออกจากระบบ
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </header>

      <!-- Mobile sidebar -->
      <div class="md:hidden">
        <!-- backdrop fade -->
        <transition name="fade">
          <div
            v-if="sidebarOpen"
            class="fixed inset-0 z-40 bg-slate-900/40"
            @click="sidebarOpen = false"
          ></div>
        </transition>

        <!-- sidebar slide-in -->
        <transition name="sidebar">
          <aside
            v-if="sidebarOpen"
            class="fixed z-50 top-0 left-0 h-full w-72 max-w-[80vw] bg-white/95 backdrop-blur border-r border-slate-200 shadow-md flex flex-col rounded-r-3xl"
          >
            <div
              class="h-16 flex items-center justify-between px-4 border-b border-slate-100/70"
            >
              <div class="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="BKKService"
                  class="h-7 w-auto object-contain"
                />
                <span class="text-sm font-semibold text-slate-900"
                  >เมนูลูกค้า</span
                >
              </div>
              <button
                class="rounded-full border border-slate-300 h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                @click="sidebarOpen = false"
                aria-label="ปิดเมนู"
              >
                ✕
              </button>
            </div>

            <!-- Nav (MOBILE) -->
            <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
              <NuxtLink
                v-for="item in sidebarMenu"
                :key="item.to + '-mobile'"
                :to="item.to"
                class="group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                :class="
                  isActive(item.to)
                    ? 'bg-blue-400 text-white ring-1 ring-blue-200 shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 ring-1 ring-transparent hover:ring-slate-200'
                "
                @click="sidebarOpen = false"
              >
                <span
                  class="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full transition-colors"
                  :class="
                    isActive(item.to)
                      ? 'bg-white/80'
                      : 'bg-transparent group-hover:bg-slate-300'
                  "
                />
                <component
                  :is="item.icon"
                  class="w-5 h-5 shrink-0 transition-colors"
                  :class="
                    isActive(item.to)
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-slate-700'
                  "
                />
                <span class="truncate">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="ml-auto text-[10px] px-2 py-0.5 rounded-full leading-none transition bg-red-600 text-white shadow-sm"
                >
                  {{ item.badge }}
                </span>
              </NuxtLink>
            </nav>
          </aside>
        </transition>
      </div>

      <!-- Content -->
      <main ref="scrollContainer" class="flex-1 min-h-0 overflow-y-auto">
        <div class="px-3 sm:px-6 py-4 sm:py-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "#imports";
import {
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  PlusCircle,
} from "lucide-vue-next";
import { useSidebarMenu } from "@/composables/sidebar/sidebarItem";
import { useNavStore } from "@/stores/nav.stores";
import type { menu } from "@/types/sidebar";

const route = useRoute();
const { sidebarMenu } = useSidebarMenu();
const nav = useNavStore();

const sidebarOpen = ref(false);
const userMenuOpen = ref(false);
const notifOpen = ref(false);

// scroll container จริง
const scrollContainer = ref<HTMLElement | null>(null);
const isFirstRoute = ref(true);

const scrollToTopAndWait = () => {
  return new Promise<void>((resolve) => {
    if (!scrollContainer.value) return resolve();

    const el = scrollContainer.value;

    const done = () => {
      el.removeEventListener("scroll", onScroll);
      resolve();
    };

    const onScroll = () => {
      if (el.scrollTop === 0) {
        done();
      }
    };

    el.addEventListener("scroll", onScroll);

    // ถ้าตอนนี้อยู่ top อยู่แล้ว ก็จบเลย
    if (el.scrollTop === 0) {
      done();
      return;
    }

    el.scrollTo({ top: 0, behavior: "smooth" });
  });
};

// เลื่อนขึ้นบนสุดแบบ smooth
const scrollToTopSmooth = () => {
  scrollContainer.value?.scrollTo({ top: 0, behavior: "smooth" });
};

const syncActiveWithRoute = () => {
  const i = sidebarMenu.value.findIndex(
    (i) => !i.external && i.to === route.path
  );
  if (i !== -1) nav.setActive(i);
};

const handleNavClick = async (index: number, item: menu) => {
  if (item.external) {
    if (import.meta.client) {
      window.open(item.to, "_self");
    }
    return;
  }

  const isSameRoute = nav.activeIndex === index && route.path === item.to;

  if (isSameRoute) {
    if (import.meta.client) {
      await scrollToTopAndWait(); // ✅ รอให้เลื่อนจบก่อน
    }

    await refreshNuxtData(); // แล้วค่อย refresh
    return;
  }

  nav.setActive(index);
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

// กล่องรวม (root) ที่ครอบปุ่ม + dropdown
const notifRoot = ref<HTMLElement | null>(null);
const userMenuRoot = ref<HTMLElement | null>(null);

type NotifType = "new" | "progress" | "done" | "alert";
interface Notif {
  id: string;
  title: string;
  desc?: string;
  time: string; // ISO string
  type: NotifType;
  read: boolean;
}

const notifications = ref<Notif[]>([
  {
    id: "n1",
    title: "งาน #JS-102 ถูกสร้าง",
    desc: "ผู้ใช้ ครูสุนีย์ แจ้งซ่อมโปรเจคเตอร์ที่ห้อง 3/2",
    time: new Date().toISOString(),
    type: "new",
    read: false,
  },
  {
    id: "n2",
    title: "ช่างกำลังดำเนินการ",
    desc: "งาน #JS-099 อยู่ระหว่างตรวจสอบอะไหล่",
    time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: "progress",
    read: false,
  },
  {
    id: "n3",
    title: "ปิดงานเรียบร้อย",
    desc: "งาน #JS-090 เสร็จสมบูรณ์",
    time: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    type: "done",
    read: true,
  },
]);

const typeToIcon = (t: NotifType) =>
  ({
    new: PlusCircle,
    progress: Loader2,
    done: CheckCircle2,
    alert: AlertTriangle,
  }[t]);

const typeStyles: Record<NotifType, string> = {
  new: "text-blue-500",
  progress: "text-amber-500",
  done: "text-emerald-500",
  alert: "text-rose-500",
};

const unreadCount = computed(
  () => notifications.value.filter((n) => !n.read).length
);

function markAllRead() {
  notifications.value = notifications.value.map((n) => ({ ...n, read: true }));
}
function toggleRead(id: string) {
  notifications.value = notifications.value.map((n) =>
    n.id === id ? { ...n, read: !n.read } : n
  );
}
function removeNotif(id: string) {
  notifications.value = notifications.value.filter((n) => n.id !== id);
}
function formatTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "เมื่อสักครู่";
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชม.ที่แล้ว`;
  const d = Math.floor(h / 24);
  return `${d} วันที่แล้ว`;
}

// helpers สำหรับเปิด/ปิดเมนูให้เปิดได้ทีละอัน
const closeAllMenus = () => {
  notifOpen.value = false;
  userMenuOpen.value = false;
};

const toggleNotif = () => {
  const next = !notifOpen.value;
  notifOpen.value = next;
  if (next) userMenuOpen.value = false;
};

const toggleUserMenu = () => {
  const next = !userMenuOpen.value;
  userMenuOpen.value = next;
  if (next) notifOpen.value = false;
};

// Click-outside & ESC handlers
const onDocClick = (e: MouseEvent) => {
  const t = e.target as Node;

  if (notifOpen.value && notifRoot.value && !notifRoot.value.contains(t)) {
    notifOpen.value = false;
  }
  if (
    userMenuOpen.value &&
    userMenuRoot.value &&
    !userMenuRoot.value.contains(t)
  ) {
    userMenuOpen.value = false;
  }
};
const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    closeAllMenus();
  }
};

onMounted(() => {
  document.addEventListener("click", onDocClick);
  document.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick);
  document.removeEventListener("keydown", onKey);
});

// ปิดเมนูเมื่อเปลี่ยนหน้า
watch(
  () => route.fullPath,
  () => {
    closeAllMenus();
    sidebarOpen.value = false;
  }
);

const isActive = (path: string) =>
  route.path === path || route.path.startsWith(path + "/");
</script>

<style scoped>
/***** Transitions *****/
/* fade overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* sidebar slide-in (mobile) */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.24s ease-out, opacity 0.24s ease-out;
}
.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-14px);
  opacity: 0;
}

/* sidebar slide-in (mobile) */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.24s ease-out, opacity 0.24s ease-out;
}
.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .sidebar-enter-active,
  .sidebar-leave-active,
  .dropdown-enter-active,
  .dropdown-leave-active,
  .page-enter-active,
  .page-leave-active {
    transition: none !important;
  }
}

/* Fallback หากไม่ได้ใช้ tailwind line-clamp plugin */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
