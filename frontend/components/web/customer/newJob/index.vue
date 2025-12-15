<template>
    <div class="min-h-full bg-[var(--bg-surface)] p-6">
        <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-[var(--text-primary)]">แจ้งงานซ่อมใหม่</h1>
                <p class="mt-1 text-sm text-[var(--text-secondary)]">กรอกรายละเอียดเพื่อแจ้งปัญหาหรือขอความช่วยเหลือ</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Form Section -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Room Info -->
                    <section
                        class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <MapPin class="w-5 h-5 text-[var(--color-primary-500)]" />
                            ข้อมูลสถานที่
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                    หมายเลขห้อง <span class="text-[var(--color-error-500)]">*</span>
                                </label>
                                <input v-model="form.room" type="text"
                                    class="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
                                    placeholder="เช่น 1205, 803" />
                                <p class="mt-1 text-xs text-[var(--text-secondary)]">ระบุห้องที่พบปัญหา</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                    หมายเลขเครื่อง / Serial
                                </label>
                                <input v-model="form.machineNo" type="text"
                                    class="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition"
                                    placeholder="ถ้ามี (เช่น เลขครุภัณฑ์)" />
                            </div>
                        </div>
                    </section>

                    <!-- Job Details -->
                    <section
                        class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <FileText class="w-5 h-5 text-[var(--color-primary-500)]" />
                            รายละเอียดงาน
                        </h2>

                        <div>
                            <label class="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                                รายละเอียดปัญหา <span class="text-[var(--color-error-500)]">*</span>
                            </label>
                            <textarea v-model="form.description" rows="5"
                                class="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-1 focus:ring-[var(--color-primary-500)] outline-none transition resize-none"
                                placeholder="อธิบายอาการที่พบ ช่วงเวลาที่สะดวกให้เข้าซ่อม..."></textarea>
                        </div>
                    </section>

                    <!-- Uploads -->
                    <section
                        class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-sm">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                <Image class="w-5 h-5 text-[var(--color-primary-500)]" />
                                รูปภาพ / วิดีโอ
                            </h2>
                            <span class="text-xs text-[var(--text-secondary)]">สูงสุด 10MB ต่อไฟล์</span>
                        </div>

                        <div v-if="uploads.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                            <div v-for="(file, index) in uploads" :key="index"
                                class="relative group aspect-square rounded-lg overflow-hidden border border-[var(--border-subtle)]">
                                <img v-if="file.type === 'image'" :src="file.preview"
                                    class="w-full h-full object-cover" />
                                <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <Video class="w-8 h-8 text-gray-400" />
                                </div>
                                <button type="button" @click="removeFile(index)"
                                    class="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition opacity-0 group-hover:opacity-100">
                                    <X class="w-3 h-3" />
                                </button>
                            </div>
                            <label
                                class="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--color-primary-400)] hover:bg-[var(--color-primary-50)] cursor-pointer transition">
                                <Plus class="w-6 h-6 text-[var(--color-primary-500)]" />
                                <span class="mt-1 text-xs text-[var(--text-secondary)]">เพิ่มไฟล์</span>
                                <input type="file" class="hidden" multiple accept="image/*,video/*"
                                    @change="(e) => handleFilesChange(e)" />
                            </label>
                        </div>

                        <label v-else
                            class="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--color-primary-400)] hover:bg-[var(--color-primary-50)] cursor-pointer transition">
                            <UploadCloud class="w-8 h-8 text-[var(--text-secondary)] mb-2" />
                            <span
                                class="text-sm font-medium text-[var(--text-primary)]">คลิกเพื่ออัปโหลดรูปภาพหรือวิดีโอ</span>
                            <span class="text-xs text-[var(--text-secondary)] mt-1">รองรับไฟล์รูปภาพและวิดีโอ</span>
                            <input type="file" class="hidden" multiple accept="image/*,video/*"
                                @change="(e) => handleFilesChange(e)" />
                        </label>

                        <!-- Error Message -->
                        <div v-if="errorCount > 0"
                            class="mt-3 flex items-center gap-2 text-sm text-[var(--color-error-500)] bg-[var(--color-error-50)] p-3 rounded-lg">
                            <AlertCircle class="w-4 h-4" />
                            <span>มี {{ errorCount }} ไฟล์ที่ไม่ผ่านเงื่อนไข (ขนาดเกินหรือนามสกุลไม่ถูกต้อง)</span>
                        </div>
                    </section>
                </div>

                <!-- Sidebar / Actions -->
                <div class="space-y-6">
                    <div
                        class="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 shadow-sm sticky top-24">
                        <h3 class="font-semibold text-[var(--text-primary)] mb-4">สรุปการแจ้งงาน</h3>

                        <div class="space-y-3 text-sm text-[var(--text-secondary)] mb-6">
                            <div class="flex justify-between">
                                <span>ห้อง</span>
                                <span class="font-medium text-[var(--text-primary)]">{{ form.room || '-' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>ไฟล์แนบ</span>
                                <span class="font-medium text-[var(--text-primary)]">{{ uploads.length }} ไฟล์</span>
                            </div>
                        </div>

                        <div v-if="errorMessage"
                            class="mb-4 p-3 rounded-lg bg-[var(--color-error-50)] text-[var(--color-error-600)] text-sm flex items-start gap-2">
                            <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
                            <span>{{ errorMessage }}</span>
                        </div>

                        <button type="button" @click="handleSubmit" :disabled="!canSubmit || saving"
                            class="w-full py-2.5 rounded-xl bg-[var(--color-primary-500)] text-white font-medium hover:bg-[var(--color-primary-600)] active:scale-[0.98] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
                            <span>{{ saving ? 'กำลังบันทึก...' : 'ส่งแจ้งซ่อม' }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- File Modal -->
        <ResponsiveModal :model-value="showFileModal" @update:model-value="closeFileModal">
            <NewJobFileModal :uploads="uploads" :total-size-label="totalSizeLabel" @close="closeFileModal"
                @remove-file="removeFile" />
        </ResponsiveModal>

        <!-- Confirm Modal -->
        <ResponsiveModal :model-value="confirmModalOpen" @update:model-value="confirmModalOpen = false">
            <NewJobConfirmModal :form="form" :uploads="uploads" :image-count="imageCount" :video-count="videoCount"
                :saving="saving" :save-progress="saveProgress" @close="confirmModalOpen = false"
                @confirm="confirmSend" />
        </ResponsiveModal>

        <!-- Success Modal -->
        <ResponsiveModal :model-value="showSuccessModal" @update:model-value="showSuccessModal = false">
            <NewJobSuccessModal @close="showSuccessModal = false" />
        </ResponsiveModal>
    </div>
</template>

<script setup lang="ts">
import {
    MapPin,
    FileText,
    Image,
    UploadCloud,
    X,
    Plus,
    Video,
    AlertCircle,
    Loader2,
    CheckCircle2
} from "lucide-vue-next";
import { useNewJob } from "@/composables/task/customer/useNewJob";
import ResponsiveModal from "@/components/share/ResponsiveModal.vue";
import NewJobFileModal from "@/components/web/customer/newJob/NewJobFileModal.vue";
import NewJobConfirmModal from "@/components/web/customer/newJob/NewJobConfirmModal.vue";
import NewJobSuccessModal from "@/components/web/customer/newJob/NewJobSuccessModal.vue";

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