<template>
  <div class="task-comment-chat fixed inset-0 z-50 bg-page flex flex-col">
    <!-- Header with Back Button - Fixed at top -->
    <header class="flex-shrink-0 bg-card border-b border-default px-4 py-4 flex items-center gap-3 shadow-sm">
      <button type="button"
        class="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center transition active:scale-95 text-secondary-600 hover:bg-secondary-200"
        @click="$emit('close')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1 min-w-0">
        <h2 class="text-base font-semibold text-secondary-900 truncate">
          การสนทนา
        </h2>
        <p class="text-xs text-secondary-500 mt-0.5">งาน #{{ task.id }}</p>
      </div>
    </header>

    <!-- Messages Area - Scrollable -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-page">
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
      </div>

      <div v-else-if="comments.length === 0" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div class="text-secondary-500 text-sm">ยังไม่มีข้อความ</div>
        <div class="text-secondary-400 text-xs mt-1">
          เริ่มต้นการสนทนาได้เลย
        </div>
      </div>

      <template v-else>
        <div v-for="comment in comments" :key="comment.id" class="message-item">
          <div :class="[
            'flex gap-3',
            comment.role === 'customer' ? 'flex-row' : 'flex-row-reverse',
          ]">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div :class="[
                'w-9 h-9 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm',
                comment.role === 'customer'
                  ? 'bg-primary-500'
                  : 'bg-secondary-600',
              ]">
                {{ (comment.author || "ล").charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- Content -->
            <div :class="[
              'max-w-[75%] flex flex-col',
              comment.role === 'customer' ? 'items-start' : 'items-end',
            ]">
              <!-- Name & Time -->
              <div :class="[
                'flex items-center gap-2 mb-1.5',
                comment.role === 'customer' ? '' : 'flex-row-reverse',
              ]">
                <span class="text-xs font-medium text-secondary-700">
                  {{
                    comment.role === "customer"
                      ? comment.author || "ลูกค้า"
                      : comment.author
                  }}
                </span>
                <span class="text-[10px] text-secondary-400">{{
                  formatTime(comment.createdAt)
                }}</span>
              </div>

              <!-- Bubble -->
              <div :class="[
                'inline-block rounded-2xl px-4 py-2.5 shadow-sm text-[13px] leading-relaxed break-words',
                comment.role === 'customer'
                  ? 'bg-white border border-secondary-100 text-secondary-800 rounded-tl-none'
                  : 'bg-primary-500 text-white rounded-tr-none',
              ]">
                <p class="whitespace-pre-wrap">{{ comment.message }}</p>
              </div>

              <!-- Media (LINE-style fixed size) -->
              <div v-if="comment.media && comment.media.length > 0" class="mt-2 space-y-2">
                <div v-for="media in comment.media" :key="media.id"
                  class="chat-media-container rounded-xl overflow-hidden shadow-sm border border-secondary-100 bg-white cursor-pointer hover:opacity-90 transition-opacity"
                  @click="previewMedia(media)">
                  <img v-if="media.type === 'image'" :src="media.url" alt="Attached image" class="chat-media-image" />
                  <video v-else :src="media.url" class="chat-media-image" controls />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Input Area - Fixed at bottom -->
    <footer v-if="task.isMine"
      class="flex-shrink-0 bg-card border-t border-default p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <!-- File Previews with Upload Progress -->
      <div v-if="attachedFiles.length > 0 || pendingUploads.length > 0" class="mb-3 flex gap-2 overflow-x-auto pb-1">
        <!-- Pending Uploads with Progress -->
        <div v-for="(pending, index) in pendingUploads" :key="'pending-' + index" class="relative flex-shrink-0">
          <div
            class="w-16 h-16 rounded-xl overflow-hidden bg-secondary-50 border border-secondary-200 shadow-sm relative">
            <img v-if="pending.type.startsWith('image/')" :src="pending.preview" alt="Uploading"
              class="w-full h-full object-cover opacity-50" />
            <div v-else
              class="w-full h-full flex items-center justify-center text-secondary-400 text-[10px] opacity-50">
              Video
            </div>
            <!-- Progress Overlay -->
            <div class="chat-upload-overlay">
              <span class="text-white font-semibold text-xs">{{ uploadProgress }}%</span>
              <div class="chat-upload-progress-bar">
                <div class="chat-upload-progress-fill" :style="{ width: uploadProgress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ready Files -->
        <div v-for="(file, index) in attachedFiles" :key="index" class="relative flex-shrink-0 group">
          <div class="w-16 h-16 rounded-xl overflow-hidden bg-secondary-50 border border-secondary-200 shadow-sm">
            <img v-if="file.type.startsWith('image/')" :src="getFilePreview(file)" alt="Preview"
              class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-secondary-400 text-[10px]">
              Video
            </div>
          </div>
          <button type="button"
            class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error-500 text-white flex items-center justify-center text-[10px] shadow-sm transition transform active:scale-90"
            @click="removeFile(index)">
            ×
          </button>
        </div>
      </div>

      <!-- Input Row -->
      <div class="flex items-end gap-3">
        <!-- Attachment -->
        <button type="button"
          class="flex-shrink-0 w-11 h-11 rounded-full bg-secondary-50 border border-secondary-200 flex items-center justify-center transition active:scale-95 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700"
          @click="triggerFileInput">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <!-- Text Input -->
        <div class="flex-1 relative">
          <textarea v-model="message" placeholder="พิมพ์ข้อความ..." rows="1"
            class="textarea-field w-full min-h-[44px] max-h-[120px] resize-none px-4 py-3 text-sm placeholder:text-secondary-400"
            @keydown.enter.exact.prevent="sendComment" @input="autoResize"></textarea>
        </div>

        <!-- Send -->
        <button type="button" :disabled="!canSend" :class="[
          'flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm',
          canSend
            ? 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-md'
            : 'bg-secondary-100 text-secondary-400 cursor-not-allowed',
        ]" @click="sendComment">
          <svg v-if="!uploading" class="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
          <svg v-else class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </button>
      </div>

      <input ref="fileInput" type="file" accept="image/*,video/*" multiple class="hidden" @change="handleFileSelect" />
    </footer>

    <!-- Fullscreen Media Preview Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="previewingMedia"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          @click.self="closeMediaPreview">
          <!-- Close Button -->
          <button type="button"
            class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center transition hover:bg-white/30 active:scale-95"
            @click="closeMediaPreview">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Media Content -->
          <div class="max-w-[95vw] max-h-[90vh] flex items-center justify-center">
            <img v-if="previewingMedia.type === 'image'" :src="previewingMedia.url" alt="Preview"
              class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
            <video v-else :src="previewingMedia.url"
              class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" controls autoplay />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import type { AxiosProgressEvent } from "axios";
import type { TaskComment, TaskDetail } from "@/types/task";
import { taskApi } from "@/services/task.api";
import { compressImages } from "@/composables/useImageCompression";

const props = defineProps<{
  task: TaskDetail;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "newMessage"): void;
}>();

const comments = ref<TaskComment[]>([]);
const loading = ref(false);
const message = ref("");
const attachedFiles = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadProgress = ref(0);
const pendingUploads = ref<{ type: string; preview: string }[]>([]);
const messagesContainer = ref<HTMLElement | null>(null);
const previewingMedia = ref<{ type: string; url: string } | null>(null);

const canSend = computed(() => {
  return (
    (message.value.trim().length > 0 || attachedFiles.value.length > 0) &&
    !uploading.value
  );
});

const currentStepTypeInfo = computed(() => {
  const currentStepInfo = props.task?.timeline?.find(
    (step) => step.step === props.task?.currentStep
  );

  return {
    typeCode: currentStepInfo?.code ?? "",
    typeSeq: currentStepInfo?.step ?? "",
  };
});

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "เมื่อสักครู่";
  if (minutes < 60) return `${minutes} นาที`;
  if (hours < 24) return `${hours} ชม.`;

  return date.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
};

const loadComments = async () => {
  loading.value = true;
  try {
    comments.value = await taskApi.getComments(props.task.id);
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Failed to load comments:", error);
  } finally {
    loading.value = false;
  }
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTo({
          top: messagesContainer.value.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    // Compress images before adding
    const compressedFiles = await compressImages(files, { maxSizeKB: 1000 });
    attachedFiles.value.push(...compressedFiles);
    target.value = "";
  }
};

const removeFile = (index: number) => {
  attachedFiles.value.splice(index, 1);
};

const getFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

const autoResize = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = "auto";
  textarea.style.height = Math.min(textarea.scrollHeight, 100) + "px";
};

const sendComment = async () => {
  if (!canSend.value) return;

  uploading.value = true;
  uploadProgress.value = 0;

  // Create pending uploads for progress display
  pendingUploads.value = attachedFiles.value.map((file) => ({
    type: file.type,
    preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
  }));

  const filesToSend = [...attachedFiles.value];
  attachedFiles.value = [];

  try {
    const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
      if (!progressEvent.total) return;
      const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      uploadProgress.value = Math.min(percent, 95);
    };

    await taskApi.saveComment(
      {
        jobNo: props.task.id,
        det: message.value,
        typeCode: currentStepTypeInfo.value.typeCode,
        typeSeq: String(currentStepTypeInfo.value.typeSeq),
      },
      filesToSend,
      onUploadProgress
    );

    uploadProgress.value = 100;
    message.value = "";
    pendingUploads.value = [];
    await loadComments();
    emit("newMessage");
  } catch (error) {
    console.error("Failed to send comment:", error);
    // Restore files if failed
    attachedFiles.value = filesToSend;
    pendingUploads.value = [];
    alert("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง");
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
};

const previewMedia = (media: { type: string; url: string }) => {
  previewingMedia.value = media;
};

const closeMediaPreview = () => {
  previewingMedia.value = null;
};

onMounted(() => {
  loadComments();
});
</script>

<style scoped>
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Fade transition for media preview */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
