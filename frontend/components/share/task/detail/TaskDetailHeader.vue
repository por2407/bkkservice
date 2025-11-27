<template>
  <div class="px-4 pb-3">
    <div class="rounded-2xl bg-white px-3 py-2.5 shadow-sm">
      <!-- แถวบน: อัปเดตล่าสุด -->
      <div
        class="mb-1 flex items-center justify-between text-[11px] text-slate-500"
      >
        <div class="inline-flex items-center gap-1.5">
          <Clock class="h-3.5 w-3.5 text-slate-400" />
          <span>{{ updatedLabel }}</span>
        </div>
      </div>

      <!-- คำอธิบายงาน -->
      <p class="text-[13px] font-semibold text-slate-900 leading-snug">
        {{ task.description }}
      </p>

      <!-- แถวล่าง: ห้อง + สถานะ -->
      <div class="mt-2 flex items-center justify-between">
        <div
          class="inline-flex items-center gap-1.5 text-[12px] text-slate-600"
        >
          <MapPin class="h-3.5 w-3.5 text-sky-500" />
          <span>ห้อง {{ task.room }}</span>
        </div>

        <span
          class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
          :class="
            task.status === 'in_progress'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-emerald-50 text-emerald-700'
          "
        >
          <Clock v-if="task.status === 'in_progress'" class="h-3 w-3" />
          <CheckCircle2 v-else class="h-3 w-3" />
          <span>{{ statusLabel(task.status) }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-vue-next";
import { formatUpdatedAt } from "@/utils/date";
import type { TaskDetail, TaskStatus } from "@/types/task";
const props = defineProps<{
  task: TaskDetail;
}>();

const updatedLabel = computed(() => formatUpdatedAt(props.task.updatedAt));

const statusLabel = (status: TaskStatus) => {
  switch (status) {
    case "in_progress":
      return "กำลังดำเนินการ";
    case "done":
      return "ดำเนินการเสร็จแล้ว";
  }
};
</script>

<style scoped></style>
