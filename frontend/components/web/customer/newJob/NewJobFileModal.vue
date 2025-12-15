<template>
  <div class="relative w-full max-w-2xl bg-[var(--bg-surface)] rounded-2xl p-6 shadow-xl">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-[var(--text-primary)]">ไฟล์ที่เลือก</h2>
      <button type="button"
        class="rounded-xl bg-[var(--color-secondary-100)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--color-secondary-200)] transition"
        @click="emit('close')">
        ปิด
      </button>
    </div>

    <p class="text-sm text-[var(--text-secondary)] mb-4">
      รวม {{ uploads.length }} ไฟล์ · {{ totalSizeLabel }}
    </p>

    <ul class="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
      <li v-for="item in uploads" :key="item.id"
        class="rounded-xl bg-[var(--color-secondary-50)] border border-[var(--border-subtle)] px-4 py-3">
        <div class="flex items-center justify-between gap-3 mb-2">
          <div class="flex items-center gap-2">
            <ImageIcon v-if="item.type === 'image'" class="h-4 w-4 text-[var(--color-primary-500)]" />
            <Video v-else class="h-4 w-4 text-[var(--color-primary-500)]" />
            <span class="text-sm font-medium text-[var(--text-primary)] truncate max-w-xs">
              {{ item.name }}
            </span>
          </div>
          <span class="text-xs text-[var(--text-secondary)] shrink-0">{{ item.sizeKB }} KB</span>
        </div>

        <div class="flex items-center justify-between text-xs">
          <p :class="item.error ? 'text-[var(--color-error-500)]' : 'text-[var(--color-primary-600)]'">
            {{ item.error || "ไฟล์พร้อมสำหรับส่ง" }}
          </p>

          <button v-if="!item.error" type="button"
            class="text-xs text-[var(--color-error-500)] hover:text-[var(--color-error-600)] underline transition"
            @click="emit('remove-file', item.id)">
            ลบไฟล์นี้
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Image as ImageIcon, Video } from "lucide-vue-next";
import type { UploadItem } from "@/composables/task/customer/useNewJob";

defineProps<{
  uploads: UploadItem[];
  totalSizeLabel: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "remove-file", id: number): void;
}>();
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--color-secondary-200);
  border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-secondary-300);
}
</style>





