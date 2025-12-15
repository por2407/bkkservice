import type { TaskDetail, PreviewMedia } from "@/types/task";
import { routesByRole } from "@/constants/auth";
import { useAuthStore } from "@/stores/auth.stores";
import { taskApi } from "@/services/task.api";

type Status = "success" | "error";

export function useTaskDetail(taskRef: Ref<TaskDetail | null>) {
  // =========================
  // Core / stores / router
  // =========================
  const router = useRouter();
  const authStore = useAuthStore();
  const { isMobile } = storeToRefs(authStore);

  const { headerRef, showStickyHeader } = useStickyHeader(isMobile);

  // =========================
  // Constants / helpers data
  // =========================
  const thaiMonthsShort = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  // =========================
  // UI state (preview / modals)
  // =========================
  const previewOpen = ref(false);
  const previewMedia = ref<PreviewMedia | null>(null);

  const showConfirm = ref(false);
  const statusModal = ref(false);
  const summaryModalOpen = ref(false);

  // =========================
  // Form / payload state
  // =========================
  const form = reactive({
    jobNo: "",
    typeCode: "",
    typeSeq: "",
  });

  const previewSubmit = reactive({
    assignee: "",
    nextStatusLabel: "",
    currentTimeText: "",
  });

  const taskStatusPatch = reactive({
    finishedAt: "",
    operator: "",
    currentStep: 0,
  });

  const statusMessage = reactive({
    status: "success" as Status,
    title: "",
    description: "",
    needRefresh: false,
  });

  const workSummary = ref({
    startTime: "",
    endTime: "",
    process: "",
    pending: "",
  });

  // =========================
  // Loading flags
  // =========================
  const Loading = ref(false);
  const summaryLoading = ref(false);

  // =========================
  // Computed (permission / timeline / summary)
  // =========================
  const isEmployee = computed(() => authStore.user?.userType === "e");

  const currentStepTimelineItem = computed(() => {
    if (!taskRef.value) return null;

    return (
      taskRef.value.timeline?.find(
        (item) => item.step === taskRef.value?.currentStep
      ) ?? null
    );
  });

  const isFinalStep = computed(() => taskRef.value?.currentStep === 5);

  const canActOnCurrentStep = computed(
    () =>
      isEmployee.value &&
      (currentStepTimelineItem.value?.empCode == authStore.user?.userCode ||
        (currentStepTimelineItem.value?.empCode === undefined &&
          taskRef.value!.isSubmit))
  );

  const isSummarySaved = computed(() => !!taskRef.value?.isSubmit);

  const summaryCardTitle = computed(() => {
    return isFinalStep.value ? "บันทึกสรุปงาน" : "อัพเดทสถานะ";
  });

  const summaryCardDescription = computed(() => {
    return currentStepTimelineItem.value?.label ?? "";
  });

  // =========================
  // Handlers: preview / navigation
  // =========================
  const handlePreview = (media: PreviewMedia) => {
    previewMedia.value = media;
    previewOpen.value = true;
  };

  const goBack = () => router.back();

  // =========================
  // Main actions: summary card click -> confirm / summary modal
  // =========================
  const handleSummaryCardClick = () => {
    if (!taskRef.value) return;

    const currentSubmitJob = taskRef.value.timeline?.find(
      (t) => t.step === taskRef.value?.currentStep
    );

    Object.assign(form, {
      jobNo: taskRef.value.id,
      typeCode: currentSubmitJob?.code,
      typeSeq: currentSubmitJob?.step,
    });

    previewSubmit.assignee = authStore.user?.name ?? "";
    previewSubmit.nextStatusLabel = currentSubmitJob?.label ?? "";
    previewSubmit.currentTimeText = new Date().toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (isFinalStep.value) summaryModalOpen.value = true;
    else showConfirm.value = true;
  };

  // =========================
  // Submit status update (non-final step)
  // =========================
  const submitStatusUpdate = async () => {
    if (isFinalStep.value) {
      showConfirm.value = false;
      summaryModalOpen.value = true;
      await new Promise((resolve) => setTimeout(resolve, 200));
      await saveWorkSummary();
      return;
    }

    Loading.value = true;
    try {
      const result = await taskApi.activeTask(form);

      Object.assign(taskStatusPatch, {
        ...(result.data as any),
        currentStep: (taskRef.value?.currentStep ?? 0) + 1,
      });

      Object.assign(statusMessage, {
        status: "success",
        title: "บันทึกสถานะสำเร็จ",
        description: "ระบบบันทึกสถานะของงานเรียบร้อยแล้ว",
        needRefresh: result.needRefresh,
      });
    } catch (e: any) {
      Object.assign(statusMessage, {
        status: "error",
        title: "บันทึกสถานะไม่สำเร็จ",
        description:
          e?.data?.message ??
          "ไม่สามารถบันทึกสถานะของงานได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
      });
    } finally {
      Loading.value = false;
      showConfirm.value = false;
      statusModal.value = true;
    }
  };

  // =========================
  // Status modal close
  // =========================
  function handleClose() {
    statusModal.value = false;

    if (statusMessage.needRefresh) {
      const path = routesByRole[authStore.user?.userType ?? ""] ?? "";
      router.push(path);
    }
  }

  // =========================
  // Summary flow (final step)
  // =========================
  const confirmWorkSummaryOpen = () => {
    summaryModalOpen.value = false;
    showConfirm.value = true;
  };

  const saveWorkSummary = async () => {
    summaryLoading.value = true;
    try {
      const result = await taskApi.activeTaskFinish({
        ...form,
        ...workSummary.value,
      });

      summaryModalOpen.value = false;

      if (taskRef.value) {
        taskRef.value.isSubmit = true;
      }

      Object.assign(taskStatusPatch, {
        ...(result.data as any),
        status: "done",
        currentStep: taskRef.value?.currentStep ?? 0,
      });

      Object.assign(statusMessage, {
        status: "success",
        title: "บันทึกสถานะสำเร็จ",
        description: "ระบบบันทึกสถานะของงานเรียบร้อยแล้ว",
        needRefresh: result.needRefresh,
      });
    } catch (e: any) {
      Object.assign(statusMessage, {
        status: "error",
        title: "บันทึกสถานะไม่สำเร็จ",
        description:
          e?.data?.message ??
          "ไม่สามารถบันทึกสถานะของงานได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
      });
    } finally {
      summaryLoading.value = false;
      statusModal.value = true;
    }
  };

  const showConfirmClose = async () => {
    showConfirm.value = false;

    if (isFinalStep.value) {
      summaryModalOpen.value = true;
    }
  };

  // =========================
  // Formatters
  // =========================
  const formatSummaryDateTime = (value: string) => {
    if (!value) return "";
    // value จาก datetime-local จะเป็น "2025-11-17T09:30"
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const d = date.getDate().toString().padStart(2, "0");
    const m = thaiMonthsShort[date.getMonth()];
    const y = date.getFullYear() + 543;
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    return `${d} ${m} ${y} ${hh}:${mm} น.`;
  };

  // =========================
  // Watchers
  // =========================
  const startTime = ref("");

  watch(summaryModalOpen, async (val) => {
    if (!val) return;

    try {
      if (!taskRef.value?.isSubmit) {
        const result = await taskApi.getTaskDate(taskRef.value?.id ?? "");
        startTime.value = result;
      }
    } catch (e) {
      console.log(e);
    }
  });

  // =========================
  // Expose
  // =========================
  return {
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
  };
}
