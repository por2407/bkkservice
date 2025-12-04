<template>
  <!-- กล่องหลัก มี padding ครบในตัว -->
  <div
    class="min-h-full pt-4 pb-6 transition-colors duration-300"
    :class="[pageBgClass, isMobile ? 'px-3' : 'px-4']"
  >
    <!-- top header / hero -->
    <TasksHeader :taskCount="filteredTasks.length">
      <div class="flex justify-center gap-2">
        <!-- in_progress -->
        <button
          type="button"
          @click="taksFilter.setActiveFilter('in_progress')"
          class="w-1/3 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 backdrop-blur transition active:scale-[0.98] border-2 border-white/70"
          :class="
            taksFilter.activeFilter === 'in_progress'
              ? filterStyles.in_progress
              : 'bg-white/10 text-emerald-50/90 opacity-80'
          "
        >
          <Clock class="h-5 w-5" />
          <div>
            <p class="text-[10px] opacity-90">กำลังดำเนินการ</p>
            <p class="text-[15px] font-bold">{{ inProgressCount }}</p>
          </div>
        </button>

        <!-- done -->
        <button
          type="button"
          @click="taksFilter.setActiveFilter('done')"
          class="w-1/3 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 backdrop-blur transition active:scale-[0.98] border-2 border-white/70"
          :class="
            taksFilter.activeFilter === 'done'
              ? filterStyles.done
              : 'bg-white/10 text-emerald-50/90 opacity-80'
          "
        >
          <CheckCircle2 class="h-5 w-5" />
          <div>
            <p class="text-[10px] opacity-90">เสร็จแล้ว</p>
            <p class="text-[15px] font-bold">{{ doneCount }}</p>
          </div>
        </button>

        <!-- all -->
        <button
          v-if="!isEmployee"
          type="button"
          @click="taksFilter.setActiveFilter('all')"
          class="w-1/3 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 backdrop-blur transition active:scale-[0.98] border-2 border-white/70"
          :class="
            taksFilter.activeFilter === 'all'
              ? filterStyles.all
              : 'bg-white/10 text-emerald-50/90 opacity-80'
          "
        >
          <ClipboardList class="h-5 w-5" />
          <div>
            <p class="text-[10px] opacity-90">งานทั้งหมด</p>
            <p class="text-[15px] font-bold">{{ totalTasks }}</p>
          </div>
        </button>
      </div>
    </TasksHeader>

    <!-- search box sticky (full-bleed ตาม padding ของหน้าปัจจุบัน) -->
    <section :class="isMobile ? 'sticky -top-3 z-30' : ''">
      <div
        :class="[
          isMobile ? '-mx-3' : '-mx-4',
          showStickyHeader
            ? 'bg-slate-50/90 backdrop-blur supports-[backdrop-filter]:bg-slate-50/70 border-b border-slate-200/70 shadow-sm rounded-b-2xl'
            : '',
        ]"
      >
        <div :class="['pt-2 pb-2', isMobile ? 'px-3' : 'px-4']">
          <div class="relative">
            <!-- icon ซ้าย -->
            <span
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-500/70"
            >
              <Search class="h-4 w-4" />
            </span>

            <!-- ช่องค้นหา -->
            <input
              v-model="searchQuery"
              type="text"
              inputmode="search"
              placeholder="ค้นหาจากเลขที่งาน ห้อง หรือคำอธิบาย"
              class="w-full rounded-2xl border border-emerald-100 bg-white/90 py-2 pl-9 pr-8 text-[13px] text-gray-800 shadow-sm outline-none ring-0 placeholder:text-gray-400 focus:border-emerald-400 focus:bg-white focus:shadow-[0_10px_24px_rgba(15,23,42,0.08)] focus:ring-2 focus:ring-emerald-200"
            />

            <!-- ปุ่มล้างข้อความ -->
            <button
              v-if="searchQuery"
              type="button"
              @click="searchQuery = ''"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 active:scale-95"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>

    <div ref="headerRef"></div>

    <!-- list -->
    <TaskList
      v-if="!loading && filteredTasks.length > 0"
      :TaskData="visibleTasks"
      :isCustomer="isCustomer"
      :isDealer="isDealer"
    />

    <!-- sentinel สำหรับ infinite scroll -->
    <div
      ref="infiniteScrollTrigger"
      v-show="!loading && canLoadMore && filteredTasks.length > 0"
      class="h-10 w-full flex items-center justify-center text-[11px] text-gray-400"
    >
      เลื่อนลงเพื่อโหลดงานเพิ่ม...
    </div>

    <!-- skeleton ตอนโหลดครั้งแรก -->
    <section
      v-if="loading"
      class="mt-4 space-y-3"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        class="flex items-center justify-center gap-2 text-emerald-700/80 text-sm"
      >
        <span class="spinner"></span>
        <span>กำลังโหลดรายการงาน...</span>
      </div>

      <div
        v-for="i in 3"
        :key="i"
        class="skeleton-card rounded-2xl border border-emerald-100 bg-white/80 p-3 shadow-sm"
      >
        <div class="flex items-start gap-3">
          <div class="flex-1 space-y-2">
            <div class="skeleton h-4 w-2/5 rounded"></div>
            <div class="skeleton h-3 w-full rounded"></div>
            <div class="skeleton h-3 w-4/5 rounded"></div>
            <div class="flex gap-2 pt-1">
              <div class="skeleton h-3 w-16 rounded-full"></div>
              <div class="skeleton h-3 w-20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ไม่มีงาน -->
    <section
      v-else-if="!loading && filteredTasks.length === 0"
      class="pt-6 pb-4 flex flex-col items-center justify-center text-center text-gray-400"
    >
      <img
        src="/logo.png"
        alt="ไม่มีรายการงาน"
        class="mb-3 h-16 w-auto opacity-80"
      />
      <p class="text-[12px]">ไม่พบงานในขณะนี้</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ClipboardList, Clock, CheckCircle2, Search, X } from "lucide-vue-next";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { storeToRefs } from "pinia";
import TasksHeader from "@/components/share/task/TasksHeader.vue";
import TaskList from "@/components/share/task/TaskList.vue";
import { useTaskList } from "@/composables/task/useTaskList";
import { useAuthStore } from "@/stores/auth.stores";
import { useStickyHeader } from "@/composables/useStickyHeader";
import { useTaskFilterStore } from "~/stores/TaskFilter.stores";

const authStore = useAuthStore();
const taksFilter = useTaskFilterStore();
const { isMobile } = storeToRefs(authStore);

const { headerRef, showStickyHeader } = useStickyHeader(isMobile);
const isEmployee = computed(() => !!(authStore.user?.userType === "e"));
const isCustomer = computed(() => !!(authStore.user?.userType === "c"));
const isDealer = computed(() => !!(authStore.user?.userType === "d"));

const {
  selectedFilter,
  searchQuery,
  filteredTasks,
  visibleTasks,
  totalTasks,
  inProgressCount,
  doneCount,
  pageBgClass,
  filterStyles,
  loading,
  canLoadMore,
  loadMore,
} = useTaskList(toRef(taksFilter, "activeFilter"));

// ref สำหรับ sentinel element
const infiniteScrollTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;

      if (entry.isIntersecting && canLoadMore.value && !loading.value) {
        loadMore();
      }
    },
    {
      root: null,
      rootMargin: "0px 0px 200px 0px",
      threshold: 0.1,
    }
  );

  if (infiniteScrollTrigger.value) {
    observer.observe(infiniteScrollTrigger.value);
  }
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<style scoped>
/* สปินเนอร์เล็ก ๆ ข้างข้อความ */
.spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(16, 185, 129, 0.25);
  border-top-color: rgba(16, 185, 129, 0.9);
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* skeleton shimmer */
.skeleton-card {
  position: relative;
  overflow: hidden;
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(226, 232, 240, 0.7) 25%,
    rgba(241, 245, 249, 0.9) 37%,
    rgba(226, 232, 240, 0.7) 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
