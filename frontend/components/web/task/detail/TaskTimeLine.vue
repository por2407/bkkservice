<template>
  <section class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-sm sticky top-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-2">
        <img src="/images/timeline.png" class="w-5 h-5" />
        <h2 class="text-lg font-semibold text-[var(--text-primary)]">ไทม์ไลน์การดำเนินการ</h2>
      </div>
      <span class="text-sm text-[var(--text-secondary)]">
        ขั้นตอนที่ {{ currentStep }} / 5
      </span>
    </div>

    <div class="relative pl-8">
      <!-- เส้นตั้ง -->
      <div class="pointer-events-none absolute left-[47px] top-2 bottom-2 w-[2px] bg-[var(--color-secondary-200)]">
      </div>

      <div v-for="step in stepsDisplay" :key="step.key" class="relative flex gap-4 pb-6 last:pb-0">
        <div
          class="relative mt-1 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-[var(--bg-surface)] z-10"
          :class="bulletClass(step.step)">
          <img :src="step.icon" :alt="step.label" class="h-5 w-5 object-contain" />
          <div v-if="step.step < currentStep || status === 'done'"
            class="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary-500)] shadow-sm">
            <Check class="h-2.5 w-2.5 text-[var(--text-inverse)]" />
          </div>

          <div v-if="step.step === currentStep && status === 'in_progress'"
            class="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-info-500)] shadow-sm">
            <Hourglass class="h-2.5 w-2.5 text-[var(--text-inverse)]" />
          </div>

        </div>

        <div class="flex-1 rounded-xl px-4 py-3 border" :class="cardClass(step.step)">
          <p v-if="step.step === currentStep"
            class="mb-1 text-xs font-medium uppercase tracking-wider text-[var(--color-info-500)]">
            ขั้นตอนปัจจุบัน
          </p>

          <!-- label จาก backend -->
          <p class="text-sm font-semibold text-[var(--text-primary)]">
            {{ step.label }}
          </p>

          <p v-if="stepDescription(step.step)"
            class="mt-1 text-xs leading-relaxed text-[var(--text-secondary)] whitespace-pre-line">
            {{ stepDescription(step.step) }}
          </p>

          <!-- ServiceMap component (reuse from mobile) -->
          <ServiceMap v-if="
            step.key === 'on_the_way' &&
            status === 'in_progress' &&
            currentStep > 3
          " :empCode="empCode"/>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Check, Hourglass } from "lucide-vue-next";
import ServiceMap from "@/components/web/task/detail/ServiceMap.vue";
import { formatThaiDateTime, formatThaiDate } from "@/utils/date";
import type { StepRuntimeInfo, TaskStatus } from "@/types/task";

const props = defineProps<{
  status: TaskStatus;
  currentStep: number;
  timeline: StepRuntimeInfo[];
}>();

/* ---------------- icon meta ---------------- */

interface StepMeta {
  key: string;
  icon: string;
}

const STEP_META: Record<number, StepMeta> = {
  1: {
    key: "received",
    icon: "/images/sv1.png",
  },
  2: {
    key: "prepare",
    icon: "/images/sv2.png",
  },
  3: {
    key: "on_the_way",
    icon: "/images/sv3.png",
  },
  4: {
    key: "fixing",
    icon: "/images/sv4.png",
  },
  5: {
    key: "done",
    icon: "/images/sv5.png",
  },
};

interface TimelineStepView {
  step: number;
  key: string;
  label: string;
  icon: string;
  runtime: StepRuntimeInfo;
}

const stepsDisplay = computed<TimelineStepView[]>(() => {
  return (props.timeline ?? []).map((info) => {
    const meta = STEP_META[info.step] ?? {
      key: `step_${info.step}`,
      icon: "https://img.icons8.com/color/48/info.png",
    };

    return {
      step: info.step,
      key: meta.key,
      label: (info as any).label || `ขั้นตอนที่ ${info.step}`,
      icon: meta.icon,
      runtime: info,
    };
  });
});

const empCode = computed(() => {
  return props.timeline.find((step) => step.step === props.currentStep)?.empCode ?? '';
});

/* ---------------- class helper ---------------- */

const bulletClass = (stepNumber: number) => {
  if (stepNumber < props.currentStep || props.status === "done") {
    return "border-[var(--color-primary-500)] bg-[var(--color-primary-50)]";
  }
  if (stepNumber === props.currentStep) {
    return "bg-[var(--color-info-50)] border-[var(--color-info-200)] shadow-sm";
  }
  return "border-[var(--color-secondary-300)] bg-[var(--color-secondary-50)] opacity-80";
};

const cardClass = (stepNumber: number) => {
  if (stepNumber < props.currentStep || props.status === "done") {
    return "bg-[var(--color-primary-50)] border-[var(--color-primary-200)]";
  }
  if (stepNumber === props.currentStep) {
    return "bg-[var(--color-info-50)] border-[var(--color-info-100)]";
  }
  return "bg-[var(--color-secondary-50)] border-[var(--color-secondary-200)] opacity-90";
};

/* ---------------- map runtime ---------------- */

const stepRuntimeMap = computed(() => {
  const map = new Map<number, StepRuntimeInfo>();
  (props.timeline ?? []).forEach((info) => {
    map.set(info.step, info);
  });
  return map;
});

const stepDescription = (stepNumber: number) => {
  const info = stepRuntimeMap.value.get(stepNumber);
  if (!info) return "";

  if ((info as any).note) {
    return (info as any).note;
  }

  if (info.finishedAt) {
    const opLine = info.operator ? `\nผู้ดำเนินงาน ${info.operator}` : "";
    return `ดำเนินการแล้วเสร็จ ${formatThaiDateTime(info.finishedAt)}${opLine}`;
  }

  if (info.dueAt) {
    return `วันกำหนดแล้วเสร็จ ${formatThaiDate(info.dueAt)}`;
  }

  return "";
};
</script>
