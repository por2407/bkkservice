<template>
    <!-- Modal ให้คะแนน -->
    <ResponsiveModal
      :model-value="open"
      @update:model-value="emit('update:open', $event)"
    >
      <TaskRatingDialog
        :ratingLoading="ratingLoading"
        :hasRatedThisTask="hasRatedThisTask"
        :canSubmitRating="canSubmitRating"
        :ratingItems="ratingItems"
        :tempRatingScores="tempRatingScores"
        :setTempScore="setTempScore"
        :submitRating="submitRating"
        :closeRatingModal="closeRatingModal"
      />
    </ResponsiveModal>
  
    <!-- Modal success -->
    <ResponsiveModal
      :model-value="successOpen"
      @update:model-value="emit('update:successOpen', $event)"
    >
      <BaseStatusModal
        variant="success"
        title="บันทึกให้คะแนนสำเร็จ"
        message="ระบบได้บันทึกข้อมูลการให้คะแนนสำหรับงานนี้เรียบร้อยแล้ว"
        button-text="ปิด"
        @close="emit('update:successOpen', false)"
      />
    </ResponsiveModal>
  </template>
  
  <script setup lang="ts">
  import TaskRatingDialog from "./TaskRatingDialog.vue";
  import BaseStatusModal from "@/components/share/status/BaseStatusModal.vue";
  import ResponsiveModal from "@/components/share/ResponsiveModal.vue";
  
  interface RatingItem {
    id: string;
    label: string;
  }
  
  const props = defineProps<{
    open: boolean;
    successOpen: boolean;
  
    ratingLoading: boolean;
    hasRatedThisTask: boolean;
    canSubmitRating: boolean;
    ratingItems: RatingItem[];
    tempRatingScores: number[];
  
    setTempScore: (index: number, score: number) => void;
    submitRating: () => Promise<void>;
    closeRatingModal: () => void;
  }>();
  
  const emit = defineEmits<{
    (e: "update:open", v: boolean): void;
    (e: "update:successOpen", v: boolean): void;
  }>();
  </script>
  