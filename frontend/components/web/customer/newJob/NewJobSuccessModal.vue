<template>
  <div class="relative w-full max-w-md bg-[var(--bg-surface)] rounded-2xl p-8 shadow-xl text-center">
    <div class="mb-4 flex justify-center">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-primary-50)]">
        <CheckCircle2 class="h-8 w-8 text-[var(--color-primary-500)]" />
      </div>
    </div>

    <h2 class="text-xl font-semibold text-[var(--text-primary)] mb-2">
      ส่งงานแจ้งซ่อมสำเร็จ
    </h2>
    <p class="text-sm text-[var(--text-secondary)] mb-6">
      ระบบบันทึกงานแจ้งซ่อมเรียบร้อยแล้ว
    </p>

    <button type="button"
      class="w-full rounded-xl bg-[var(--color-primary-500)] px-4 py-3 text-sm font-semibold text-[var(--text-inverse)] shadow-sm hover:bg-[var(--color-primary-600)] transition"
      @click="emit('close')">
      ตกลง
    </button>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2 } from "lucide-vue-next";

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>





