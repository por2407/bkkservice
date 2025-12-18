<template>
  <div class="task-comment-mobile">
    <!-- Chat Preview Card (Facebook-like) -->
    <div
      class="bg-card rounded-2xl border border-secondary-200 shadow-sm overflow-hidden cursor-pointer active:bg-secondary-50 transition"
      @click="openChat"
    >
      <!-- Header -->
      <div
        class="px-4 py-3 border-b border-secondary-100 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center"
          >
            <svg
              class="w-4 h-4 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <span class="text-sm font-semibold text-secondary-900"
            >การสื่อสาร</span
          >
        </div>
        <div class="flex items-center gap-1.5">
          <span
            v-if="unreadCount > 0"
            class="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-semibold flex items-center justify-center"
          >
            {{ unreadCount > 9 ? "9+" : unreadCount }}
          </span>
          <svg
            class="w-4 h-4 text-secondary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      <!-- Last Message Preview -->
      <div class="px-4 py-3">
        <div v-if="loading" class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-secondary-200 animate-pulse"
          ></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 w-24 bg-secondary-200 rounded animate-pulse"></div>
            <div
              class="h-3 w-full bg-secondary-200 rounded animate-pulse"
            ></div>
          </div>
        </div>

        <div v-else-if="lastComment" class="flex items-center gap-3">
          <!-- Avatar -->
          <div
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0',
              lastComment.role === 'customer'
                ? 'bg-primary-500'
                : 'bg-secondary-600',
            ]"
          >
            {{ (lastComment.author || "ล").charAt(0).toUpperCase() }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <!-- Name -->
            <p class="text-[13px] font-medium text-secondary-900 truncate">
              {{
                lastComment.role === "customer"
                  ? lastComment.author || "ลูกค้า"
                  : lastComment.author
              }}
            </p>
            <!-- Message -->
            <p class="text-[12px] text-secondary-500 truncate mt-0.5">
              <span
                v-if="lastComment.media && lastComment.media.length > 0"
                class="inline-flex items-center gap-1"
              >
                <svg
                  class="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                ส่งรูปภาพ
              </span>
              <span v-else>{{ lastComment.message }}</span>
            </p>
          </div>

          <!-- Time -->
          <span class="text-[11px] text-secondary-400 flex-shrink-0">{{
            formatTime(lastComment.createdAt)
          }}</span>
        </div>

        <div v-else class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-secondary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-xs text-secondary-400">ยังไม่มีข้อความ</p>
            <p class="text-[10px] text-secondary-300 mt-0.5">
              แตะเพื่อเริ่มสนทนา
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="px-4 pb-3 flex gap-2">
        <button
          type="button"
          class="flex-1 py-2 px-3 rounded-full bg-primary-50 text-primary-600 text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
          @click.stop="openChat"
        >
          <svg
            class="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          เปิดแชท
        </button>
      </div>
    </div>

    <!-- Full Chat Modal -->
    <TaskCommentMobileChat
      v-if="chatOpen && task"
      :task="task"
      @close="closeChat"
      @newMessage="loadLastComment"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { TaskComment, TaskDetail } from "@/types/task";
import { taskApi } from "@/services/task.api";
import TaskCommentMobileChat from "./TaskCommentMobileChat.vue";

const props = defineProps<{
  task: TaskDetail;
}>();

const comments = ref<TaskComment[]>([]);
const loading = ref(false);
const chatOpen = ref(false);
const unreadCount = ref(0); // สามารถเพิ่ม logic นับ unread ได้ภายหลัง

const lastComment = computed(() => {
  return comments.value.length > 0
    ? comments.value[comments.value.length - 1]
    : null;
});

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "เมื่อสักครู่";
  if (minutes < 60) return `${minutes} นาที`;
  if (hours < 24) return `${hours} ชม.`;
  if (days < 7) return `${days} วัน`;

  return date.toLocaleDateString("th-TH", { day: "numeric", month: "short" });
};

const loadLastComment = async () => {
  loading.value = true;
  try {
    comments.value = await taskApi.getComments(props.task.id);
  } catch (error) {
    console.error("Failed to load comments:", error);
  } finally {
    loading.value = false;
  }
};

const openChat = () => {
  chatOpen.value = true;
  unreadCount.value = 0;
};

const closeChat = () => {
  chatOpen.value = false;
  loadLastComment(); // Refresh last comment when closing
};

onMounted(() => {
  loadLastComment();
});
</script>
