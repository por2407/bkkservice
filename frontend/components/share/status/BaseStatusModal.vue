<template>
  <div
    class="w-full rounded-2xl bg-white px-4 py-5 text-center shadow-lg"
  >
    <!-- icon -->
    <div
      class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full"
      :class="variantStyles.iconBg"
    >
      <component
        :is="currentIcon"
        class="h-6 w-6"
        :class="variantStyles.iconColor"
      />
    </div>

    <!-- title -->
    <p class="mb-1 text-[14px] font-semibold text-slate-900">
      {{ title }}
    </p>

    <!-- message -->
    <p class="mb-4 text-[11px] text-slate-500">
      {{ message }}
    </p>

    <!-- button -->
    <button
      type="button"
      class="w-full rounded-full px-3 py-2 text-[12px] font-medium text-white active:scale-95"
      :class="variantStyles.buttonBg"
      @click="emit('close')"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CheckCircle2, AlertCircle } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    variant?: "success" | "error";
    title?: string;
    message?: string;
    buttonText?: string;
  }>(),
  {
    variant: "success",
    title: "ดำเนินการสำเร็จ",
    message: "",
    buttonText: "ปิด",
  }
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

const currentIcon = computed(() =>
  props.variant === "error" ? AlertCircle : CheckCircle2
);

const variantStyles = computed(() => {
  if (props.variant === "error") {
    return {
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      buttonBg: "bg-red-500",
    };
  }

  return {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    buttonBg: "bg-emerald-500",
  };
});
</script>
