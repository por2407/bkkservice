<template>
  <!-- top header / hero -->
  <section
    class="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 px-4 pt-4 pb-[18px] text-emerald-50 shadow-sm"
  >
    <h1 class="mt-1 text-[20px] font-bold leading-snug">รายการแจ้งงาน</h1>
    <p class="mb-3 mt-0.5 text-[12px] leading-relaxed text-emerald-50/95">
      ดูสถานะงานที่ลูกค้าแจ้งทั้งหมด แตะเพื่อเปิดรายละเอียด
    </p>

    <slot />

    <p class="mt-2 text-[11px] text-emerald-50/80">
      กำลังแสดง {{ taskCount }} งานตามตัวกรอง
    </p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  taskCount: number;
}>();
</script>

<style scoped></style>
