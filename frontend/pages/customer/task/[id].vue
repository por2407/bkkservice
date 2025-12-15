<template>
  <div class="min-h-screen bg-slate-50 pb-6">
    <!-- 🦴 SKELETON ตอนโหลดครั้งแรก -->
    <section v-if="loading" class="mt-0 space-y-4 px-4 pb-4" aria-busy="true" aria-live="polite">
      <!-- Mobile Skeleton -->
      <div v-if="isMobile">
        <!-- แถวแจ้งกำลังโหลด -->
        <div class="pt-3 flex items-center justify-center gap-2 text-emerald-700/80 text-sm">
          <span class="spinner"></span>
          <span>กำลังโหลดรายละเอียดงาน...</span>
        </div>

        <!-- HEADER: ปุ่ม back + ชื่อหน้า + chip หมายเลขงาน -->
        <header class="mt-1 bg-slate-50/80 backdrop-blur rounded-2xl">
          <div class="flex items-center justify-between px-2 pt-3 pb-2">
            <div class="flex items-center gap-3">
              <!-- ปุ่ม back -->
              <div class="skeleton h-8 w-8 rounded-full"></div>
              <!-- ชื่อหน้า -->
              <div class="skeleton h-4 w-28 rounded"></div>
            </div>
            <!-- chip id -->
            <div class="skeleton h-5 w-16 rounded-full"></div>
          </div>

          <!-- การ์ดข้อมูลงาน (TaskDetailHeader skeleton) -->
          <div class="px-2 pb-3">
            <div class="skeleton-card rounded-2xl border border-slate-100 bg-white/80 p-3 shadow-sm space-y-2">
              <div class="flex items-start gap-3">
                <!-- icon / avatar -->
                <div class="skeleton h-9 w-9 rounded-full"></div>
                <div class="flex-1 space-y-2">
                  <div class="skeleton h-4 w-3/5 rounded"></div>
                  <div class="skeleton h-3 w-2/5 rounded"></div>
                  <div class="flex flex-wrap gap-2 pt-1">
                    <div class="skeleton h-4 w-20 rounded-full"></div>
                    <div class="skeleton h-4 w-16 rounded-full"></div>
                    <div class="skeleton h-4 w-24 rounded-full"></div>
                  </div>
                </div>
              </div>

              <!-- แถวข้อมูลสรุปสั้น ๆ -->
              <div class="mt-2 grid grid-cols-3 gap-2">
                <div class="space-y-1">
                  <div class="skeleton h-2.5 w-10 rounded"></div>
                  <div class="skeleton h-3.5 w-16 rounded"></div>
                </div>
                <div class="space-y-1">
                  <div class="skeleton h-2.5 w-12 rounded"></div>
                  <div class="skeleton h-3.5 w-20 rounded"></div>
                </div>
                <div class="space-y-1">
                  <div class="skeleton h-2.5 w-14 rounded"></div>
                  <div class="skeleton h-3.5 w-16 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- การ์ดสรุปงาน (TaskSummaryCard skeleton) -->
        <div class="skeleton-card rounded-2xl border border-slate-100 bg-white/80 p-3.5 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <div class="skeleton h-3.5 w-24 rounded"></div>
            <div class="skeleton h-3 w-10 rounded-full"></div>
          </div>
          <div class="space-y-2">
            <div class="skeleton h-3 w-full rounded"></div>
            <div class="skeleton h-3 w-4/5 rounded"></div>
            <div class="skeleton h-3 w-3/5 rounded"></div>
          </div>
        </div>

        <!-- การ์ดให้คะแนน (TaskSatisfactionCard skeleton) -->
        <div class="skeleton-card rounded-2xl border border-slate-100 bg-white/80 p-3.5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="skeleton h-3.5 w-28 rounded"></div>
            <div class="skeleton h-3 w-16 rounded-full"></div>
          </div>
          <div class="flex items-center gap-2">
            <div v-for="i in 5" :key="i" class="skeleton h-6 w-6 rounded-full"></div>
            <div class="flex-1"></div>
            <div class="skeleton h-7 w-20 rounded-full"></div>
          </div>
        </div>

        <!-- สื่อหน้างาน skeleton -->
        <section class="skeleton-card rounded-2xl border border-slate-100 bg-white/80 p-3.5 shadow-sm">
          <div class="mb-2 flex items-center justify-between">
            <div class="inline-flex items-center gap-2">
              <div class="skeleton h-4 w-4 rounded-full"></div>
              <div class="skeleton h-3.5 w-20 rounded"></div>
            </div>
            <div class="skeleton h-3 w-14 rounded"></div>
          </div>
          <div class="flex gap-2 overflow-hidden">
            <div v-for="i in 3" :key="i" class="skeleton h-32 min-w-[140px] rounded-2xl"></div>
          </div>
        </section>

        <!-- ไทม์ไลน์การดำเนินการ skeleton -->
        <section class="skeleton-card rounded-2xl border border-slate-100 bg-white/80 p-3.5 shadow-sm">
          <div class="mb-3 flex items-center justify-between">
            <div class="inline-flex items-center gap-2">
              <div class="skeleton h-4 w-4 rounded-full"></div>
              <div class="skeleton h-3.5 w-28 rounded"></div>
            </div>
            <div class="skeleton h-3 w-20 rounded"></div>
          </div>

          <!-- เส้น timeline -->
          <div class="relative">
            <div class="pointer-events-none absolute left-[13px] top-3 bottom-3 w-[2px] bg-slate-200"></div>

            <div v-for="i in 4" :key="i" class="relative flex gap-3 pb-4 last:pb-0">
              <!-- จุดสถานะ -->
              <div
                class="relative mt-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-200 bg-white">
                <div class="skeleton h-4 w-4 rounded-full"></div>
              </div>

              <!-- การ์ดข้อความ -->
              <div class="flex-1 rounded-2xl px-3 py-2.5">
                <div class="skeleton h-3.5 w-32 rounded mb-1"></div>
                <div class="skeleton h-3 w-4/5 rounded mb-1"></div>
                <div class="skeleton h-3 w-3/5 rounded"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- คอมเมนต์หน้างาน skeleton -->
        <section class="skeleton-card rounded-2xl border border-slate-100 bg-white/80 p-3.5 shadow-sm mb-2">
          <div class="mb-3 flex items-center justify-between">
            <div class="inline-flex items-center gap-2">
              <div class="skeleton h-4 w-4 rounded-full"></div>
              <div class="skeleton h-3.5 w-28 rounded"></div>
            </div>
            <div class="skeleton h-3 w-20 rounded"></div>
          </div>

          <!-- ช่องคอมเมนต์ -->
          <div class="flex gap-3">
            <div class="skeleton h-9 w-9 rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="skeleton h-16 w-full rounded-2xl"></div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <div class="skeleton h-8 w-8 rounded-full"></div>
                  <div class="skeleton h-8 w-8 rounded-full"></div>
                </div>
                <div class="skeleton h-8 w-24 rounded-full"></div>
              </div>
            </div>
          </div>

          <!-- คอมเมนต์ตัวอย่าง -->
          <div class="mt-4 space-y-3">
            <div v-for="i in 2" :key="i" class="flex gap-3">
              <div class="skeleton h-8 w-8 rounded-full"></div>
              <div class="flex-1 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="skeleton h-3 w-24 rounded"></div>
                  <div class="skeleton h-2.5 w-16 rounded"></div>
                </div>
                <div class="skeleton h-3 w-full rounded"></div>
                <div class="skeleton h-3 w-4/5 rounded"></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Web Skeleton -->
      <div v-else class="mt-0 px-6 pb-6">
        <div class="max-w-6xl mx-auto pt-6">
          <!-- Header Skeleton -->
          <div class="mb-6 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="skeleton h-10 w-10 rounded-full"></div>
              <div>
                <div class="flex items-center gap-3">
                  <div class="skeleton h-8 w-32 rounded"></div>
                  <div class="skeleton h-6 w-24 rounded-full"></div>
                </div>
                <div class="skeleton h-4 w-48 rounded mt-2"></div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Task Detail Header Skeleton -->
              <div class="skeleton-card rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                <div class="flex items-start gap-4">
                  <div class="skeleton h-12 w-12 rounded-full"></div>
                  <div class="flex-1 space-y-3">
                    <div class="skeleton h-6 w-3/4 rounded"></div>
                    <div class="skeleton h-4 w-1/2 rounded"></div>
                    <div class="flex gap-3 pt-2">
                      <div class="skeleton h-6 w-24 rounded-full"></div>
                      <div class="skeleton h-6 w-20 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div class="mt-6 grid grid-cols-3 gap-4">
                  <div class="space-y-2">
                    <div class="skeleton h-4 w-16 rounded"></div>
                    <div class="skeleton h-5 w-24 rounded"></div>
                  </div>
                  <div class="space-y-2">
                    <div class="skeleton h-4 w-16 rounded"></div>
                    <div class="skeleton h-5 w-24 rounded"></div>
                  </div>
                  <div class="space-y-2">
                    <div class="skeleton h-4 w-16 rounded"></div>
                    <div class="skeleton h-5 w-24 rounded"></div>
                  </div>
                </div>
              </div>

              <!-- Media Skeleton -->
              <div class="skeleton-card rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                <div class="mb-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="skeleton h-5 w-5 rounded-full"></div>
                    <div class="skeleton h-5 w-32 rounded"></div>
                  </div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-for="i in 4" :key="i" class="skeleton h-32 rounded-xl"></div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-6">
              <!-- Timeline Skeleton -->
              <div class="skeleton-card rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm">
                <div class="mb-6 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="skeleton h-5 w-5 rounded-full"></div>
                    <div class="skeleton h-5 w-32 rounded"></div>
                  </div>
                  <div class="skeleton h-4 w-20 rounded"></div>
                </div>

                <div class="relative pl-4">
                  <div class="pointer-events-none absolute left-[23px] top-2 bottom-2 w-[2px] bg-slate-200"></div>
                  <div v-for="i in 4" :key="i" class="relative flex gap-4 pb-6 last:pb-0">
                    <div
                      class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white">
                      <div class="skeleton h-4 w-4 rounded-full"></div>
                    </div>
                    <div class="flex-1 rounded-xl border border-slate-100 p-4">
                      <div class="skeleton h-4 w-32 rounded mb-2"></div>
                      <div class="skeleton h-3 w-3/4 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="mt-0 px-0">
      <component :is="isMobile ? LayoutTaskDetailMobile : LayoutTaskDetailWeb" :task="detailTask"></component>
    </section>
  </div>
</template>

<script setup lang="ts">
import LayoutTaskDetailMobile from "@/components/mobile/task/detail/index.vue";
import LayoutTaskDetailWeb from "@/components/web/task/detail/index.vue";
import { taskApi } from "@/services/task.api";
import type { TaskDetail } from "@/types/task";
import { useTaskStore } from "@/stores/task.stores";
import { useAuthStore } from "@/stores/auth.stores";

definePageMeta({ layout: "blank" });

const authStore = useAuthStore();
const route = useRoute();
const taskStore = useTaskStore();
const { isMobile } = storeToRefs(authStore);

const { getItem } = storeToRefs(taskStore);
const taskId = computed(() => route.params.id as string);
const detailTask = ref<TaskDetail | null>(null);

const { data, pending, error, refresh } = useAsyncData<TaskDetail | null>(
  () =>
    getItem.value
      ? `task-timeline-${taskId.value}`
      : `task-detail-${taskId.value}`,
  async () => {
    const id = taskId.value;
    if (!id) return null;

    // กรณีมีของใน store → ใช้ของเก่า + ดึง timeline เพิ่ม
    if (getItem.value) {
      const { canRate, rating } = getItem.value
      const isCanRate = !!canRate && rating !== null
      const timeline = await taskApi.getTimeline(id, isCanRate);

      return {
        ...(getItem.value as any),
        ...timeline,
      } as TaskDetail;
    }

    // กรณีไม่มีใน store → ดึง detail เต็มจาก API
    return await taskApi.getDetail(id);
  },
  {
    // default: ถ้ามี detailTask จาก store อยู่แล้วก็ใช้เลย, ถ้าไม่มีก็ null
    default: () => detailTask.value,
    watch: [taskId], // เปลี่ยน id → ยิงใหม่ตามเงื่อนไขเดิม
  }
);

watch(
  data,
  (val) => {
    if (val) {
      detailTask.value = val;
    } else if (!getItem.value) {
      detailTask.value = null;
    }

    // console.log(JSON.stringify(detailTask.value, null, 2));
  },
  { immediate: true }
);

const loading = computed(() => pending.value && !detailTask.value);

</script>

<style scoped>
/* วงกลมหมุนโหลด */
.spinner {
  display: inline-block;
  height: 16px;
  width: 16px;
  border-radius: 999px;
  border-width: 2px;
  border-style: solid;
  border-color: rgb(16 185 129 / 0.2);
  border-top-color: rgb(16 185 129);
  animation: spin 0.6s linear infinite;
}

/* พื้นที่ skeleton เทา ๆ */
.skeleton {
  position: relative;
  overflow: hidden;
  background-color: rgb(226 232 240);
}

.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.7) 50%,
      rgba(255, 255, 255, 0) 100%);
  animation: shimmer 1.4s infinite;
}

.skeleton-card {
  backdrop-filter: blur(8px);
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
