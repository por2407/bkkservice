<template>
  <dialog :open="modelValue" class="modal" @click.self="onBackdrop">
    <div ref="modalBox" class="modal-box bg-white p-0 max-w-md rounded-2xl">
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
