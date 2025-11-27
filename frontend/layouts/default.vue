<template>
  <component :is="isMobile ? ShellMobile : ShellWeb">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.stores";
import ShellWeb from "~/components/shell/ShellWeb.vue";
import ShellMobile from "~/components/shell/ShellMobile.vue";

const authStore = useAuthStore();
const { isMobile } = storeToRefs(authStore);
</script>

<style scoped></style>
