<template>
  <section class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-sm mb-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <Clock class="w-4 h-4 text-[var(--text-secondary)]" />
          <span class="text-sm text-[var(--text-secondary)]">{{ updatedLabel }}</span>
        </div>
        <h2 class="text-lg font-semibold text-[var(--text-primary)] leading-snug">
          {{ task.description }}
        </h2>
      </div>
    </div>

    <div class="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
      <div class="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <MapPin class="w-4 h-4 text-[var(--color-primary-500)]" />
        <span>ห้อง {{ task.room }}</span>
      </div>

      <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border"
        :class="task.status === 'in_progress'
          ? 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border-[var(--color-warning-200)]'
          : 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border-[var(--color-primary-200)]'">
        <Clock v-if="task.status === 'in_progress'" class="w-4 h-4" />
        <CheckCircle2 v-else class="w-4 h-4" />
        <span>{{ statusLabel(task.status) }}</span>
      </span>
    </div>
  </section>
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





