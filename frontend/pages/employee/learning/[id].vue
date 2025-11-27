<!-- pages/employee/learning/[id].vue -->
<template>
  <div class="min-h-screen bg-slate-50 pb-8">
    <!-- HERO COVER + TITLE -->
    <header class="relative mb-3">
      <!-- cover -->
      <div class="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-200">
        <img
          v-if="post"
          :src="post.coverUrl"
          alt="ปกบทความ"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        <!-- back button -->
        <button
          type="button"
          class="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full
                 bg-black/60 text-white shadow-sm active:scale-95"
          @click="goBack"
        >
          <ArrowLeft class="h-5 w-5" />
        </button>

        <!-- title -->
        <div v-if="post" class="absolute bottom-3 left-4 right-4 space-y-1.5">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
            ศูนย์การเรียนรู้พนักงาน
          </p>
          <h1 class="line-clamp-3 text-[18px] sm:text-xl font-semibold leading-snug text-white drop-shadow">
            {{ post.title }}
          </h1>
        </div>

        <div v-else class="absolute inset-0 flex items-center justify-center">
          <p class="text-sm font-semibold text-white drop-shadow">
            ไม่พบบทความ
          </p>
        </div>
      </div>

      <!-- meta bar -->
      <div v-if="post" class="-mt-4 px-4">
        <div
          class="mx-auto max-w-4xl rounded-2xl border border-slate-100 bg-white/95
                 px-4 py-3 shadow-sm backdrop-blur"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700"
              >
                <User class="h-4 w-4" />
                {{ post.author }}
              </span>
            </div>

            <div class="flex flex-col items-end gap-0.5 text-xs text-slate-400">
              <span class="inline-flex items-center gap-1">
                <Eye class="h-4 w-4" />
                {{ formatViewCount(post.viewCount) }} เข้าชม
              </span>
              <span>เผยแพร่ {{ formatThaiDate(post.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="mt-3 px-4">
      <div class="mx-auto max-w-4xl">
        <!-- ถ้าไม่เจอ post -->
        <section
          v-if="!post"
          class="mt-4 rounded-2xl bg-white p-5 text-center text-sm text-slate-600"
        >
          <p class="mb-1 text-base font-semibold text-slate-900">
            ไม่พบบทความที่คุณเลือก
          </p>
          <p class="mb-4">
            อาจถูกลบออกจากระบบ หรือ URL ไม่ถูกต้อง
          </p>
          <button
            type="button"
            class="min-h-[44px] rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold
                   text-white shadow-sm active:scale-95"
            @click="router.push('/employee/learning')"
          >
            กลับไปหน้ารายการบทความ
          </button>
        </section>

        <!-- ถ้ามี post -->
        <section v-else class="space-y-5">
          <!-- Table of contents -->
          <section class="rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div class="mb-3 inline-flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                <Layers class="h-4 w-4 text-slate-700" />
              </div>
              <p class="text-sm font-semibold text-slate-900">
                หัวข้อในบทความนี้
              </p>
            </div>

            <ol class="space-y-2 text-sm text-slate-800">
              <li
                v-for="(topic, index) in post.subTopics"
                :key="topic.id"
                class="flex items-start gap-2.5"
              >
                <span
                  class="mt-[2px] h-5 w-5 flex-shrink-0 rounded-full bg-indigo-100 text-center
                         text-xs font-semibold text-indigo-700 leading-5"
                >
                  {{ index + 1 }}
                </span>
                <div>
                  <p class="font-medium leading-snug">
                    {{ topic.title }}
                  </p>
                  <p v-if="topic.summary" class="text-xs text-slate-500 mt-0.5">
                    {{ topic.summary }}
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <!-- SUB-TOPICS AS ARTICLE SECTIONS -->
          <section
            v-for="(topic, index) in post.subTopics"
            :key="topic.id"
            class="rounded-2xl bg-white p-4 shadow-sm"
          >
            <!-- section header -->
            <div class="mb-3 flex items-start justify-between gap-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-500">
                  หัวข้อที่ {{ index + 1 }}
                </p>
                <h2 class="text-base font-semibold text-slate-900 leading-snug">
                  {{ topic.title }}
                </h2>
                <p v-if="topic.summary" class="mt-1 text-sm text-slate-600 leading-relaxed">
                  {{ topic.summary }}
                </p>
              </div>
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 shrink-0">
                {{ topic.contents.length }} เนื้อหา
              </span>
            </div>

            <!-- CONTENT BLOCKS: video / pdf เท่านั้น -->
            <div class="mt-1 space-y-3">
              <article
                v-for="content in topic.contents"
                :key="content.id"
                class="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
              >
                <!-- Video -->
                <template v-if="content.type === 'video'">
                  <div class="mb-2 flex items-center justify-between gap-2">
                    <div class="inline-flex items-center gap-2">
                      <PlayCircle class="h-4 w-4 text-rose-500" />
                      <p class="text-sm font-medium text-slate-900">
                        {{ content.label || "วิดีโอประกอบการเรียนรู้" }}
                      </p>
                    </div>
                    <span v-if="content.duration" class="text-xs text-slate-400">
                      {{ content.duration }}
                    </span>
                  </div>

                  <div class="overflow-hidden rounded-lg bg-black/5 aspect-video">
                    <iframe
                      v-if="isYoutubeUrl(content.url)"
                      :src="youtubeEmbedUrl(content.url)"
                      class="h-full w-full"
                      frameborder="0"
                      allowfullscreen
                    ></iframe>
                    <video
                      v-else
                      :src="content.url"
                      controls
                      class="h-full w-full bg-black/90"
                    ></video>
                  </div>

                  <p v-if="content.description" class="mt-2 text-xs text-slate-500 leading-relaxed">
                    {{ content.description }}
                  </p>
                </template>

                <!-- PDF -->
                <template v-else-if="content.type === 'pdf'">
                  <div class="mb-2 flex items-center justify-between gap-2">
                    <div class="inline-flex items-center gap-2">
                      <FileText class="h-4 w-4 text-indigo-600" />
                      <p class="text-sm font-medium text-slate-900 line-clamp-1">
                        {{ content.label || "เอกสารประกอบ (PDF)" }}
                      </p>
                    </div>
                    <span class="text-xs text-slate-400">
                      {{ content.pages ? content.pages + " หน้า" : "" }}
                    </span>
                  </div>

                  <div class="h-56 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                    <iframe :src="content.url" class="h-full w-full"></iframe>
                  </div>

                  <div class="mt-2 flex items-start justify-between gap-2">
                    <p
                      v-if="content.description"
                      class="text-xs text-slate-500 line-clamp-2 leading-relaxed"
                    >
                      {{ content.description }}
                    </p>
                    <a
                      :href="content.url"
                      target="_blank"
                      class="shrink-0 min-h-[36px] inline-flex items-center rounded-full
                             bg-white border border-slate-200 px-3 text-xs font-semibold
                             text-indigo-600 active:scale-95"
                    >
                      เปิดเอกสารเต็ม
                    </a>
                  </div>
                </template>
              </article>
            </div>
          </section>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  ArrowLeft,
  Clock,
  Layers,
  PlayCircle,
  FileText,
  Eye,
  User,
} from "lucide-vue-next";
import { useEmployeeLearning } from "@/composables/useEmployeeLearning";

definePageMeta({ layout: "blank" });

const route = useRoute();
const router = useRouter();
const { findPostById } = useEmployeeLearning();

const post = computed(() => findPostById(route.params.id as string));

/* ---------- Thai date helper ---------- */
const thaiMonthsShort = [
  "ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.",
  "ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.",
];

const formatThaiDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.getDate().toString().padStart(2, "0");
  const month = thaiMonthsShort[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
};

const formatViewCount = (value: number) => value.toLocaleString("th-TH");

/* ---------- helpers ---------- */
const goBack = () => router.back();

const isYoutubeUrl = (url: string) => /youtube\.com|youtu\.be/.test(url);

const youtubeEmbedUrl = (url: string) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    const videoId = u.searchParams.get("v");
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    return url;
  } catch {
    return url;
  }
};
</script>
