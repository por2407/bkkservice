import { computed, ref, unref, type MaybeRef } from "vue";
import type { TaskDetail } from "@/types/task";

interface RatingItem {
  id: string;
  label: string;
}

export function useRatingFlow(task: MaybeRef<TaskDetail | null>) {
  const taskRef = computed(() => unref(task));

  const ratingItems: RatingItem[] = [
    { id: "overall", label: "ภาพรวม" },
    { id: "speed", label: "ความเร็ว" },
    { id: "quality", label: "ฝีมือ" },
    { id: "clean", label: "ความสะอาด" },
    { id: "polite", label: "มารยาท" },
    { id: "explain", label: "การอธิบาย" },
  ];

  const tempRatingScores = ref<number[]>([0, 0, 0, 0, 0, 0]);

  const ratingModalOpen = ref(false);
  const ratingSuccessModalOpen = ref(false);
  const ratingLoading = ref(false);

  // เก็บคะแนนแยกตาม taskId
  const taskRatings = ref<Record<string, number[]>>({});

  const canRateThisTask = computed(() => {
    const t = taskRef.value;
    return t?.status === "done";
  });

  const currentRatingScores = computed<number[] | null>(() => {
    const t = taskRef.value;
    if (!t) return null;
    return taskRatings.value[t.id] || null;
  });

  const hasRatedThisTask = computed(() => {
    const scores = currentRatingScores.value;
    return !!scores && scores.length === 6;
  });

  const averageRating = computed<string | null>(() => {
    const scores = currentRatingScores.value;
    if (!scores || !scores.length) return null;
    const sum = scores.reduce((a, b) => a + b, 0);
    return (sum / scores.length).toFixed(1);
  });

  const canSubmitRating = computed(() =>
    tempRatingScores.value.every((s) => s > 0)
  );

  const setTempScore = (index: number, score: number) => {
    const arr = [...tempRatingScores.value];
    arr[index] = score;
    tempRatingScores.value = arr;
  };

  const openRatingModal = () => {
    const existing = currentRatingScores.value;
    tempRatingScores.value = existing
      ? [...existing]
      : [0, 0, 0, 0, 0, 0];

    ratingModalOpen.value = true;
  };

  const closeRatingModal = () => {
    if (ratingLoading.value) return;
    ratingModalOpen.value = false;
  };

  const submitRating = async () => {
    const t = taskRef.value;
    if (!t) return;
    if (!canSubmitRating.value || hasRatedThisTask.value || ratingLoading.value)
      return;

    ratingLoading.value = true;

    try {
      // mock API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      taskRatings.value[t.id] = [...tempRatingScores.value];
      ratingModalOpen.value = false;
      ratingSuccessModalOpen.value = true;
    } catch (err) {
      console.error("submitRating error:", err);
    } finally {
      ratingLoading.value = false;
    }
  };

  return {
    ratingItems,
    tempRatingScores,

    ratingModalOpen,
    ratingSuccessModalOpen,
    ratingLoading,

    canRateThisTask,
    currentRatingScores,
    hasRatedThisTask,
    averageRating,
    canSubmitRating,

    setTempScore,
    openRatingModal,
    closeRatingModal,
    submitRating,
  };
}
