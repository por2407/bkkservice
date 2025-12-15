<template>
  <div class="relative w-full max-w-4xl bg-[var(--bg-surface)] rounded-2xl shadow-xl overflow-hidden">
    <button type="button"
      class="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-[var(--text-inverse)] shadow-lg hover:bg-black/90 transition"
      @click="$emit('close')">
      <X class="h-5 w-5" />
    </button>

    <div v-if="previewMedia" class="p-6">
      <div class="flex w-full max-h-[80vh] items-center justify-center overflow-hidden rounded-xl bg-[var(--color-secondary-50)] p-4">
        <img v-if="previewMedia.type === 'image'" :src="previewMedia.url" alt="ตัวอย่างรูปหน้างาน"
          class="h-full max-h-[75vh] w-full max-w-full object-contain rounded-lg"
          @error="(e) => (e.target as HTMLImageElement).src = '/images/no_Img.png'" />
        <video v-else :src="previewMedia.url" controls autoplay
          class="h-full max-h-[75vh] w-full max-w-full object-contain rounded-lg"></video>
      </div>
    </div>

    <div v-else
      class="p-8 flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-error-200)] bg-[var(--color-error-50)] text-center">
      <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-surface)] shadow-sm">
        <AlertOctagon class="h-6 w-6 text-[var(--color-error-500)]" />
      </div>

      <p class="text-sm font-semibold text-[var(--color-error-700)]">
        ไม่มีสื่อสำหรับแสดงตัวอย่าง
      </p>
      <p class="mt-2 max-w-md text-xs leading-relaxed text-[var(--color-error-600)]">
        หน้าต่างตัวอย่างนี้ควรเปิดเมื่อเลือกรูปภาพหรือวิดีโอจากงานแล้ว
        แต่ตอนนี้ระบบไม่ได้รับข้อมูลสื่อเข้ามา
      </p>

      <button type="button"
        class="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--color-error-200)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium text-[var(--color-error-600)] shadow-sm hover:bg-[var(--color-error-50)] transition"
        @click="$emit('close')">
        <X class="h-3.5 w-3.5" />
        <span>ปิดหน้าต่างนี้</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PreviewMedia } from "@/types/task";
import { X, AlertOctagon } from "lucide-vue-next";

defineProps<{
  previewMedia: PreviewMedia | null;
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>





