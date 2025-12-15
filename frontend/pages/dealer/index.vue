<template>
  <component :is="isMobile ? LayoutTaskMobile : LayoutTaskWeb"></component>
</template>

<script setup lang="ts">
import LayoutTaskMobile from "@/components/mobile/task/index.vue";
import LayoutTaskWeb from "~/components/web/task/index.vue";
import { useAuthStore } from "@/stores/auth.stores"
const authStore = useAuthStore()
const { isMobile } = storeToRefs(authStore)
</script>

<style scoped></style>
