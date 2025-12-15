<template>
  <section class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <ImageIcon class="w-5 h-5 text-[var(--color-primary-500)]" />
        <h2 class="text-lg font-semibold text-[var(--text-primary)]">สื่อหน้างาน</h2>
      </div>
      <span class="text-sm text-[var(--text-secondary)]">
        {{ media.length }} รายการ
      </span>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <button v-for="(item, index) in media" :key="index" type="button"
        class="group relative aspect-square overflow-hidden rounded-xl bg-[var(--color-secondary-100)] border border-[var(--border-subtle)] hover:border-[var(--color-primary-300)] transition focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
        @click="$emit('preview', item)">
        <!-- รูปภาพ -->
        <img v-if="item.type === 'image'" :src="item.url" :alt="`รูปหน้างาน ${index + 1}`"
          class="h-full w-full object-cover transition group-hover:scale-105"
          @error="(e) => (e.target as HTMLImageElement).src = '/images/no_Img.png'" />

        <!-- วิดีโอ -->
        <div v-else class="h-full w-full flex items-center justify-center bg-[var(--color-secondary-200)]">
          <Video class="w-8 h-8 text-[var(--text-secondary)]" />
        </div>

        <!-- badge ประเภทสื่อ -->
        <span
          class="absolute bottom-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-[var(--text-inverse)] backdrop-blur-sm">
          {{ item.type === "image" ? "รูปภาพ" : "วิดีโอ" }}
        </span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Image as ImageIcon, Video } from "lucide-vue-next";
import type { TaskMedia, PreviewMedia } from "@/types/task";

defineProps<{
  media: TaskMedia[];
}>();

defineEmits<{
  (e: "preview", val: PreviewMedia): void;
}>();
</script>





