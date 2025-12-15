<template>
  <!-- top header / hero -->
  <section class="card-hero">
    <h1 class="text-hero-title">รายการแจ้งงาน</h1>
    <p class="mb-3 mt-0.5 text-hero-subtitle">
      ดูสถานะงานที่ลูกค้าแจ้งทั้งหมด แตะเพื่อเปิดรายละเอียด
    </p>

    <slot />

    <p class="mt-2 text-hero-caption">
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
