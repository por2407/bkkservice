<template>
  <div v-if="task" class="min-h-screen bg-secondary-50 pb-6">
    <div class="flex items-center justify-between px-4 pt-3 pb-2" :class="[
      isMobile ? 'sticky -top-3 z-30' : '',
      showStickyHeader
        ? 'bg-secondary-50/90 backdrop-blur supports-[backdrop-filter]:bg-secondary-50/70 border-b border-secondary-200/70 shadow-sm rounded-b-2xl'
        : '',
    ]">
      <div class="flex items-center gap-3">
        <button type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95 touch-manipulation"
          @click="goBack">
          <ArrowLeft class="h-4 w-4 text-secondary-700" />
        </button>

        <span class="text-base font-semibold text-secondary-900">
          รายละเอียดงาน
        </span>
      </div>

      <!-- ชิปหมายเลขงาน -->
      <span class="px-2.5 py-0.5 text-xs font-medium text-secondary-600">
        {{ task.id }}
      </span>
    </div>
    <!-- main header -->
    <header class="bg-secondary-50/80 backdrop-blur">
      <div ref="headerRef"></div>
      <!-- การ์ดข้อมูลงาน -->
      <TaskDetailHeader :task="task" />
    </header>

    <TaskSummaryCard v-if="
      (task.id || (task.timeline?.length && task.timeline?.length > 0)) &&
      canActOnCurrentStep
    " :isFinalStep="!!isFinalStep" :title="summaryCardTitle" :description="summaryCardDescription"
      :isSummarySaved="isSummarySaved" @click="handleSummaryCardClick" />

    <TaskSatisfactionCard v-if="canRateThisTask || isSummarySaved" :isEmployee="isEmployee"
      :has-rated-this-task="hasRatedThisTask" :average-rating="averageRating" :loading="ratingLoading"
      @click="openRatingModal" />

    <main class="mt-1 space-y-4 px-4">
      <TaskMedia v-if="task.media && task.media.length" :media="task.media" @preview="handlePreview" />

      <section v-if="!task.id" class="px-4 mt-4">
        <div class="rounded-3xl bg-primary-500 px-4 py-3 shadow-md flex items-center justify-between">
          <div class="flex items-center gap-2">
            <img src="https://img.icons8.com/color/48/hourglass-sand-top.png" alt="รอรับเรื่อง"
              class="w-5 h-5 shrink-0" />
            <div class="flex flex-col">
              <span class="text-xs text-primary-100">สถานะงาน</span>
              <span class="text-sm font-semibold text-white leading-snug">
                รอรับเรื่องแจ้งงาน เพื่อดำเนินงาน
              </span>
            </div>
          </div>

          <span class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
            กำลังจะเริ่มงาน
          </span>
        </div>
      </section>

      <TaskTimeLine v-else :status="task.status" :currentStep="task.currentStep ?? 0" :timeline="task.timeline ?? []" />
    </main>
    <ResponsiveModal :model-value="previewOpen" @update:model-value="previewOpen = false">
      <MediaPreview :previewMedia="previewMedia" @close="previewOpen = false" />
    </ResponsiveModal>

    <ResponsiveModal :model-value="showConfirm" @update:model-value="showConfirmClose">
      <ConfirmStatusUpdateModal :Loading="Loading" :job-no="task.id" :room="task.room"
        :status-label="previewSubmit.nextStatusLabel" :assignee="previewSubmit.assignee"
        :updated-at="previewSubmit.currentTimeText" :isFinalStep="!!isFinalStep" @cancel="showConfirmClose"
        @confirm="submitStatusUpdate" />
    </ResponsiveModal>

    <ResponsiveModal :model-value="statusModal" @update:model-value="handleClose">
      <StatusModal :status="statusMessage.status" :title="statusMessage.title" :description="statusMessage.description"
        :needRefresh="statusMessage.needRefresh" @close="handleClose" />
    </ResponsiveModal>

    <ResponsiveModal :model-value="summaryModalOpen" @update:model-value="summaryModalOpen = false">
      <TaskSummaryDialog :summaryLoading="summaryLoading" :workSummary="workSummary" :startTime="startTime"
        :confirmWorkSummaryOpen="confirmWorkSummaryOpen" :formatSummaryDateTime="formatSummaryDateTime"
        @close="summaryModalOpen = false" />
    </ResponsiveModal>


    <TaskRatingFlow :open="ratingModalOpen" :successOpen="ratingSuccessModalOpen" :ratingLoading="ratingLoading"
      :hasRatedThisTask="hasRatedThisTask" :canSubmitRating="canSubmitRating" :ratingItems="ratingItems"
      :tempRatingScores="tempRatingScores" :setTempScore="setTempScore" :submitRating="submitRating"
      :closeRatingModal="closeRatingModal" :successSummary="ratingSuccessSummary"
      @update:successOpen="ratingSuccessModalOpen = false" />

  </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import TaskDetailHeader from "./TaskDetailHeader.vue";
import TaskMedia from "./TaskMedia.vue";
import TaskTimeLine from "./TaskTimeLine.vue";
import TaskSummaryCard from "../../employee/task/TaskSummaryCard.vue";
import TaskSatisfactionCard from "../../customer/task/TaskSatisfactionCard.vue";
import type { TaskDetail, PreviewMedia } from "@/types/task";
import { useRatingFlow } from "@/composables/task/customer/rating/useRatingFlow";
import MediaPreview from "./MediaPreview.vue";
import ResponsiveModal from "../../../share/ResponsiveModal.vue";
import ConfirmStatusUpdateModal from "../../employee/task/ConfirmStatusUpdateModal.vue";
import TaskSummaryDialog from "../../employee/task/TaskSummaryDialog.vue";
import { useTaskDetail } from "@/composables/task/detail/useTaskDetail";
import StatusModal from "../../../share/StatusModal.vue";
import TaskRatingFlow from "../../customer/task/rating/TaskRatingFlow.vue";

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
  isMobile,
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
} = useTaskDetail(toRef(props, "task"));



watch(taskStatusPatch, (val) => {
  emit("updateValue", val);
});

</script>
