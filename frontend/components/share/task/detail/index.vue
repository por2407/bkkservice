<!-- pages/task/[id].vue -->
<template>
  <div v-if="task" class="min-h-screen bg-slate-50 pb-6">
    <!-- Sticky mini header -->
    <TaskStickyHeader
      v-if="showStickyHeader"
      :show="true"
      :task-id="task.id"
      @back="goBack"
    />

    <!-- main header -->
    <header class="bg-slate-50/80 backdrop-blur">
      <!-- แถวบน: ปุ่ม back + ชื่อหน้า + หมายเลขใบงาน -->
      <div class="flex items-center justify-between px-4 pt-3 pb-2">
        <div ref="headerRef" class="flex items-center gap-3">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95 touch-manipulation"
            @click="goBack"
          >
            <ArrowLeft class="h-4 w-4 text-slate-700" />
          </button>

          <span class="text-[15px] font-semibold text-slate-900">
            รายละเอียดงาน
          </span>
        </div>

        <!-- ชิปหมายเลขงาน -->
        <span class="px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
          {{ task.id }}
        </span>
      </div>

      <!-- การ์ดข้อมูลงาน -->
      <TaskDetailHeader :task="task" />
    </header>

    

    
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import TaskStickyHeader from "./TaskStickyHeader.vue";
import TaskDetailHeader from "./TaskDetailHeader.vue";
import type { TaskDetail } from "@/types/task";
import { useAuthStore } from "@/stores/auth.stores";
import { useStickyHeader } from "@/composables/useStickyHeader";

defineProps<{ task: TaskDetail | null }>();

const router = useRouter();
const authStore = useAuthStore();
const { isMobile } = storeToRefs(authStore);

const { headerRef, showStickyHeader } = useStickyHeader(isMobile);

const goBack = () => router.back();
</script>
