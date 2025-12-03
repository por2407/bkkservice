<template>
  <div
    v-if="isMobile"
    class="relative w-full mx-auto bg-white shadow-xl flex flex-col overflow-hidden"
  >
    <main
      class="flex-1 min-h-0 overflow-y-auto px-3 pt-3 pb-3 sm:px-4 sm:pt-4"
      style="padding-bottom: calc(84px + env(safe-area-inset-bottom))"
    >
      <slot />
    </main>
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
