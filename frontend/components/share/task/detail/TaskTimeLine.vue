<template>
  <!-- ไทม์ไลน์การดำเนินการ -->
  <section class="rounded-2xl bg-white p-3.5 shadow-sm">
    <div class="mb-3 flex items-center justify-between">
      <div
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
      >
        <Clock class="h-4 w-4 text-emerald-600" />
        <span>ไทม์ไลน์การดำเนินการ</span>
      </div>
      <span class="text-xs text-slate-400">
        ขั้นตอนที่ {{ currentStep }} / 5
      </span>
    </div>

    <div class="relative">
      <!-- เส้นตั้ง -->
      <div
        class="pointer-events-none absolute left-[13px] top-3 bottom-3 w-[2px] bg-slate-200"
      ></div>

      <div
        v-for="step in stepsDisplay"
        :key="step.key"
        class="relative flex gap-3 pb-4 last:pb-0"
      >
        <div
          class="relative mt-1 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white"
          :class="bulletClass(step.step)"
        >
          <img
            :src="step.icon"
            :alt="step.label"
            class="h-4 w-4 object-contain"
          />
          <div
            v-if="step.step < currentStep"
            class="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 shadow-sm"
          >
            <Check class="h-2.5 w-2.5 text-white" />
          </div>
        </div>

        <div
          class="flex-1 rounded-2xl px-3 py-2.5 text-left"
          :class="cardClass(step.step)"
        >
          <p
            v-if="step.step === currentStep"
            class="mb-0.5 text-xs font-medium uppercase tracking-[0.18em] text-indigo-500"
          >
            ขั้นตอนปัจจุบัน
          </p>

          <!-- label จาก backend -->
          <p class="text-sm font-semibold text-slate-900">
            {{ step.label }}
          </p>

          <p
            v-if="stepDescription(step.step)"
            class="mt-0.5 text-xs leading-snug text-slate-500 whitespace-pre-line"
          >
            {{ stepDescription(step.step) }}
          </p>

          <!-- เงื่อนไขดูตำแหน่งช่า -->
          <ServiceMap
            v-if="
              step.key === 'on_the_way' &&
              status === 'in_progress' &&
              currentStep > 3
            "
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Clock, Check } from "lucide-vue-next";
import ServiceMap from "./ServiceMap.vue";
import { formatThaiDateTime, formatThaiDate } from "@/utils/date";
import type { StepRuntimeInfo, TaskStatus } from "@/types/task";

const props = defineProps<{
  status: TaskStatus;
  currentStep: number;
  timeline: StepRuntimeInfo[];
}>();

/* ---------------- icon meta (ฟิกแค่ icon/key ต่อ step) ---------------- */

interface StepMeta {
  key: string;
  icon: string;
}

// mapping icon ตามหมายเลข step (1–5)
const STEP_META: Record<number, StepMeta> = {
  1: {
    key: "received",
    icon: "https://img.icons8.com/color/48/inbox.png",
  },
  2: {
    key: "prepare",
    icon: "https://img.icons8.com/color/48/maintenance.png",
  },
  3: {
    key: "on_the_way",
    icon: "https://img.icons8.com/color/48/road.png",
  },
  4: {
    key: "fixing",
    icon: "https://img.icons8.com/color/48/service.png",
  },
  5: {
    key: "done",
    icon: "https://img.icons8.com/color/48/checkmark--v1.png",
  },
};

/**
 * ให้ backend เป็นคนกำหนดหัวข้อ/label ของแต่ละขั้น
 * สมมติ StepRuntimeInfo มี field: step, label (หรือ title)
 * ถ้าไม่มี label จาก backend ก็ fallback เป็น "ขั้นตอนที่ X"
 */
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
      label:
        // เปลี่ยนชื่อ field ให้ตรงกับของจริงได้เลย
        (info as any).label || `ขั้นตอนที่ ${info.step}`,
      icon: meta.icon,
      runtime: info,
    };
  });
});

/* ---------------- class helper ---------------- */

const bulletClass = (stepNumber: number) => {
  if (stepNumber < props.currentStep || props.status === 'done') {
    return "border-emerald-500 bg-emerald-50";
  }
  if (stepNumber === props.currentStep) {
    return "bg-indigo-50 border border-indigo-200 shadow-sm";
  }
  return "border-slate-200 bg-slate-50 opacity-80";
};

const cardClass = (stepNumber: number) => {
  if (stepNumber < props.currentStep || props.status === 'done') {
    return "bg-emerald-50 border border-emerald-100";
  }
  if (stepNumber === props.currentStep) {
    return "bg-indigo-50 border border-indigo-100";
  }
  return "bg-slate-50 border border-slate-100 opacity-90";
};

/* ---------------- map runtime (เวลา/operator) ไปเป็น description ---------------- */

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

  // ถ้ามี note / description จาก backend ก็ใช้ได้
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

<style scoped></style>
