<template>
  <section class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-sm mb-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full"
          :class="isSummarySaved
            ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)]'
            : 'bg-[var(--color-secondary-100)] text-[var(--text-secondary)]'">
          <ClipboardList class="h-5 w-5" />
        </div>

        <div>
          <p class="text-sm font-semibold text-[var(--text-primary)]">
            {{ title }}
          </p>

          <p v-if="isFinalStep && isSummarySaved" class="flex items-center gap-1 text-xs text-[var(--color-primary-600)] mt-0.5">
            <CheckCircle2 class="h-3.5 w-3.5" />
            บันทึกแล้ว
          </p>
          <p v-else class="text-xs text-[var(--text-secondary)] mt-0.5">
            {{ description }}
          </p>
        </div>
      </div>

      <button v-if="!isSummarySaved" type="button"
        class="rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition hover:shadow-md"
        :class="isFinalStep
          ? isSummarySaved
            ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-700)]'
            : 'bg-[var(--color-primary-500)] text-[var(--text-inverse)] hover:bg-[var(--color-primary-600)]'
          : 'bg-[var(--color-error-500)] text-[var(--text-inverse)] hover:bg-[var(--color-error-600)]'"
        @click="$emit('click')">
        {{ isFinalStep ? "บันทึกสรุปงาน" : title }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckCircle2, ClipboardList } from "lucide-vue-next";

defineProps<{
  isFinalStep: boolean;
  title: string;
  description: string;
  isSummarySaved: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>





