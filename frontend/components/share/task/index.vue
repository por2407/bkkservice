<template>
  <!-- กล่องหลัก มี padding ครบในตัว -->
  <div
    class="min-h-screen px-4 pt-4 pb-6 transition-colors duration-300"
    :class="pageBgClass"
  >
    <!-- top header / hero -->
    <TasksHeader :taskCount="filteredTasks.length">
      <!-- ใช้การ์ดด้านบนเป็นตัวกรอง -->
      <div class="grid grid-cols-3 gap-2">
        <!-- in_progress -->
        <button
          type="button"
          @click="selectedFilter = 'in_progress'"
          :class="[
            'flex items-center gap-1.5 rounded-2xl px-2.5 py-1.5 backdrop-blur transition active:scale-[0.98]',
            selectedFilter === 'in_progress'
              ? filterStyles.in_progress
              : 'bg-white/10 text-emerald-50/90 opacity-80',
          ]"
          class="border-2 border-white/70"
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
          @click="selectedFilter = 'done'"
          :class="[
            'flex items-center gap-1.5 rounded-2xl px-2.5 py-1.5 backdrop-blur transition active:scale-[0.98]',
            selectedFilter === 'done'
              ? filterStyles.done
              : 'bg-white/10 text-emerald-50/90 opacity-80',
          ]"
          class="border-2 border-white/70"
        >
          <CheckCircle2 class="h-5 w-5" />
          <div>
            <p class="text-[10px] opacity-90">เสร็จแล้ว</p>
            <p class="text-[15px] font-bold">{{ doneCount }}</p>
          </div>
        </button>

        <!-- all -->
        <button
          type="button"
          @click="selectedFilter = 'all'"
          :class="[
            'flex items-center gap-1.5 rounded-2xl px-2.5 py-1.5 backdrop-blur transition active:scale-[0.98]',
            selectedFilter === 'all'
              ? filterStyles.all
              : 'bg-white/10 text-emerald-50/90 opacity-80',
          ]"
          class="border-2 border-white/70"
        >
          <ClipboardList class="h-5 w-5" />
          <div>
            <p class="text-[10px] opacity-90">งานทั้งหมด</p>
            <p class="text-[15px] font-bold">{{ totalTasks }}</p>
          </div>
        </button>
      </div>
    </TasksHeader>

    <!-- search box แบบ sticky (ตัวเดียว ไม่ใช้ StickyHeader แล้ว) -->
    <section
      class="sticky top-0 z-30 pt-2 pb-2 "
    >
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
    </section>

    <!-- list -->
    <TaskList
      v-if="!loading && filteredTasks.length > 0"
      :TaskData="visibleTasks"
    />

    <!-- sentinel สำหรับ infinite scroll (อยู่ท้าย list เสมอ แต่ซ่อน/โชว์ด้วย v-show) -->
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
      <!-- หัวโหลด -->
      <div
        class="flex items-center justify-center gap-2 text-emerald-700/80 text-sm"
      >
        <span class="spinner"></span>
        <span>กำลังโหลดรายการงาน...</span>
      </div>

      <!-- skeleton cards -->
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

    <!-- กรณีโหลดเสร็จแล้ว และไม่เหลืออะไรโหลดเพิ่ม + ไม่มีงานเลย -->
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

    <!-- ปุ่มเลื่อนขึ้นบนสุด (floating) -->
    <button
      v-show="showScrollTop"
      type="button"
      @click="scrollToTop"
      class="fixed right-4 z-40 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 p-3 active:scale-95"
      :style="{ bottom: 'calc(120px + env(safe-area-inset-bottom))' }"
      aria-label="เลื่อนขึ้นด้านบนสุด"
    >
      <ChevronUp class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Search,
  X,
  ChevronUp,
} from "lucide-vue-next";
import { ref, onMounted, onBeforeUnmount } from "vue";
import TasksHeader from "@/components/share/task/TasksHeader.vue";
import TaskList from "@/components/share/task/TaskList.vue";
import { useTaskList } from "@/composables/task/useTaskList";

// ดึง state จาก useTaskList
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
} = useTaskList();

// ref สำหรับ sentinel element (infinite scroll)
const infiniteScrollTrigger = ref<HTMLElement | null>(null);
// container ที่เลื่อนจริง (main#app-scroll ใน layout)
const scrollContainer = ref<HTMLElement | null>(null);
// state สำหรับปุ่มขึ้นบนสุด
const showScrollTop = ref(false);

let observer: IntersectionObserver | null = null;
let scrollHandler: ((e: Event) => void) | null = null;

onMounted(() => {
  // หา scroll container (main ใน layout)
  scrollContainer.value = document.getElementById(
    "app-scroll"
  ) as HTMLElement | null;

  if (scrollContainer.value) {
    scrollHandler = () => {
      // โชว์ปุ่มเมื่อเลื่อนลงมามากกว่า ~300px
      showScrollTop.value = scrollContainer.value!.scrollTop > 300;
    };
    scrollContainer.value.addEventListener("scroll", scrollHandler, {
      passive: true,
    });
  }

  // ถ้า browser ไม่รองรับ IntersectionObserver ก็จบแค่นี้ (ยังใช้ scroll-to-top ได้)
  if (!("IntersectionObserver" in window)) {
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;

      // ถ้าหัว sentinel ชน viewport + ยังมีให้โหลด + ไม่ได้โหลดอยู่
      if (entry.isIntersecting && canLoadMore.value && !loading.value) {
        loadMore();
      }
    },
    {
      // ใช้ scroll container เป็น root จะนิ่งดีใน app ที่เป็น webview
      root: scrollContainer.value ?? null,
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

  if (scrollContainer.value && scrollHandler) {
    scrollContainer.value.removeEventListener("scroll", scrollHandler);
  }
});

// ฟังก์ชันเลื่อนขึ้นบนสุด
const scrollToTop = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    // fallback ถ้าไหน ๆ (เช่น เปลี่ยน layout ในอนาคต)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
</script>

<style scoped>
/* สปินเนอร์เล็ก ๆ ข้างข้อความ */
.spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(16, 185, 129, 0.25); /* emerald-500 แบบจาง */
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
