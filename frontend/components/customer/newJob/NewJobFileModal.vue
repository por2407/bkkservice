<template>
  <div class="relative w-full rounded-t-3xl bg-white p-5 pb-5 shadow-lg">
    <div class="flex items-center justify-between">
      <h2 class="text-[13px] font-semibold text-slate-800">ไฟล์ที่เลือก</h2>
      <button
        type="button"
        class="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-500"
        @click="emit('close')"
      >
        ปิด
      </button>
    </div>

    <p class="mt-0.5 text-[11px] text-slate-500">
      รวม {{ uploads.length }} ไฟล์ · {{ totalSizeLabel }}
    </p>

    <ul class="mt-2 max-h-[60vh] space-y-1.5 overflow-y-auto">
      <li
        v-for="item in uploads"
        :key="item.id"
        class="rounded-2xl bg-slate-50 px-3 py-1.5"
      >
        <div class="flex items-center justify-between gap-2 text-[11px]">
          <div class="flex items-center gap-1.5">
            <ImageIcon v-if="item.type === 'image'" class="h-3.5 w-3.5" />
            <Video v-else class="h-3.5 w-3.5" />
            <span class="max-w-[200px] truncate font-medium">
              {{ item.name }}
            </span>
          </div>
          <span class="text-[10px] text-slate-400"> {{ item.sizeKB }} KB </span>
        </div>

        <div class="mt-1 flex items-center justify-between text-[10px]">
          <p :class="item.error ? 'text-red-500' : 'text-emerald-600'">
            {{ item.error || "ไฟล์พร้อมสำหรับส่ง" }}
          </p>

          <button
            v-if="!item.error"
            type="button"
            class="text-[10px] text-red-500 underline"
            @click="emit('remove-file', item.id)"
          >
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
