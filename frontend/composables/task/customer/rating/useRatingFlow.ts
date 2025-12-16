import { computed, ref, unref, type MaybeRef } from "vue";
import type { TaskDetail } from "@/types/task";
import { taskApi } from "@/services/task.api";

interface RatingItem {
  id: string;
  label: string;
}

export function useRatingFlow(task: MaybeRef<TaskDetail | null>) {
  const taskRef = computed(() => unref(task));

  const ratingItems = computed(
    (): RatingItem[] =>
      taskRef.value?.ratingItems ?? [
        { id: "1", label: "เจ้าหน้าที่เดินทางมาให้บริการภายในเวลาที่นัดหมาย" },
        {
          id: "2",
          label: "เจ้าหน้าที่สามารถแก้ไขปัญหาได้ภายในเวลาที่กำหนดความเร็ว",
        },
        {
          id: "3",
          label:
            "เจ้าหน้าที่ให้บริการด้วยถ้อยคำสุภาพ  แต่งกายสุภาพ และมีความเอาใจใส่ในการให้บริการ",
        },
        { id: "4", label: "เจ้าหน้าที่มีทักษะในการปฏิบัติงาน" },
        {
          id: "5",
          label:
            "เจ้าหน้าที่มีความสามารถในการแก้ไขงานได้ครบถ้วนตามที่ได้รับมอบหมาย",
        },
        { id: "6", label: "ท่านมีความพึงพอใจต่อการให้บริการในครั้งนี้" },
      ]
  );

  const tempRatingScores = ref<Record<string, number>>({});
  const averageRating = computed<string | null>(() => {
    const r = taskRef.value?.rating ?? null;
    return r === null ? null : String(r);
  });
  const hasRatedThisTask = computed(
    () => !!taskRef.value?.canRate && averageRating.value !== null
  );

  const ratingModalOpen = ref(false);
  const ratingSuccessModalOpen = ref(false);
  const ratingLoading = ref(false);

  const ratingSuccessSummary = reactive({
    star: 0,
    datest: "-",
    dateed: "-",
    vpoint: 0,
  });

  const canRateThisTask = computed(() => {
    const t = taskRef.value;
    return t?.status === "done";
  });

  const canSubmitRating = computed(() =>
    ratingItems.value.every((it) => (tempRatingScores.value[it.id] ?? 0) > 0)
  );

  const setTempScore = (id: string, score: number) => {
    tempRatingScores.value = { ...tempRatingScores.value, [id]: score };
  };

  const openRatingModal = () => {
    ratingModalOpen.value = true;
  };

  const closeRatingModal = () => {
    if (ratingLoading.value) return;
    ratingModalOpen.value = false;
  };

  const submitRating = async () => {
    const t = taskRef.value;
    if (!t) return;
    if (!canSubmitRating.value || ratingLoading.value) return;

    ratingLoading.value = true;

    try {
      const scoreList = ratingItems.value.map((it) => ({
        id: it.id,
        score: tempRatingScores.value[it.id] ?? 0,
      }));
      const result = await taskApi.rateTask({
        jobNo: taskRef.value.id,
        scoreList,
      });

      // const sum = (
      //   tempRatingScores.value.reduce((a, b) => a + b, 0) /
      //   tempRatingScores.value.length
      // ).toFixed(1);

      const scores = ratingItems.value.map(
        (it) => tempRatingScores.value[it.id] ?? 0
      );
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const sum = Math.round(avg);

      if (taskRef.value) {
        taskRef.value.rating = sum;
        taskRef.value.canRate = true;
      }

      Object.assign(ratingSuccessSummary, {
        star: result.data.star ?? Number(averageRating.value ?? 0),
        datest: result.data.datest ?? "-",
        dateed: result.data.dateed ?? "-",
        vpoint: result.data.vPoint ?? 0,
      });

      ratingModalOpen.value = false;
      ratingSuccessModalOpen.value = true;

      // console.log("score", sum);
      // console.log("scoreList", JSON.stringify(scoreList, null, 2));
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
    hasRatedThisTask,
    averageRating,
    canSubmitRating,

    setTempScore,
    openRatingModal,
    closeRatingModal,
    submitRating,

    ratingSuccessSummary,
  };
}
