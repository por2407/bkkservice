<template>
    <div class="min-h-screen bg-page px-4 pt-4 pb-6 text-primary">
        <NewJobHero />

        <section class="mt-3">
            <NewJobForm :form="form" :uploads="uploads" :image-count="imageCount" :video-count="videoCount"
                :total-size-label="totalSizeLabel" :error-message="errorMessage" :error-count="errorCount"
                :can-submit="canSubmit" :saving="saving" @submit="handleSubmit" @open-file-modal="openFileModal"
                @files-change="handleFilesChange" />
        </section>

        <ResponsiveModal :model-value="showFileModal" @update:model-value="closeFileModal">
            <NewJobFileModal :uploads="uploads" :total-size-label="totalSizeLabel" @close="closeFileModal"
                @remove-file="removeFile" />
        </ResponsiveModal>

        <ResponsiveModal :model-value="confirmModalOpen" @update:model-value="confirmModalOpen = false">
            <NewJobConfirmModal :form="form" :uploads="uploads" :image-count="imageCount" :video-count="videoCount"
                :saving="saving" :save-progress="saveProgress" @close="confirmModalOpen = false"
                @confirm="confirmSend" />
        </ResponsiveModal>

        <ResponsiveModal :model-value="showSuccessModal" @update:model-value="showSuccessModal = false">
            <NewJobSuccessModal @close="showSuccessModal = false" />
        </ResponsiveModal>
    </div>
</template>

<script setup lang="ts">
import NewJobHero from "./NewJobHero.vue";
import NewJobForm from "./NewJobForm.vue";
import NewJobFileModal from "./NewJobFileModal.vue";
import NewJobConfirmModal from "./NewJobConfirmModal.vue";
import NewJobSuccessModal from "./NewJobSuccessModal.vue";
import ResponsiveModal from "@/components/share/ResponsiveModal.vue";
import { useNewJob } from "@/composables/task/customer/useNewJob";

const {
    form,
    uploads,
    showFileModal,
    confirmModalOpen,
    showSuccessModal,
    saving,
    saveProgress,
    errorMessage,

    errorCount,
    imageCount,
    videoCount,
    totalSizeLabel,

    canSubmit,

    openFileModal,
    closeFileModal,
    handleFilesChange,
    removeFile,
    handleSubmit,
    confirmSend,
} = useNewJob();
</script>
