<template>
    <component
      :is="isMobile ? ModalBottom : ModalBase"
      :model-value="modelValue"
      @update:modelValue="onUpdateModelValue"
      @close="onClose"
    >
      <slot />
    </component>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from "@/stores/auth.stores";
  import ModalBottom from "@/components/share/ModalBottom.vue";
  import ModalBase from "@/components/share/ModalBase.vue";
  
  const props = withDefaults(
    defineProps<{
      modelValue: boolean;
      closeOnBackdrop?: boolean;
    }>(),
    {
      closeOnBackdrop: true,
    }
  );
  
  const emit = defineEmits<{
    (e: "update:modelValue", val: boolean): void;
    (e: "close"): void;
  }>();
  
  const authStore = useAuthStore();
  const { isMobile } = storeToRefs(authStore);
  
  const onUpdateModelValue = (val: boolean) => {
    emit("update:modelValue", val);
  };
  
  const onClose = () => {
    emit("close");
  };
  </script>
  