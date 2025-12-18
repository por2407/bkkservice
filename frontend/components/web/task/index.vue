<template>
  <div class="min-h-full flex flex-col bg-[var(--bg-surface)]">
    <!-- Header & Filters -->
    <div
      class="px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur"
    >
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-2xl font-bold text-[var(--text-primary)]">
            รายการแจ้งซ่อม
          </h1>
          <p class="text-sm text-[var(--text-secondary)] mt-1">
            ติดตามสถานะและประวัติการแจ้งซ่อมทั้งหมด
          </p>
        </div>

        <div
          class="flex items-center gap-3 bg-[var(--color-secondary-50)] p-1 rounded-xl border border-[var(--border-subtle)]"
        >
          <button
            type="button"
            @click="taksFilter.setActiveFilter('in_progress')"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            :class="
              taksFilter.activeFilter === 'in_progress'
                ? filterStyles.in_progress
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            "
          >
            <Clock class="w-4 h-4" />
            <span>กำลังดำเนินการ</span>
            <span
              class="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-current text-xs"
            >
              {{ inProgressCount }}
            </span>
          </button>

          <button
            type="button"
            @click="taksFilter.setActiveFilter('done')"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            :class="
              taksFilter.activeFilter === 'done'
                ? filterStyles.done
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            "
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>เสร็จแล้ว</span>
            <span
              class="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-current text-xs"
            >
              {{ doneCount }}
            </span>
          </button>

          <button
            v-if="!isEmployee"
            type="button"
            @click="taksFilter.setActiveFilter('all')"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            :class="
              taksFilter.activeFilter === 'all'
                ? filterStyles.all
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            "
          >
            <ClipboardList class="w-4 h-4" />
            <span>ทั้งหมด</span>
            <span
              class="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-current text-xs"
            >
              {{ totalTasks }}
            </span>
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="mt-4 relative max-w-md">
        <Search
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]"
        />
        <input
          v-model="searchQuery"
          type="text"
          class="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
          placeholder="ค้นหาเลขที่งาน, ห้อง, หรือรายละเอียด..."
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center h-64 text-[var(--text-secondary)]"
      >
        <Loader2
          class="w-8 h-8 animate-spin mb-2 text-[var(--color-primary-500)]"
        />
        <p>กำลังโหลดข้อมูล...</p>
      </div>

      <div
        v-else-if="filteredTasks.length === 0"
        class="flex flex-col items-center justify-center h-64 text-[var(--text-secondary)]"
      >
        <div
          class="w-16 h-16 bg-[var(--color-secondary-50)] rounded-full flex items-center justify-center mb-4"
        >
          <ClipboardList class="w-8 h-8 text-[var(--color-secondary-400)]" />
        </div>
        <p class="font-medium">ไม่พบรายการแจ้งซ่อม</p>
        <p class="text-sm">ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะ</p>
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
        <!-- Table Header (Desktop) -->
        <div
          class="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
        >
          <div>เลขที่งาน / ห้อง</div>
          <div>รายละเอียด</div>
          <div>สถานะ</div>
          <div>วันที่แจ้ง / อัปเดต</div>
          <div></div>
        </div>

        <!-- Task Items -->
        <NuxtLink
          v-for="task in visibleTasks"
          :key="task.id"
          :to="`/${isCustomer ? 'customer' : 'employee'}/task/${task.ticket}`"
          @click="taskStore.setList(task)"
          class="group bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 hover:border-[var(--color-primary-300)] hover:shadow-md transition-all grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_1fr_auto] gap-4 items-center"
        >
          <!-- ID & Room -->
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-[var(--color-primary-600)]"
                >#{{ task.ticket }}</span
              >
              <span
                v-if="task.isMine && isCustomer"
                class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border border-[var(--color-primary-100)]"
              >
                ของฉัน
              </span>
            </div>
            <div
              class="flex items-center gap-1 text-sm text-[var(--text-secondary)] mt-1"
            >
              <MapPin class="w-3.5 h-3.5" />
              <span>ห้อง {{ task.room || "-" }}</span>
            </div>
            <div
              v-if="task.schoolName"
              class="text-xs text-[var(--color-info-600)] mt-0.5"
            >
              {{ task.schoolName }}
            </div>
          </div>

          <!-- Description -->
          <div class="min-w-0">
            <p class="text-sm text-[var(--text-primary)] line-clamp-2">
              {{ task.description }}
            </p>
            <div class="flex items-center gap-3 mt-2">
              <div
                v-if="task.hasImage || task.hasVideo"
                class="flex items-center gap-1 text-xs text-[var(--color-info-600)]"
              >
                <Image v-if="task.hasImage" class="w-3.5 h-3.5" />
                <Video v-if="task.hasVideo" class="w-3.5 h-3.5" />
                <span>มีไฟล์แนบ</span>
              </div>
              <div
                v-if="(task.commentsCount ?? 0) > 0"
                class="flex items-center gap-1 text-xs text-[var(--color-primary-600)]"
              >
                <MessageCircle class="w-3.5 h-3.5" />
                <span>{{ task.commentsCount }} ความคิดเห็น</span>
              </div>
              <!-- Rating -->
              <div
                v-if="task.canRate"
                class="flex items-center gap-1 text-xs"
                :class="
                  task.rating
                    ? 'text-[var(--color-warning-600)]'
                    : 'text-[var(--text-secondary)]'
                "
              >
                <Star
                  class="w-3.5 h-3.5"
                  :class="
                    task.rating
                      ? 'fill-[var(--color-warning-400)] text-[var(--color-warning-400)]'
                      : 'text-[var(--color-secondary-300)]'
                  "
                />
                <span v-if="task.rating">{{ task.rating }}/5</span>
                <span v-else>รอคะแนน</span>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div>
            <div
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
              :class="
                task.status === 'done'
                  ? 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border-[var(--color-success-200)]'
                  : 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border-[var(--color-warning-200)]'
              "
            >
              <CheckCircle2 v-if="task.status === 'done'" class="w-3.5 h-3.5" />
              <Clock v-else class="w-3.5 h-3.5" />
              <span>{{ statusShort(task.status) }}</span>
              <span
                v-if="task.status === 'in_progress' && task.currentStep"
                class="ml-1 inline-flex items-center justify-center h-3.5 px-1.5 rounded-full bg-[var(--color-primary-500)] text-[10px] font-semibold text-white"
              >
                {{ task.currentStep }}/5
              </span>
            </div>
          </div>

          <!-- Date -->
          <div class="text-sm">
            <div class="text-[var(--text-primary)]">
              {{ formatUpdatedAt(task.updatedAt) }}
            </div>
            <div
              v-if="task.dueDate"
              class="text-xs text-[var(--color-error-500)] font-medium mt-1"
            >
              ครบกำหนด: {{ formatDueDate(task.dueDate) }}
            </div>

            <!-- Dealer Status Display -->
            <div
              v-if="isDealer"
              class="text-xs font-semibold"
              :class="getDealerStatusDisplay(task).colorClass"
            >
              {{ getDealerStatusDisplay(task).text }}
            </div>
          </div>

          <!-- Action -->
          <div class="flex justify-end">
            <div
              class="p-2 rounded-full text-[var(--text-secondary)] group-hover:bg-[var(--color-secondary-50)] group-hover:text-[var(--color-primary-600)] transition"
            >
              <ChevronRight class="w-5 h-5" />
            </div>
          </div>
        </NuxtLink>

        <!-- Infinite Scroll Sentinel -->
        <div
          ref="infiniteScrollTrigger"
          v-show="!loading && canLoadMore && filteredTasks.length > 0"
          class="h-10 w-full flex items-center justify-center text-xs text-[var(--text-secondary)]"
        >
          เลื่อนลงเพื่อโหลดงานเพิ่ม...
        </div>

        <div
          v-if="!canLoadMore"
          class="pt-6 pb-4 flex flex-col items-center justify-center text-center text-secondary-400"
        >
          <p class="text-[13px]">โหลดข้อมูลครบแล้ว</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Search,
  X,
  MapPin,
  Image,
  Video,
  MessageCircle,
  ChevronRight,
  Loader2,
  Star,
} from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useTaskList } from "@/composables/task/useTaskList";
import { useAuthStore } from "@/stores/auth.stores";
import { useTaskFilterStore } from "~/stores/TaskFilter.stores";
import { formatDueDate, formatUpdatedAt } from "@/utils/date";
import type { TaskStatus, Task } from "@/types/task";
import { useTaskStore } from "@/stores/task.stores";

const authStore = useAuthStore();
const taksFilter = useTaskFilterStore();
const taskStore = useTaskStore();

const isEmployee = computed(() => !!(authStore.user?.userType === "e"));
const isCustomer = computed(() => !!(authStore.user?.userType === "c"));
const isDealer = computed(() => !!(authStore.user?.userType === "d"));

const {
  searchQuery,
  filteredTasks,
  visibleTasks,
  totalTasks,
  inProgressCount,
  doneCount,
  loading,
  canLoadMore,
  loadMore,
  filterStyles,
} = useTaskList(toRef(taksFilter, "activeFilter"));

const statusShort = (status: TaskStatus) => {
  switch (status) {
    case "in_progress":
      return "กำลังทำ";
    case "done":
      return "เสร็จแล้ว";
    default:
      return status;
  }
};

const getDealerStatusDisplay = (item: Task) => {
  const textMap: Record<string, string> = {
    in_progress: `วันที่กำหนดแล้วเสร็จ (ในเวลาทำการ): ${item.eduExh48}`,
    done: item.endsv_job ? `Finished ${item.endsv_job}` : "ยังไม่จบงาน",
  };

  const text = textMap[item.status] ?? "สถานะไม่ทราบ";

  const colorClass =
    item.status === "done" && item.endsv_job
      ? "text-[var(--color-success-500)]"
      : "text-[var(--color-error-500)]";

  return { text, colorClass };
};

// Infinite scroll logic for web
const infiniteScrollTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// ฟังก์ชันสำหรับสร้าง observer
const setupObserver = () => {
  // ถ้ามี observer อยู่แล้ว ให้ disconnect ก่อน
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  // ตรวจสอบว่า element พร้อมหรือยัง
  if (!infiniteScrollTrigger.value) {
    // console.log("⏳ Trigger element not ready yet");
    return;
  }

  // หา scroll container จาก parent (ShellWeb's main element)
  const scrollContainer = infiniteScrollTrigger.value.closest("main");

  // console.log("🔍 Scroll container found:", scrollContainer);
  // console.log("🔍 Trigger element:", infiniteScrollTrigger.value);

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;

      // console.log("📊 Intersection:", {
      //     isIntersecting: entry.isIntersecting,
      //     canLoadMore: canLoadMore.value,
      //     loading: loading.value,
      //     intersectionRatio: entry.intersectionRatio
      // });

      if (entry.isIntersecting && canLoadMore.value && !loading.value) {
        // console.log("✅ Infinite scroll triggered - loading more...");
        loadMore();
      }
    },
    {
      root: scrollContainer, // ใช้ scroll container จาก ShellWeb
      rootMargin: "0px 0px 400px 0px", // เพิ่มระยะให้โหลดก่อนถึงจุดสุดท้าย
      threshold: 0.01, // ลดลงเพื่อให้ trigger ง่ายขึ้น
    }
  );

  observer.observe(infiniteScrollTrigger.value);
  // console.log("✅ Observer attached to trigger element");
};

// รอให้ element ถูก render แล้วค่อยสร้าง observer
watch(
  [infiniteScrollTrigger, () => filteredTasks.value.length, loading],
  async ([trigger, tasksLength, isLoading]) => {
    // รอให้มี tasks และไม่ loading และ element ถูก render แล้ว
    if (trigger && tasksLength > 0 && !isLoading) {
      await nextTick();
      setupObserver();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (!("IntersectionObserver" in window)) {
    console.warn("IntersectionObserver not supported");
  }
});

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>
