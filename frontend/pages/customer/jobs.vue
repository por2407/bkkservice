<template>
  <component :is="isMobile ? LayoutNewJobMobile : LayoutNewJobWeb"></component>
</template>

<script setup lang="ts">
import LayoutNewJobMobile from "~/components/mobile/customer/newJob/index.vue";
import LayoutNewJobWeb from "~/components/web/customer/newJob/index.vue";
import { useAuthStore } from "~/stores/auth.stores"
const authStore = useAuthStore()
const { isMobile } = storeToRefs(authStore)
</script>

<style scoped></style>
