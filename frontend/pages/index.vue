<template>
  <div class="min-h-screen bg-[var(--bg-surface)] flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-[var(--text-primary)] mb-4">ยินดีต้อนรับ</h1>
      <p class="text-[var(--text-secondary)] mb-8">BKKService</p>
      <NuxtLink to="/login"
        class="inline-block bg-[var(--color-primary-600)] text-white px-6 py-3 rounded-md hover:bg-[var(--color-primary-700)] transition-colors">
        เข้าสู่ระบบ
      </NuxtLink>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
