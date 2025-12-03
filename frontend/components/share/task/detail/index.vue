<template>
  <div v-if="task" class="min-h-screen bg-slate-50 pb-6">
    <div
      class="flex items-center justify-between px-4 pt-3 pb-2"
      :class="[
        isMobile ? 'sticky -top-3 z-30' : '',
        showStickyHeader
          ? 'bg-slate-50/90 backdrop-blur supports-[backdrop-filter]:bg-slate-50/70 border-b border-slate-200/70 shadow-sm rounded-b-2xl'
          : '',
      ]"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95 touch-manipulation"
          @click="goBack"
        >
          <ArrowLeft class="h-4 w-4 text-slate-700" />
        </button>

        <span class="text-[15px] font-semibold text-slate-900">
          รายละเอียดงาน
        </span>
      </div>

      <!-- ชิปหมายเลขงาน -->
      <span class="px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
        {{ task.id }}
      </span>
    </div>
    <!-- main header -->
    <header class="bg-slate-50/80 backdrop-blur">
      <div ref="headerRef"></div>
      <!-- การ์ดข้อมูลงาน -->
      <TaskDetailHeader :task="task" />
    </header>

    <TaskSummaryCard
      v-if="
        (task.id || (task.timeline?.length && task.timeline?.length > 0)) &&
        canActOnCurrentStep
      "
      :isFinalStep="isFinalStep"
      :title="summaryCardTitle"
      :description="summaryCardDescription"
      :isSummarySaved="isSummarySaved"
      @click="handleSummaryCardClick"
    />

    <TaskSatisfactionCard
      :can-rate-this-task="canRateThisTask"
      :has-rated-this-task="hasRatedThisTask"
      :average-rating="averageRating"
      :loading="ratingLoading"
      @click="openRatingModal"
    />

    <main class="mt-1 space-y-4 px-4">
      <TaskMedia
        v-if="task.media && task.media.length"
        :media="task.media"
        @preview="handlePreview"
      />

      <section v-if="!task.id" class="px-4 mt-4">
        <div
          class="rounded-3xl bg-emerald-500 px-4 py-3 shadow-md flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <img
              src="https://img.icons8.com/color/48/hourglass-sand-top.png"
              alt="รอรับเรื่อง"
              class="w-5 h-5 shrink-0"
            />
            <div class="flex flex-col">
              <span class="text-[11px] text-emerald-100">สถานะงาน</span>
              <span class="text-[13px] font-semibold text-white leading-snug">
                รอรับเรื่องแจ้งงาน เพื่อดำเนินงาน
              </span>
            </div>
          </div>

          <span
            class="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white"
          >
            กำลังจะเริ่มงาน
          </span>
        </div>
      </section>

      <TaskTimeLine
        v-else
        :status="task.status"
        :currentStep="task.currentStep ?? 0"
        :timeline="task.timeline ?? []"
      />
    </main>
    <ResponsiveModal
      :model-value="previewOpen"
      @update:model-value="previewOpen = false"
    >
      <MediaPreview :previewMedia="previewMedia" @close="previewOpen = false" />
    </ResponsiveModal>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeft,
  MapPin,
  Clock,
  Image as ImageIcon,
  X,
  Check,
  MessageCircle,
  Send,
  Video,
} from "lucide-vue-next";
import TaskDetailHeader from "./TaskDetailHeader.vue";
import TaskMedia from "./TaskMedia.vue";
import TaskTimeLine from "./TaskTimeLine.vue";
import TaskSummaryCard from "../../../employee/task/TaskSummaryCard.vue";
import TaskSatisfactionCard from "../../../customer/task/TaskSatisfactionCard.vue";
import type { TaskDetail, PreviewMedia } from "@/types/task";
import { useAuthStore } from "@/stores/auth.stores";
import { useStickyHeader } from "@/composables/useStickyHeader";
import { useRatingFlow } from "@/composables/task/customer/rating/useRatingFlow";
import MediaPreview from "./MediaPreview.vue";
import ResponsiveModal from "../../../share/ResponsiveModal.vue";

const props = defineProps<{ task: TaskDetail | null }>();

const {
  ratingModalOpen,
  ratingSuccessModalOpen,
  ratingLoading,

  ratingItems,
  tempRatingScores,

  canRateThisTask,
  currentRatingScores,
  hasRatedThisTask,
  averageRating,
  canSubmitRating,

  setTempScore,
  openRatingModal,
  closeRatingModal,
  submitRating,
} = useRatingFlow(props.task);

const router = useRouter();
const authStore = useAuthStore();
const { isMobile } = storeToRefs(authStore);

const { headerRef, showStickyHeader } = useStickyHeader(isMobile);

const previewOpen = ref(false);
const previewMedia = ref<PreviewMedia | null>(null);

const handlePreview = (media: PreviewMedia) => {
  previewMedia.value = media;
  previewOpen.value = true;
};

const isEmployee = computed(() => authStore.user?.userType === "e");
const canActOnCurrentStep = computed(
  () =>
    isEmployee.value &&
    currentStepTimelineItem.value?.empCode == authStore.user?.userCode
);

const goBack = () => router.back();

const isSummarySaved = computed(() => !!props.task?.isSubmit);

const isFinalStep = computed(() => props.task?.currentStep === 5);

const currentStepTimelineItem = computed(() => {
  if (!props.task) return null;

  return (
    props.task.timeline?.find(
      (item) => item.step === props.task?.currentStep
    ) ?? null
  );
});

const summaryCardTitle = computed(() => {
  return isFinalStep.value ? "บันทึกสรุปงาน" : "อัพเดทสถานะ";
});

const summaryCardDescription = computed(() => {
  return currentStepTimelineItem.value?.label ?? "";
});

const handleSummaryCardClick = () => {
  if (!props.task) return;

  if (isFinalStep.value) {
    console.log("ดูสรุปงานของ", props.task.id);
  } else {
    console.log("อัปเดตสถานะงาน", props.task.id);
  }
};
</script>
