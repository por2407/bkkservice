<template>
  <!-- สื่อหน้างาน: รูป / วิดีโอ -->
  <section class="rounded-2xl bg-white p-3.5 shadow-sm">
    <div class="mb-2 flex items-center justify-between">
      <div
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
      >
        <ImageIcon class="h-4 w-4 text-sky-500" />
        <span>สื่อหน้างาน</span>
      </div>
      <span class="text-xs text-slate-400">
        {{ media.length }} รายการ
      </span>
    </div>

    <div class="flex gap-2 overflow-x-auto pb-1">
      <button
        v-for="(item, index) in media"
        :key="index"
        type="button"
        class="relative h-32 min-w-[140px] overflow-hidden rounded-2xl bg-slate-100 focus:outline-none"
        @click="$emit('preview', item)"
      >
        <!-- รูปภาพ -->
        <img
          v-if="item.type === 'image'"
          :src="item.url"
          :alt="`รูปหน้างาน ${index + 1}`"
          class="h-full w-full cursor-zoom-in object-cover"
          @error="(e) => (e.target as HTMLImageElement).src = '/images/no_Img.png'"
        />

        <!-- วิดีโอ -->
        <video
          v-else
          :src="item.url"
          class="h-full w-full object-cover"
          muted
          playsinline
        ></video>

        <!-- badge ประเภทสื่อ -->
        <span
          class="absolute bottom-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white"
        >
          {{ item.type === "image" ? "รูปภาพ" : "วิดีโอ" }}
        </span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Image as ImageIcon } from "lucide-vue-next";
import type { TaskMedia, PreviewMedia } from "@/types/task";
defineProps<{
  media: TaskMedia[];
}>();

defineEmits<{
  (e: "preview", val: PreviewMedia): void;
}>();
</script>

<style scoped></style>
