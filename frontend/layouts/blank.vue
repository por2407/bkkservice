<template>
    <div v-if="isMobile" class="relative w-full mx-auto bg-white min-h-screen pb-[84px] shadow-xl">
      <slot />
    </div>
    <ShellWeb v-else>
      <slot />
    </ShellWeb>
  </template>
  
  <script setup lang="ts">
  import ShellWeb from "~/components/shell/ShellWeb.vue";
  import { useAuthStore } from "@/stores/auth.stores";
const authStore = useAuthStore();
const { isMobile } = storeToRefs(authStore);
  </script>
  
  <style scoped></style>
  