<!-- pages/task/[id]/comments.vue -->
<template>
    <div class="flex min-h-screen flex-col bg-slate-50">
      <!-- Header -->
      <header class="sticky top-0 z-10 bg-slate-50/90 backdrop-blur">
        <div class="flex items-center gap-3 px-4 pt-3 pb-2">
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
            @click="goBack"
          >
            <ArrowLeft class="h-4 w-4 text-slate-700" />
          </button>
          <div class="flex flex-col">
            <span class="text-[13px] font-medium text-slate-500">
              งาน {{ task.id }} · ห้อง {{ task.room }}
            </span>
            <span class="inline-flex items-center gap-1 text-[15px] font-semibold text-slate-900">
              <MessageCircle class="h-4 w-4 text-indigo-500" />
              <span>คอมเมนต์หน้างาน</span>
            </span>
          </div>
        </div>
      </header>
  
      <!-- รายการคอมเมนต์ -->
      <main class="flex-1 overflow-y-auto px-4 pt-2 pb-32">
        <p
          v-if="!commentsForTask.length"
          class="mt-4 text-center text-[12px] text-slate-400"
        >
          ยังไม่มีคอมเมนต์สำหรับงานนี้
        </p>
  
        <div v-else class="space-y-3 pb-4">
          <article
            v-for="comment in commentsForTask"
            :key="comment.id"
            class="flex gap-3"
          >
            <div
              class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold"
              :class="
                comment.role === 'operator'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-amber-100 text-amber-700'
              "
            >
              {{ getInitials(comment.author) }}
            </div>
  
            <div
              class="flex-1 rounded-2xl border border-slate-100 bg-white px-3 py-2.5"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5">
                  <p class="text-[12px] font-semibold text-slate-900">
                    {{ comment.author }}
                  </p>
                  <span
                    v-if="comment.role === 'operator'"
                    class="rounded-full bg-indigo-50 px-2 py-[2px] text-[10px] font-medium text-indigo-600"
                  >
                    เจ้าหน้าที่
                  </span>
                  <span
                    v-else
                    class="rounded-full bg-amber-50 px-2 py-[2px] text-[10px] font-medium text-amber-700"
                  >
                    ลูกบ้าน
                  </span>
                </div>
  
                <span class="text-[10px] text-slate-400">
                  {{ formatCommentTime(comment.createdAt) }}
                </span>
              </div>
  
              <p
                v-if="comment.message"
                class="mt-1 text-[12px] leading-snug text-slate-800 whitespace-pre-line"
              >
                {{ comment.message }}
              </p>
  
              <div
                v-if="comment.media && comment.media.length"
                class="mt-2 flex flex-wrap gap-2"
              >
                <button
                  v-for="m in comment.media"
                  :key="m.id"
                  type="button"
                  class="relative h-20 w-24 overflow-hidden rounded-xl bg-slate-100"
                  @click="openPreview(m)"
                >
                  <img
                    v-if="m.type === 'image'"
                    :src="m.url"
                    class="h-full w-full object-cover"
                  />
                  <video
                    v-else
                    :src="m.url"
                    class="h-full w-full object-cover"
                    muted
                    playsinline
                  ></video>
  
                  <span
                    class="absolute bottom-1 right-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white"
                  >
                    {{ m.type === "image" ? "รูปภาพ" : "วิดีโอ" }}
                  </span>
                </button>
              </div>
            </div>
          </article>
        </div>
      </main>
  
      <!-- กล่องพิมพ์คอมเมนต์ (sticky bottom) -->
      <footer
        class="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white px-4 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2"
      >
        <div class="flex gap-3">
          <div
            class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700"
          >
            ช่าง
          </div>
  
          <div class="flex-1">
            <textarea
              v-model="newCommentText"
              rows="2"
              class="max-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="เขียนคอมเมนต์ถึงลูกบ้าน หรือบันทึกหมายเหตุหน้างาน..."
            ></textarea>
  
            <!-- preview media ที่เลือก -->
            <div
              v-if="newCommentMedia.length"
              class="mt-2 flex gap-2 overflow-x-auto"
            >
              <div
                v-for="(m, index) in newCommentMedia"
                :key="index"
                class="relative h-16 w-20 overflow-hidden rounded-xl bg-slate-100"
              >
                <img
                  v-if="m.type === 'image'"
                  :src="m.url"
                  class="h-full w-full object-cover"
                />
                <video
                  v-else
                  :src="m.url"
                  class="h-full w-full object-cover"
                  muted
                  playsinline
                ></video>
  
                <button
                  type="button"
                  class="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white"
                  @click.stop="removeNewCommentMedia(index)"
                >
                  <X class="h-3 w-3" />
                </button>
              </div>
            </div>
  
            <div class="mt-2 flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <label
                  class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                >
                  <ImageIcon class="h-4 w-4" />
                  <input
                    type="file"
                    class="hidden"
                    multiple
                    accept="image/*"
                    @change="handleNewCommentFiles($event, 'image')"
                  />
                </label>
  
                <label
                  class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                >
                  <Video class="h-4 w-4" />
                  <input
                    type="file"
                    class="hidden"
                    multiple
                    accept="video/*"
                    @change="handleNewCommentFiles($event, 'video')"
                  />
                </label>
              </div>
  
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-4 py-1.5 text-[11px] font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:bg-slate-300"
                :disabled="!canSubmitComment"
                @click="submitComment"
              >
                <Send class="h-3.5 w-3.5" />
                <span>ส่ง</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
  
      <!-- full screen preview -->
      <div
        v-if="previewOpen && previewMedia"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/80"
        @click.self="closePreview"
      >
        <button
          type="button"
          class="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg"
          @click="closePreview"
        >
          <X class="h-5 w-5" />
        </button>
  
        <img
          v-if="previewMedia.type === 'image'"
          :src="previewMedia.url"
          class="max-h-[90vh] max-w-[100vw] object-contain"
        />
        <video
          v-else
          :src="previewMedia.url"
          controls
          autoplay
          class="max-h-[90vh] max-w-[100vw]"
        ></video>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import {
    ArrowLeft,
    Image as ImageIcon,
    MessageCircle,
    Send,
    Video,
    X,
  } from "lucide-vue-next";
  
  definePageMeta({
    layout: "blank",
  });
  
  type TaskStatus = "in_progress" | "done";
  type MediaType = "image" | "video";
  
  interface TaskMedia {
    type: MediaType;
    url: string;
  }
  interface CommentMedia extends TaskMedia {
    id: string;
  }
  interface TaskComment {
    id: string;
    taskId: string;
    author: string;
    role: "customer" | "operator";
    createdAt: string;
    message: string;
    media: CommentMedia[];
  }
  interface TaskDetail {
    id: string;
    room: string;
    description: string;
    status: TaskStatus;
    updatedAt: string;
    media: TaskMedia[];
    currentStep: number;
  }
  
  /* mock tasks (เหมือนในหน้า [id].vue) */
  
  const allTasks: TaskDetail[] = [
    {
      id: "TSK-0001",
      room: "1205",
      description: "แอร์ไม่เย็น มีเสียงดังตอนเปิดโหมดเย็น ขอช่างเช็กด่วน",
      status: "in_progress",
      updatedAt: "2025-11-13T09:24:00+07:00",
      currentStep: 4,
      media: [],
    },
    {
      id: "TSK-0002",
      room: "803",
      description: "ไฟในห้องน้ำไม่ติด อาจเป็นที่เบรกเกอร์",
      status: "in_progress",
      updatedAt: "2025-11-13T08:10:00+07:00",
      currentStep: 2,
      media: [],
    },
  ];
  
  /* comments: แชร์กับหน้าอื่นผ่าน useState */
  
  const allComments = useState<TaskComment[]>("task-comments", () => [
    {
      id: "CMT-0001",
      taskId: "TSK-0001",
      author: "ลูกบ้าน 1205",
      role: "customer",
      createdAt: "2025-11-13T09:15:00+07:00",
      message:
        "ตอนนี้แอร์มีเสียงดังต่อเนื่องเลยค่ะ ถ้าเป็นไปได้รบกวนเข้ามาดูภายในช่วงเช้านี้นะคะ",
      media: [
        {
          id: "CMT-0001-M1",
          type: "video",
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
      ],
    },
    {
      id: "CMT-0002",
      taskId: "TSK-0001",
      author: "นาย สรวิชญ์ สมจิตร",
      role: "operator",
      createdAt: "2025-11-13T09:20:00+07:00",
      message:
        "รับทราบครับ ช่างจะขึ้นไปภายใน 10:30 น. ถ้าถึงแล้วจะโทรแจ้งลูกบ้านอีกครั้งครับ",
      media: [],
    },
    {
      id: "CMT-0003",
      taskId: "TSK-0002",
      author: "ลูกบ้าน 803",
      role: "customer",
      createdAt: "2025-11-13T08:05:00+07:00",
      message: "แนบรูปตู้ไฟให้ครับ เหมือนเบรกเกอร์ห้องน้ำจะตกอยู่",
      media: [
        {
          id: "CMT-0003-M1",
          type: "image",
          url: "https://images.pexels.com/photos/4107014/pexels-photo-4107014.jpeg",
        },
      ],
    },
  ]);
  
  const route = useRoute();
  const router = useRouter();
  
  const taskId = computed(() => route.params.id as string);
  
  const task = computed(() => {
    const found = allTasks.find((t) => t.id === taskId.value);
    return found || allTasks[0];
  });
  
  const commentsForTask = computed(() =>
    allComments.value.filter((c) => c.taskId === task.value.id)
  );
  
  /* format เวลาแบบเดียวกับหน้า detail */
  
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
  
  const formatThaiDate = (isoString: string) => {
    const date = new Date(isoString);
    const d = date.getDate().toString().padStart(2, "0");
    const m = thaiMonthsShort[date.getMonth()];
    const y = date.getFullYear() + 543;
    return `${d} ${m} ${y}`;
  };
  
  const formatUpdatedAt = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
  
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const timePart = `${hours}:${minutes}`;
  
    if (diffDays === 0) return `วันนี้ · ${timePart}`;
    if (diffDays === 1) return `เมื่อวาน · ${timePart}`;
    if (diffDays <= 7) return `${diffDays} วันก่อน · ${timePart}`;
  
    const d = date.getDate().toString().padStart(2, "0");
    const m = thaiMonthsShort[date.getMonth()];
    const buddhistYear = date.getFullYear() + 543;
    return `${d} ${m} ${buddhistYear} ${timePart}`;
  };
  
  const formatCommentTime = (isoString: string) => {
    return formatUpdatedAt(isoString);
  };
  
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (!parts.length) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2);
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  
  /* new comment state */
  
  interface NewCommentMedia {
    type: MediaType;
    url: string;
  }
  
  const newCommentText = ref("");
  const newCommentMedia = ref<NewCommentMedia[]>([]);
  
  const handleNewCommentFiles = (event: Event, type: MediaType) => {
    const target = event.target as HTMLInputElement;
    if (!target.files?.length) return;
  
    Array.from(target.files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newCommentMedia.value.push({ type, url });
    });
    target.value = "";
  };
  
  const removeNewCommentMedia = (index: number) => {
    newCommentMedia.value.splice(index, 1);
  };
  
  const canSubmitComment = computed(
    () =>
      newCommentText.value.trim().length > 0 ||
      newCommentMedia.value.length > 0
  );
  
  const submitComment = () => {
    if (!canSubmitComment.value) return;
  
    const nowIso = new Date().toISOString();
    const baseId = Date.now();
  
    const newItem: TaskComment = {
      id: `CMT-${baseId}`,
      taskId: task.value.id,
      author: "ช่างส่วนกลาง",
      role: "operator",
      createdAt: nowIso,
      message: newCommentText.value.trim(),
      media: newCommentMedia.value.map((m, index) => ({
        id: `CMT-${baseId}-M${index + 1}`,
        type: m.type,
        url: m.url,
      })),
    };
  
    allComments.value = [newItem, ...allComments.value];
  
    newCommentText.value = "";
    newCommentMedia.value = [];
  };
  
  const goBack = () => router.back();
  
  /* preview media */
  
  const previewOpen = ref(false);
  const previewMedia = ref<{ type: MediaType; url: string } | null>(null);
  
  const openPreview = (media: TaskMedia | CommentMedia) => {
    previewMedia.value = { type: media.type, url: media.url };
    previewOpen.value = true;
  };
  
  const closePreview = () => {
    previewOpen.value = false;
    previewMedia.value = null;
  };
  </script>
  