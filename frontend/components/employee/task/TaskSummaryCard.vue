<template>
  <section class="mt-1 mb-2 px-4">
    <div
      class="flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 shadow-sm"
    >
      <div class="flex items-center gap-2">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full"
          :class="
            isSummarySaved
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-slate-100 text-slate-500'
          "
        >
          <ClipboardList class="h-4 w-4" />
        </div>

        <div class="space-y-0.5">
          <p class="text-[12px] font-semibold text-slate-900">
            {{ title }}
          </p>

          <p
            v-if="isFinalStep && isSummarySaved"
            class="inline-flex items-center gap-1 text-[11px] text-emerald-600"
          >
            <CheckCircle2 class="h-3.5 w-3.5" />
            บันทึกแล้ว (ดูอย่างเดียว)
          </p>
          <p v-else class="text-[11px] text-slate-400">
            {{ description }}
          </p>
        </div>
      </div>

      <button
        type="button"
        class="rounded-full px-3 py-1.5 text-[11px] font-medium shadow-sm transition active:scale-95"
        :class="
          isFinalStep ?isSummarySaved
            ? 'bg-emerald-50 text-emerald-700'
            : 'bg-indigo-600 text-white' : 'bg-rose-500 text-white'
        "
        @click="$emit('click')"
      >
        {{
          isFinalStep ? (isSummarySaved ? "ดูสรุปงาน" : "บันทึกสรุปงาน") : title
        }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckCircle2, ClipboardList } from "lucide-vue-next";

defineProps<{
  isFinalStep: boolean;
  title: string;
  description: string;
  isSummarySaved: boolean;
}>();

defineEmits<{
  (e: "click"): void;
}>();
</script>
