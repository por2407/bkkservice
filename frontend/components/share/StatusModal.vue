<template>
  <div class="relative w-full rounded-t-3xl bg-white p-5 pb-5 shadow-lg">
    <div class="flex items-center gap-2">
      <component :is="iconComponent" class="h-5 w-5" :class="iconClass" />
      <h2 class="text-[14px] font-semibold text-slate-800">
        {{ title }}
      </h2>
    </div>

    <p class="mt-1 text-[12px] text-slate-600">
      {{ description }}
    </p>

    <button
      type="button"
      class="mt-3 w-full rounded-2xl px-3 py-2 text-[12px] font-semibold shadow-sm"
      :class="buttonClass"
      @click="emit('close')"
    >
      ตกลง
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CheckCircle2, XCircle } from "lucide-vue-next";

type Status = "success" | "error";

const props = withDefaults(
  defineProps<{
    status?: Status;
    title?: string;
    description?: string;
  }>(),
  {
    status: "success",
    title: "",
    description: "",
  }
);

const emit = defineEmits<{
  (e: "close", needRefresh?: boolean): void;
}>();

const iconComponent = computed(() =>
  props.status === "success" ? CheckCircle2 : XCircle
);

const iconClass = computed(() =>
  props.status === "success" ? "text-emerald-500" : "text-rose-500"
);

const buttonClass = computed(() =>
  props.status === "success"
    ? "bg-emerald-600 text-emerald-50"
    : "bg-rose-600 text-rose-50"
);
</script>
