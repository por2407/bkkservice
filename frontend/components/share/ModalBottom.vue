<template>
  <dialog
    :open="modelValue"
    class="modal modal-bottom w-full mx-auto"
    @click.self="onBackdrop"
  >
    <div
      ref="modalBox"
      class="modal-box rounded-t-3xl p-0 bg-white fixed bottom-0"
    >
      <slot />
    </div>
  </dialog>
</template>

<script setup lang="ts">
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

const onBackdrop = () => {
  if (props.closeOnBackdrop) {
    emit("update:modelValue", false);
    emit("close");
  }
};
</script>

<style scoped></style>
