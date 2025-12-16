<template>
  <div class="task-comment-chat fixed inset-0 z-50 bg-page flex flex-col">
    <!-- Header with Back Button -->
    <div class="bg-card border-b border-default px-4 py-3 flex items-center gap-3 safe-area-top">
      <button
        type="button"
        class="w-9 h-9 rounded-full bg-secondary-100 flex items-center justify-center transition active:scale-95"
        @click="$emit('close')"
      >
        <svg class="w-5 h-5 text-secondary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1 min-w-0">
        <h2 class="text-sm font-semibold text-secondary-900 truncate">การสนทนา</h2>
        <p class="text-[11px] text-secondary-500">งาน #{{ jobNo }}</p>
      </div>
    </div>

    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-3 py-3 space-y-3">
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
      </div>

      <div v-else-if="comments.length === 0" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div class="text-secondary-500 text-sm">ยังไม่มีข้อความ</div>
        <div class="text-secondary-400 text-xs mt-1">เริ่มต้นการสนทนาได้เลย</div>
      </div>

      <template v-else>
        <div v-for="comment in comments" :key="comment.id" class="message-item">
          <div
            :class="[
              'flex gap-2',
              comment.role === 'customer' ? 'flex-row' : 'flex-row-reverse',
            ]"
          >
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs',
                  comment.role === 'customer' ? 'bg-primary-500' : 'bg-secondary-600',
                ]"
              >
                {{ comment.author.charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- Content -->
            <div :class="['max-w-[75%]', comment.role === 'customer' ? '' : 'text-right']">
              <!-- Name & Time -->
              <div :class="['flex items-center gap-1.5 mb-0.5', comment.role === 'customer' ? '' : 'justify-end']">
                <span class="text-[11px] font-medium text-secondary-700">{{ comment.author }}</span>
                <span class="text-[10px] text-secondary-400">{{ formatTime(comment.createdAt) }}</span>
              </div>

              <!-- Bubble -->
              <div
                :class="[
                  'inline-block rounded-2xl px-3 py-2',
                  comment.role === 'customer'
                    ? 'bg-white border border-secondary-200 rounded-tl-sm'
                    : 'bg-primary-500 text-white rounded-tr-sm',
                ]"
              >
                <p class="text-[13px] whitespace-pre-wrap break-words leading-relaxed">
                  {{ comment.message }}
                </p>
              </div>

              <!-- Media -->
              <div v-if="comment.media && comment.media.length > 0" class="mt-1.5 space-y-1.5">
                <div
                  v-for="media in comment.media"
                  :key="media.id"
                  class="rounded-xl overflow-hidden inline-block"
                  @click="previewMedia(media)"
                >
                  <img
                    v-if="media.type === 'image'"
                    :src="media.url"
                    alt="Attached image"
                    class="max-w-[200px] h-auto rounded-xl cursor-pointer"
                  />
                  <video
                    v-else
                    :src="media.url"
                    class="max-w-[200px] h-auto rounded-xl"
                    controls
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Input Area -->
    <div class="bg-card border-t border-default p-3 safe-area-bottom">
      <!-- File Previews -->
      <div v-if="attachedFiles.length > 0" class="mb-2 flex gap-2 overflow-x-auto pb-1">
        <div
          v-for="(file, index) in attachedFiles"
          :key="index"
          class="relative flex-shrink-0"
        >
          <div class="w-14 h-14 rounded-lg overflow-hidden bg-secondary-100 border border-secondary-200">
            <img
              v-if="file.type.startsWith('image/')"
              :src="getFilePreview(file)"
              alt="Preview"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-secondary-400 text-[10px]">
              Video
            </div>
          </div>
          <button
            type="button"
            class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error-500 text-white flex items-center justify-center text-[10px]"
            @click="removeFile(index)"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Input Row -->
      <div class="flex items-end gap-2">
        <!-- Attachment -->
        <button
          type="button"
          class="flex-shrink-0 w-9 h-9 rounded-full bg-secondary-100 flex items-center justify-center transition active:scale-95"
          @click="triggerFileInput"
        >
          <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <!-- Text Input -->
        <div class="flex-1 relative">
          <textarea
            v-model="message"
            placeholder="พิมพ์ข้อความ..."
            rows="1"
            class="w-full min-h-[36px] max-h-[100px] resize-none rounded-full border border-secondary-200 bg-secondary-50 px-4 py-2 text-[13px] outline-none focus:border-primary-400 focus:bg-white"
            @keydown.enter.exact.prevent="sendComment"
            @input="autoResize"
          ></textarea>
        </div>

        <!-- Send -->
        <button
          type="button"
          :disabled="!canSend"
          :class="[
            'flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95',
            canSend
              ? 'bg-primary-500 text-white'
              : 'bg-secondary-100 text-secondary-400',
          ]"
          @click="sendComment"
        >
          <svg v-if="!uploading" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
          <svg v-else class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </button>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept="image/*,video/*"
        multiple
        class="hidden"
        @change="handleFileSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import type { TaskComment } from "@/types/task";
import { taskApi } from "@/services/task.api";

const props = defineProps<{
  taskId: string;
  jobNo: string;
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
const messagesContainer = ref<HTMLElement | null>(null);

const canSend = computed(() => {
  return (message.value.trim().length > 0 || attachedFiles.value.length > 0) && !uploading.value;
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
    comments.value = await taskApi.getComments(props.jobNo);
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
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    attachedFiles.value.push(...Array.from(target.files));
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
  try {
    await taskApi.saveComment(
      { jobNo: props.jobNo, det: message.value },
      attachedFiles.value
    );

    message.value = "";
    attachedFiles.value = [];
    await loadComments();
    emit("newMessage");
  } catch (error) {
    console.error("Failed to send comment:", error);
    alert("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง");
  } finally {
    uploading.value = false;
  }
};

const previewMedia = (media: any) => {
  window.open(media.url, "_blank");
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
</style>
