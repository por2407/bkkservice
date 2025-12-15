<template>
    <!-- list -->
    <section class="mt-3">
        <div class="flex flex-col gap-2.5 pb-1">
            <NuxtLink v-for="task in TaskData" :key="task.id"
                :to="`/${isCustomer ? 'customer' : 'employee'}/task/${task.ticket}`" @click="taskStore.setList(task)"
                class="task-card">
                <!-- center content -->
                <div class="flex flex-col gap-1">
                    <p v-if="task.schoolName" class="text-xs font-semibold text-info-700">
                        {{ task.schoolName }}
                    </p>

                    <div class="flex items-baseline justify-between gap-2">
                        <div class="flex items-baseline gap-1.5">
                            <p class="text-sm font-semibold text-secondary-900">
                                หมายเลข {{ task.ticket }}
                            </p>
                            <span v-if="task.isMine && isCustomer" class="badge-primary">
                                ของฉัน
                            </span>
                        </div>

                        <!-- ขวา: เวลาอัปเดต เหมือนเดิม -->
                        <p class="text-xs text-secondary-400">
                            {{ formatUpdatedAt(task.updatedAt) }}
                        </p>
                    </div>
                    <div v-if="task.room" class="inline-flex items-center gap-1 text-xs text-secondary-600">
                        <MapPin class="h-3.5 w-3.5" />
                        <span>ห้อง {{ task.room }}</span>
                    </div>
                    <div class="mt-0.5 flex flex-wrap gap-x-3 gap-y-1.5">
                        <div class="inline-flex items-center gap-1.5 text-xs text-secondary-600">
                            <CheckCircle2 v-if="task.status === 'done'" class="h-3.5 w-3.5 text-primary-600" />
                            <Clock v-else class="h-3.5 w-3.5 text-warning-600" />

                            <span>{{ statusShort(task.status) }}</span>

                            <span v-if="task.status === 'in_progress' && task.currentStep" class="badge-step">
                                {{ task.currentStep }}/5
                            </span>
                        </div>

                        <!-- attachments -->
                        <div v-if="task.hasImage || task.hasVideo"
                            class="inline-flex items-center gap-1 text-xs text-info-600">
                            <ImageIcon v-if="task.hasImage" class="h-3.5 w-3.5" />
                            <Video v-if="task.hasVideo" class="h-3.5 w-3.5" />
                        </div>

                        <div v-if="(task.commentsCount ?? 0) > 0"
                            class="inline-flex items-center gap-1 text-xs text-purple-600">
                            <MessageCircle class="h-3.5 w-3.5" />
                            <span>{{ task.commentsCount }}</span>
                        </div>

                        <!-- ⭐ rating -->
                        <div v-if="task.canRate"
                            class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]" :class="task.rating
                                ? 'bg-warning-50 text-warning-700'
                                : 'bg-secondary-100 text-secondary-500'
                                ">
                            <Star class="h-3.5 w-3.5" :class="task.rating
                                ? 'fill-warning-400 text-warning-400'
                                : 'text-secondary-400'
                                " />
                            <span v-if="task.rating">{{ task.rating }}/5</span>
                            <span v-else>รอคะแนน</span>
                        </div>
                    </div>

                    <p class="mt-1 text-[13px] leading-snug text-secondary-600">
                        {{ task.description }}
                    </p>

                    <p v-if="task.dueDate" class="mt-1 text-xs font-semibold text-error-500">
                        กำหนดแล้วเสร็จ: {{ formatDueDate(task.dueDate) }}
                    </p>

                    <p v-if="isDealer" class="text-xs font-semibold" :class="getDealerStatusDisplay(task).colorClass">
                        {{ getDealerStatusDisplay(task).text }}
                    </p>
                </div>

                <!-- arrow -->
                <div class="flex items-center justify-center text-secondary-400">
                    <ChevronRight class="h-4 w-4" />
                </div>
            </NuxtLink>

            <div v-if="TaskData.length === 0"
                class="pt-6 pb-4 flex flex-col items-center justify-center text-center text-secondary-400">
                <img src="/logo.png" alt="ไม่มีรายการงาน" class="mb-3 h-16 w-auto opacity-80" />
                <p class="text-[13px]">ไม่พบงานในขณะนี้</p>
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
} from "lucide-vue-next";
import { formatDueDate, formatUpdatedAt } from "@/utils/date";
import type { Task, TaskStatus, TaskBase } from "@/types/task";
import { useTaskStore } from "@/stores/task.stores";

defineProps<{
    TaskData: Task[];
    isCustomer: boolean;
    isDealer: boolean;
}>();

const taskStore = useTaskStore();

const getDealerStatusDisplay = (item: Task) => {
    const textMap: Record<string, string> = {
        in_progress: `วันที่กำหนดแล้วเสร็จ (ในเวลาทำการ): ${item.eduExh48}`,
        done: item.endsv_job ? `Finished ${item.endsv_job}` : "ยังไม่จบงาน",
    };

    const text = textMap[item.status] ?? "สถานะไม่ทราบ";

    const colorClass =
        item.status === "done" && item.endsv_job
            ? "text-success-500"
            : "text-error-500";

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
