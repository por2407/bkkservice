<template>
  <!-- list -->
  <section class="mt-3">
    <div class="flex flex-col gap-2.5 pb-1">
      <NuxtLink
        v-for="task in TaskData"
        :key="task.id"
        :to="`/customer/task/${task.id}`"
        class="relative grid grid-cols-[1fr,auto] items-stretch gap-2.5 rounded-[22px] bg-white px-3.5 py-3 text-inherit shadow-[0_14px_34px_rgba(15,23,42,0.08)] no-underline transition-transform transition-shadow active:scale-[0.985] active:shadow-[0_10px_22px_rgba(15,23,42,0.16)]"
      >
        <!-- center content -->
        <div class="flex flex-col gap-1">
          <p
            v-if="task.schoolName"
            class="text-[11px] font-semibold text-sky-700"
          >
            {{ task.schoolName }}
          </p>

          <div class="flex items-baseline justify-between gap-2">
            <div class="flex items-baseline gap-1.5">
              <p class="text-[13px] font-semibold text-gray-900">
                หมายเลข {{ task.ticket }}
              </p>
              <span
                v-if="task.isMine && isCustomer"
                class="rounded-full border border-emerald-100 bg-emerald-50 px-1.5 py-[1px] text-[10px] font-medium text-emerald-700"
              >
                ของฉัน
              </span>
            </div>

            <!-- ขวา: เวลาอัปเดต เหมือนเดิม -->
            <p class="text-[11px] text-gray-400">
              {{ formatUpdatedAt(task.updatedAt) }}
            </p>
          </div>
          <div
            v-if="task.room"
            class="inline-flex items-center gap-1 text-[11px] text-gray-600"
          >
            <MapPin class="h-3.5 w-3.5" />
            <span>ห้อง {{ task.room }}</span>
          </div>
          <div class="mt-0.5 flex flex-wrap gap-x-3 gap-y-1.5">
            <div
              class="inline-flex items-center gap-1.5 text-[11px] text-gray-600"
            >
              <CheckCircle2
                v-if="task.status === 'done'"
                class="h-3.5 w-3.5 text-emerald-600"
              />
              <Clock v-else class="h-3.5 w-3.5 text-amber-600" />

              <span>{{ statusShort(task.status) }}</span>

              <span
                v-if="task.status === 'in_progress'"
                class="inline-flex items-center justify-center h-3.5 px-1.5 rounded-full bg-emerald-500 text-[9px] font-semibold text-white"
              >
                4/5
              </span>
            </div>

            <!-- attachments -->
            <div
              v-if="task.hasImage || task.hasVideo"
              class="inline-flex items-center gap-1 text-[11px] text-sky-600"
            >
              <ImageIcon v-if="task.hasImage" class="h-3.5 w-3.5" />
              <Video v-if="task.hasVideo" class="h-3.5 w-3.5" />
            </div>

            <div
              v-if="(task.commentsCount ?? 0) > 0"
              class="inline-flex items-center gap-1 text-[11px] text-purple-600"
            >
              <MessageCircle class="h-3.5 w-3.5" />
              <span>{{ task.commentsCount }}</span>
            </div>

            <!-- ⭐ rating -->
            <div
              v-if="task.canRate"
              class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px]"
              :class="
                task.rating
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-slate-100 text-slate-500'
              "
            >
              <Star
                class="h-3.5 w-3.5"
                :class="
                  task.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-400'
                "
              />
              <span v-if="task.rating">{{ task.rating }}/5</span>
              <span v-else>รอคะแนน</span>
            </div>
          </div>

          <p class="mt-1 text-[12px] leading-snug text-gray-600">
            {{ task.description }}
          </p>

          <p class="mt-1 text-[11px] font-semibold text-red-500">
            กำหนดแล้วเสร็จ: {{ formatDueDate(task.dueDate) }}
          </p>

          <p
            v-if="isDealer"
            class="text-[11px] font-semibold"
            :class="getDealerStatusDisplay(task).colorClass"
          >
            {{ getDealerStatusDisplay(task).text }}
          </p>
        </div>

        <!-- arrow -->
        <div class="flex items-center justify-center text-gray-400">
          <ChevronRight class="h-4 w-4" />
        </div>
      </NuxtLink>

      <div
        v-if="TaskData.length === 0"
        class="pt-6 pb-4 flex flex-col items-center justify-center text-center text-gray-400"
      >
        <img
          src="/logo.png"
          alt="ไม่มีรายการงาน"
          class="mb-3 h-16 w-auto opacity-80"
        />
        <p class="text-[12px]">ไม่พบงานในขณะนี้</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ChevronRight,
  MapPin,
  Clock,
  CheckCircle2,
  Image as ImageIcon,
  Video,
  MessageCircle,
  Star,
  User,
} from "lucide-vue-next";
import { formatDueDate, formatUpdatedAt } from "@/utils/date";
import type { Task, TaskStatus } from "@/types/task";

const props = defineProps<{
  TaskData: Task[];
  isCustomer: boolean;
  isDealer: boolean;
}>();

const getDealerStatusDisplay = (item: Task) => {
  const textMap: Record<string, string> = {
    in_progress: `วันที่กำหนดแล้วเสร็จ (ในเวลาทำการ): ${item.eduExh48}`,
    done: item.endsv_job ? `Finished ${item.endsv_job}` : "ยังไม่จบงาน",
  };

  const text = textMap[item.status] ?? "สถานะไม่ทราบ";

  const colorClass =
    item.status === "done" && item.endsv_job
      ? "text-green-500"
      : "text-red-500";

  return { text, colorClass };
};

const statusShort = (status: TaskStatus) => {
  switch (status) {
    case "in_progress":
      return "กำลังทำ";
    case "done":
      return "เสร็จแล้ว";
  }
};
</script>
