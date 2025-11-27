<!-- pages/employee/learning/index.vue -->
<template>
  <div class="min-h-screen bg-slate-50 pb-6">
    <!-- HEADER -->
    <header class="bg-slate-50/80 backdrop-blur">
      <div class="flex items-center justify-between px-4 pt-3 pb-2">
        <div class="flex items-center gap-3">
          <div>
            <p class="text-base font-semibold text-slate-900">
              ศูนย์การเรียนรู้พนักงาน
            </p>
            <p class="text-xs text-slate-500 leading-snug">
              บทความ / วิดีโอ / เอกสารอบรม สำหรับทีมช่างและพนักงาน
            </p>
          </div>
        </div>
      </div>

      <!-- SEARCH -->
      <div class="px-4 pb-3">
        <div class="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
          <Search class="h-5 w-5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            class="w-full border-none bg-transparent text-[14px] text-slate-900
                   placeholder:text-slate-400 focus:outline-none"
            placeholder="ค้นหาบทความ / หัวข้อ เช่น แอร์, ความปลอดภัย, ไฟฟ้า..."
          />
          <button
            v-if="searchQuery"
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400"
            @click="searchQuery = ''"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- MAIN -->
    <main class="mt-1 space-y-4 px-4">
      <!-- LIST BLOG -->
      <section class="rounded-2xl bg-white p-3.5 shadow-sm">
        <div class="mb-3 flex items-center justify-between">
          <div class="inline-flex items-center gap-2">
            <BookOpen class="h-5 w-5 text-indigo-500" />
            <p class="text-sm font-semibold text-slate-900">
              บทความ / สื่อการเรียนรู้
            </p>
          </div>
          <p class="text-xs text-slate-400">
            {{ filteredPosts.length }} รายการ
            <span v-if="filteredPosts.length" class="ml-1 text-slate-300">·</span>
            <span v-if="filteredPosts.length" class="text-slate-500">
              แสดง {{ visiblePosts.length }}
            </span>
          </p>
        </div>

        <!-- grid: มือถือ 1 คอลัมน์, จอใหญ่ค่อย 2/3 -->
        <TransitionGroup
          v-if="visiblePosts.length"
          name="blog-list"
          tag="div"
          class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
        >
          <button
            v-for="post in visiblePosts"
            :key="post.id"
            type="button"
            class="w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 text-left
                   shadow-sm active:scale-[0.99] active:bg-slate-100/70"
            @click="openPost(post)"
          >
            <!-- Cover -->
            <div class="relative h-36 w-full overflow-hidden">
              <img
                :src="post.coverUrl"
                alt="ปกบทความ"
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <div
                class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
              ></div>

              <!-- chips บนรูป -->
              <div
                class="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2"
              >
                <div class="space-y-1">
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span
                      class="rounded-full bg-black/50 px-2.5 py-[3px] text-[11px] text-slate-100"
                    >
                      {{ formatThaiDate(post.createdAt) }}
                    </span>
                  </div>
                </div>

                <div
                  class="flex flex-col items-end text-[11px] text-slate-100 drop-shadow"
                >
                  <span class="inline-flex items-center gap-1">
                    <Layers class="h-3.5 w-3.5" />
                    {{ post.subTopics.length }} หัวข้อ
                  </span>
                </div>
              </div>
            </div>

            <!-- Excerpt -->
            <div class="space-y-2 px-3 pb-3 pt-2.5">
              <p class="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2">
                {{ post.description }}
              </p>

              <div class="flex items-center justify-between gap-2">
                <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span class="inline-flex items-center gap-1">
                    <User class="h-4 w-4" />
                    {{ post.author }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <Eye class="h-4 w-4" />
                    {{ formatViewCount(post.viewCount) }} เข้าชม
                  </span>
                </div>

                <span class="text-xs font-semibold text-indigo-600">
                  อ่านต่อ →
                </span>
              </div>
            </div>
          </button>
        </TransitionGroup>

        <p v-else class="mt-4 text-center text-sm text-slate-400">
          ไม่พบบทความตามเงื่อนไขที่เลือก
        </p>

        <!-- LOAD MORE -->
        <div
          v-if="visiblePosts.length && canLoadMore"
          class="mt-4 flex justify-center"
        >
          <button
            type="button"
            class="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-indigo-600
                   px-5 py-2 text-sm font-semibold text-white shadow-sm active:scale-95"
            @click="loadMore"
          >
            โหลดบทความเพิ่ม
          </button>
        </div>
        <p
          v-else-if="visiblePosts.length && !canLoadMore"
          class="mt-4 text-center text-xs text-slate-400"
        >
          แสดงบทความครบแล้ว
        </p>
      </section>

      <!-- HINT -->
      <section
        class="rounded-2xl bg-slate-100/80 border border-dashed border-slate-200
               p-4 text-center text-sm text-slate-600 leading-relaxed"
      >
        <p class="mb-1 font-semibold text-slate-800">
          แตะที่การ์ดบทความเพื่อเปิดอ่านเนื้อหาแบบเต็ม
        </p>
        <p>
          ภายในแต่ละบทความจะมีหัวข้อย่อย วิดีโอ และเอกสารประกอบให้เรียนรู้ต่อเนื่อง
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  X,
  BookOpen,
  Clock,
  Layers,
  Eye,
  User,
} from "lucide-vue-next";
import {
  useEmployeeLearning,
  type LearningPost,
} from "@/composables/useEmployeeLearning";

definePageMeta({ layout: "default" });

const router = useRouter();
const { posts } = useEmployeeLearning();

/* ---------- filters / state ---------- */
const searchQuery = ref("");

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

/* ---------- filter + load-more logic ---------- */
const filteredPosts = computed(() => {
  return posts.value.filter((p) => {
    const q = searchQuery.value.trim().toLowerCase();
    if (q) {
      const combined = `${p.title} ${p.description} ${p.author}`.toLowerCase();
      if (!combined.includes(q)) return false;
    }
    return true;
  });
});

const pageSize = 6;
const visibleCount = ref(pageSize);

watch(
  () => filteredPosts.value.length,
  () => {
    visibleCount.value = Math.min(pageSize, filteredPosts.value.length);
  },
  { immediate: true }
);

const visiblePosts = computed(() =>
  filteredPosts.value.slice(0, visibleCount.value)
);

const canLoadMore = computed(
  () => visibleCount.value < filteredPosts.value.length
);

const loadMore = () => {
  visibleCount.value = Math.min(
    visibleCount.value + pageSize,
    filteredPosts.value.length
  );
};

/* ---------- helpers ---------- */
const openPost = (post: LearningPost) => {
  router.push(`/employee/learning/${post.id}`);
};
</script>

<style scoped>
.blog-list-enter-from,
.blog-list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.blog-list-enter-active,
.blog-list-leave-active {
  transition: all 0.25s ease-out;
}

.blog-list-move {
  transition: transform 0.2s ease;
}
</style>
