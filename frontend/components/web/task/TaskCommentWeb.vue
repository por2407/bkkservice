<template>
  <div class="task-comment-web card-surface rounded-xl overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div class="border-b border-default px-4 py-3 bg-card">
      <h3 class="text-sm font-semibold text-primary">การสื่อสาร</h3>
      <p class="text-hint text-xs mt-0.5">พูดคุยเกี่ยวกับงาน #{{ task.id }}</p>
    </div>

    <!-- Comments Area (Scrollable) -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      <div v-if="loading" class="text-center py-6">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>

      <div v-else-if="comments.length === 0" class="text-center py-8">
        <div class="text-muted text-sm">ยังไม่มีข้อความ</div>
        <div class="text-hint text-xs mt-1">เริ่มต้นการสื่อสารได้เลย</div>
      </div>

      <div v-else v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="flex gap-2.5">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs',
              comment.role === 'customer'
                ? 'bg-primary-500'
                : 'bg-secondary-600',
            ]">
              {{ comment.author.charAt(0).toUpperCase() }}
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <!-- Author, Role & Time -->
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-semibold text-primary">{{
                comment.author
              }}</span>
              <span :class="[
                'text-[10px] px-1.5 py-0.5 rounded-full',
                comment.role === 'customer'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-secondary-100 text-secondary-700',
              ]">
                {{ comment.role === "customer" ? "ลูกค้า" : "พนักงาน" }}
              </span>
              <span class="text-hint text-[10px]">{{
                formatTime(comment.createdAt)
              }}</span>
            </div>

            <!-- Message Box -->
            <div class="bg-secondary-50 border border-subtle rounded-lg px-3 py-2">
              <p class="text-xs text-secondary-700 whitespace-pre-wrap break-words leading-relaxed">
                {{ comment.message }}
              </p>

              <!-- Media Grid (LINE-style fixed size) -->
              <div v-if="comment.media && comment.media.length > 0" class="mt-2 grid gap-2" :class="{
                'grid-cols-1': comment.media.length === 1,
                'grid-cols-2': comment.media.length > 1,
              }">
                <div v-for="media in comment.media" :key="media.id"
                  class="chat-media-container-web rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  @click="previewMedia(media)">
                  <img v-if="media.type === 'image'" :src="media.url" alt="Attached image"
                    class="chat-media-image-web" />
                  <video v-else :src="media.url" class="chat-media-image-web" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area (Fixed Bottom) -->
    <div v-if="task.isMine" class="border-t border-default bg-card px-4 py-3">
      <!-- File Previews with Upload Progress -->
      <div v-if="attachedFiles.length > 0 || pendingUploads.length > 0" class="mb-2 flex flex-wrap gap-2">
        <!-- Pending Uploads with Progress -->
        <div v-for="(pending, index) in pendingUploads" :key="'pending-' + index" class="relative inline-block">
          <div class="w-12 h-12 rounded overflow-hidden bg-input border border-subtle relative">
            <img v-if="pending.type.startsWith('image/')" :src="pending.preview" alt="Uploading"
              class="w-full h-full object-cover opacity-50" />
            <div v-else
              class="w-full h-full flex items-center justify-center text-muted text-[10px] font-medium opacity-50">
              Video
            </div>
            <!-- Progress Overlay -->
            <div class="chat-upload-overlay-web">
              <span class="text-white font-semibold text-[10px]">{{ uploadProgress }}%</span>
            </div>
          </div>
        </div>

        <!-- Ready Files -->
        <div v-for="(file, index) in attachedFiles" :key="index" class="relative inline-block group">
          <div class="w-12 h-12 rounded overflow-hidden bg-input border border-subtle">
            <img v-if="file.type.startsWith('image/')" :src="getFilePreview(file)" alt="Preview"
              class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-muted text-[10px] font-medium">
              Video
            </div>
          </div>
          <button type="button"
            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error-500 hover:bg-error-600 text-white flex items-center justify-center text-[10px] shadow transition-colors"
            @click="removeFile(index)">
            ×
          </button>
        </div>
      </div>

      <!-- Input Row -->
      <div class="flex items-end gap-2">
        <!-- Attachment Button -->
        <button type="button"
          class="flex-shrink-0 w-8 h-8 rounded-lg bg-input hover:bg-input-focus border border-subtle flex items-center justify-center transition-colors"
          @click="triggerFileInput" title="แนบไฟล์">
          <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <!-- Text Area -->
        <div class="flex-1 relative">
          <textarea v-model="message" placeholder="พิมพ์ข้อความ..." rows="2"
            class="textarea-field w-full min-h-[52px] max-h-[120px] resize-none px-3 py-2 text-xs"
            @keydown.ctrl.enter="sendComment"></textarea>
        </div>

        <!-- Send Button -->
        <button type="button" :disabled="!canSend" :class="[
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all',
          canSend
            ? 'bg-primary-500 hover:bg-primary-600 text-white'
            : 'bg-input text-muted cursor-not-allowed',
        ]" @click="sendComment" title="ส่งข้อความ (Ctrl+Enter)">
          <svg v-if="!uploading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </button>
      </div>

      <input ref="fileInput" type="file" accept="image/*,video/*" multiple class="hidden" @change="handleFileSelect" />
    </div>

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
import { useAuthStore } from "@/stores/auth.stores";
import { compressImages } from "@/composables/useImageCompression";

const props = defineProps<{
  task: TaskDetail;
}>();

const authStore = useAuthStore();

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
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "เมื่อสักครู่";
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  if (days < 7) return `${days} วันที่แล้ว`;

  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
