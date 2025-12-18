<template>
  <div v-if="task" class="min-h-full bg-[var(--bg-surface)] p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="p-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--color-secondary-50)] hover:text-[var(--text-primary)] transition"
          >
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div>
            <h1
              class="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3"
            >
              งาน #{{ task.id }}
              <span
                class="px-2.5 py-0.5 rounded-full text-sm font-medium border"
                :class="
                  task.status === 'done'
                    ? 'bg-[var(--color-success-50)] text-[var(--color-success-700)] border-[var(--color-success-200)]'
                    : 'bg-[var(--color-warning-50)] text-[var(--color-warning-700)] border-[var(--color-warning-200)]'
                "
              >
                {{ statusShort(task.status) }}
              </span>
            </h1>
            <p class="text-sm text-[var(--text-secondary)] mt-1">
              อัปเดตล่าสุด {{ formatUpdatedAt(task.updatedAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Task Detail Header (Mobile-style card) -->
      <TaskDetailHeader :task="task" />

      <!-- Task Summary Card (for employees) -->
      <TaskSummaryCard
        v-if="
          (task.id || (task.timeline?.length && task.timeline?.length > 0)) &&
          canActOnCurrentStep
        "
        :isFinalStep="!!isFinalStep"
        :title="summaryCardTitle"
        :description="summaryCardDescription"
        :isSummarySaved="isSummarySaved"
        @click="handleSummaryCardClick"
      />

      <!-- Task Satisfaction Card -->
      <TaskSatisfactionCard
        v-if="canRateThisTask || isSummarySaved"
        :isEmployee="isEmployee"
        :isMine="!!task.isMine"
        :has-rated-this-task="hasRatedThisTask"
        :average-rating="averageRating"
        :loading="ratingLoading"
        :isMobile="isMobile"
        @click="openRatingModal"
      />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <!-- Left Column: Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Media -->
          <TaskMedia
            v-if="task.media && task.media.length"
            :media="task.media"
            @preview="handlePreview"
          />

          <!-- Waiting State -->
          <section
            v-if="!task.id"
            class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-sm"
          >
            <div
              class="rounded-xl bg-[var(--color-primary-500)] px-4 py-3 shadow-md flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <img
                  src="https://img.icons8.com/color/48/hourglass-sand-top.png"
                  alt="รอรับเรื่อง"
                  class="w-5 h-5 shrink-0"
                />
                <div class="flex flex-col">
                  <span class="text-xs text-[var(--color-primary-100)]"
                    >สถานะงาน</span
                  >
                  <span class="text-sm font-semibold text-white leading-snug">
                    รอรับเรื่องแจ้งงาน เพื่อดำเนินงาน
                  </span>
                </div>
              </div>

              <span
                class="inline-flex items-center rounded-full bg-[var(--text-inverse)]/15 px-3 py-1 text-xs font-medium text-[var(--text-inverse)]"
              >
                กำลังจะเริ่มงาน
              </span>
            </div>
          </section>

          <!-- Comment Section -->
          <section v-if="task.id" class="h-[600px]">
            <TaskCommentWeb
              v-if="task"
              :task="task"
            />
          </section>
        </div>

        <!-- Right Column: Timeline -->
        <div class="space-y-6">
          <TaskTimeLine
            v-if="task.id"
            :status="task.status"
            :currentStep="task.currentStep ?? 0"
            :timeline="task.timeline ?? []"
          />
        </div>
      </div>
    </div>

    <!-- Media Preview Modal -->
    <ResponsiveModal
      :model-value="previewOpen"
      @update:model-value="previewOpen = false"
    >
      <MediaPreview :previewMedia="previewMedia" @close="previewOpen = false" />
    </ResponsiveModal>

    <!-- Confirm Status Update Modal -->
    <ResponsiveModal
      :model-value="showConfirm"
      @update:model-value="showConfirmClose"
    >
      <ConfirmStatusUpdateModal
        :Loading="Loading"
        :job-no="task.id"
        :room="task.room"
        :status-label="previewSubmit.nextStatusLabel"
        :assignee="previewSubmit.assignee"
        :updated-at="previewSubmit.currentTimeText"
        :isFinalStep="!!isFinalStep"
        @cancel="showConfirmClose"
        @confirm="submitStatusUpdate"
      />
    </ResponsiveModal>

    <!-- Status Modal -->
    <ResponsiveModal
      :model-value="statusModal"
      @update:model-value="handleClose"
    >
      <StatusModal
        :status="statusMessage.status"
        :title="statusMessage.title"
        :description="statusMessage.description"
        :needRefresh="statusMessage.needRefresh"
        @close="handleClose"
      />
    </ResponsiveModal>

    <!-- Summary Dialog Modal -->
    <ResponsiveModal
      :model-value="summaryModalOpen"
      @update:model-value="summaryModalOpen = false"
    >
      <TaskSummaryDialog
        :summaryLoading="summaryLoading"
        :workSummary="workSummary"
        :startTime="startTime"
        :confirmWorkSummaryOpen="confirmWorkSummaryOpen"
        :formatSummaryDateTime="formatSummaryDateTime"
        @close="summaryModalOpen = false"
      />
    </ResponsiveModal>

    <!-- Rating Modal -->
    <TaskRatingFlow
      :open="ratingModalOpen"
      :successOpen="ratingSuccessModalOpen"
      :ratingLoading="ratingLoading"
      :hasRatedThisTask="hasRatedThisTask"
      :canSubmitRating="canSubmitRating"
      :ratingItems="ratingItems"
      :tempRatingScores="tempRatingScores"
      :setTempScore="setTempScore"
      :submitRating="submitRating"
      :closeRatingModal="closeRatingModal"
      :successSummary="ratingSuccessSummary"
      @update:successOpen="ratingSuccessModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import TaskDetailHeader from "@/components/web/task/detail/TaskDetailHeader.vue";
import TaskMedia from "@/components/web/task/detail/TaskMedia.vue";
import TaskTimeLine from "@/components/web/task/detail/TaskTimeLine.vue";
import TaskCommentWeb from "@/components/web/task/TaskCommentWeb.vue";
import TaskSummaryCard from "@/components/web/employee/task/TaskSummaryCard.vue";
import TaskSatisfactionCard from "@/components/web/customer/task/TaskSatisfactionCard.vue";
import MediaPreview from "@/components/web/task/detail/MediaPreview.vue";
import ResponsiveModal from "@/components/share/ResponsiveModal.vue";
import ConfirmStatusUpdateModal from "@/components/web/employee/task/ConfirmStatusUpdateModal.vue";
import TaskSummaryDialog from "@/components/web/employee/task/TaskSummaryDialog.vue";
import StatusModal from "@/components/share/StatusModal.vue";
import TaskRatingFlow from "@/components/web/customer/task/rating/TaskRatingFlow.vue";
import type { TaskDetail } from "@/types/task";
import { useRatingFlow } from "@/composables/task/customer/rating/useRatingFlow";
import { useTaskDetail } from "@/composables/task/detail/useTaskDetail";
import { formatUpdatedAt } from "@/utils/date";

const props = defineProps<{ task: TaskDetail | null }>();
const emit = defineEmits<{
  (e: "updateValue", val: any): void;
}>();

const {
  ratingModalOpen,
  ratingSuccessModalOpen,
  ratingLoading,
  ratingItems,
  tempRatingScores,
  canRateThisTask,
  hasRatedThisTask,
  averageRating,
  canSubmitRating,
  setTempScore,
  openRatingModal,
  closeRatingModal,
  submitRating,
  ratingSuccessSummary,
} = useRatingFlow(props.task);

const {
  // layout / header
  headerRef,
  showStickyHeader,

  // preview media
  previewOpen,
  previewMedia,
  handlePreview,

  // confirm modal & form
  showConfirm,
  previewSubmit,

  // permission
  canActOnCurrentStep,

  // timeline / summary
  isFinalStep,
  isSummarySaved,
  summaryCardTitle,
  summaryCardDescription,
  handleSummaryCardClick,
  submitStatusUpdate,
  taskStatusPatch,

  // navigation
  goBack,

  Loading,
  statusModal,
  statusMessage,

  handleClose,

  summaryModalOpen,
  summaryLoading,
  workSummary,
  formatSummaryDateTime,
  confirmWorkSummaryOpen,

  startTime,
  isEmployee,
  showConfirmClose,
  isMobile,
} = useTaskDetail(toRef(props, "task"));

watch(taskStatusPatch, (val) => {
  emit("updateValue", val);
});

const statusShort = (status: string) => {
  switch (status) {
    case "in_progress":
      return "กำลังดำเนินการ";
    case "done":
      return "ดำเนินการเสร็จแล้ว";
    default:
      return status;
  }
};
</script>
