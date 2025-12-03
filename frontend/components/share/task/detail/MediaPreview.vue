<template>
  <div
    class="relative w-full rounded-t-[30px] bg-white px-4 pt-4 pb-6 shadow-lg"
  >
    <button
      type="button"
      class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white shadow-lg"
      @click="$emit('close')"
    >
      <X class="h-5 w-5" />
    </button>

    <div v-if="previewMedia" class="mt-4 flex items-center justify-center">
      <div
        class="flex w-full max-w-[640px] max-h-[70vh] items-center justify-center overflow-hidden rounded-2xl bg-slate-900/5 px-2 py-2"
      >
        <img
          v-if="previewMedia.type === 'image'"
          :src="previewMedia.url"
          alt="ตัวอย่างรูปหน้างาน"
          class="h-full max-h-[66vh] w-full max-w-full object-contain"
          @error="(e) => (e.target as HTMLImageElement).src = '/images/no_Img.png'"
        />
        <video
          v-else
          :src="previewMedia.url"
          controls
          autoplay
          class="h-full max-h-[66vh] w-full max-w-full object-contain"
        ></video>
      </div>
    </div>

    <div
      v-else
      class="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/80 px-4 text-center"
    >
      <div
        class="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm"
      >
        <AlertOctagon class="h-6 w-6 text-rose-500" />
      </div>

      <p class="text-[13px] font-semibold text-rose-700">
        ไม่มีสื่อสำหรับแสดงตัวอย่าง
      </p>
      <p class="mt-1 max-w-xs text-[11px] leading-relaxed text-rose-600">
        หน้าต่างตัวอย่างนี้ควรเปิดเมื่อเลือกรูปภาพหรือวิดีโอจากงานแล้ว
        แต่ตอนนี้ระบบไม่ได้รับข้อมูลสื่อเข้ามา
      </p>

      <p class="mt-2 max-w-xs text-[10px] text-rose-500/80">
        ถ้าคุณเป็นผู้ใช้งาน: ปิดหน้าต่างนี้แล้วลองเลือกไฟล์อีกครั้ง<br />
        ถ้าคุณเป็นผู้พัฒนา: ตรวจสอบการส่งค่า
        <span class="font-mono">previewMedia</span> มายังคอมโพเนนต์ตัวนี้ 😉
      </p>

      <button
        type="button"
        class="mt-3 inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-[11px] font-medium text-rose-600 shadow-sm"
        @click="$emit('close')"
      >
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

<style scoped></style>
