<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      class="modal"
      @click.self="onBackdrop"
    >
      <div class="modal-box bg-white p-0 max-w-md rounded-2xl">
        <slot />
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    closeOnBackdrop?: boolean
  }>(),
  {
    closeOnBackdrop: true,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'close'): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

watch(
  () => props.modelValue,
  (val) => {
    const dlg = dialogRef.value
    if (!dlg) return

    if (val && !dlg.open) dlg.showModal()
    else if (!val && dlg.open) dlg.close()
  },
  { immediate: true },
)

const onBackdrop = () => {
  if (props.closeOnBackdrop) {
    emit('update:modelValue', false)
    emit('close')
  }
}
</script>
