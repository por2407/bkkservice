<!-- pages/employee/certificates/index.vue -->
<template>
  <div
    class="min-h-screen bg-slate-50
           pb-[calc(1.5rem+env(safe-area-inset-bottom))]
           pt-[env(safe-area-inset-top)]"
  >
    <!-- HEADER -->
    <header class="bg-slate-50/90 backdrop-blur">
      <div class="flex items-center justify-between px-4 pt-3 pb-2">
        <div class="flex items-center gap-3">
          <div>
            <p class="text-base font-semibold text-slate-900">
              ประกาศนียบัตรพนักงาน
            </p>
            <p class="text-xs text-slate-500">
              อัปโหลดประกาศนียบัตร/ใบรับรองการอบรม
            </p>
          </div>
        </div>

        <!-- สรุปสั้นๆ -->
        <div class="rounded-2xl bg-white px-3 py-2 shadow-sm">
          <p class="text-xs font-medium text-slate-500">
            อัปแล้ว
            <span class="text-emerald-600">{{ uploadedCount }}</span> /
            ทั้งหมด
            <span class="text-slate-900">{{ totalCourses }}</span>
          </p>
        </div>
      </div>

      <!-- แถบค้นหา + filter -->
      <div class="px-4 pb-3 space-y-3">
        <!-- search -->
        <div class="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
          <Search class="h-5 w-5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            class="w-full border-none bg-transparent text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            placeholder="ค้นหารายวิชา / ชื่อประกาศนียบัตร..."
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

        <!-- แถว filter (มือถือให้เรียงลง) -->
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <!-- สถานะ -->
          <div
            class="inline-flex w-full gap-1 rounded-full bg-white p-1 shadow-sm
                   overflow-x-auto no-scrollbar"
          >
            <button
              v-for="option in statusOptions"
              :key="option.value"
              type="button"
              class="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap"
              :class="
                statusFilter === option.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600'
              "
              @click="statusFilter = option.value"
            >
              {{ option.label }}
            </button>
          </div>

          <!-- type filter -->
          <div class="flex items-center gap-2">
            <Filter class="h-4 w-4 text-slate-400" />
            <select
              v-model="typeFilter"
              class="w-full sm:w-auto min-h-[38px] rounded-full border border-slate-200 bg-white
                     px-3 py-2 text-xs text-slate-700
                     focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">ทุกประเภท</option>
              <option v-for="t in certificateTypes" :key="t" :value="t">
                {{ t }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <!-- MAIN -->
    <main class="mt-1 space-y-4 px-4">
      <!-- LIST รายวิชาที่ต้องอัปประกาศนียบัตร -->
      <section class="py-3.5">
        <div class="mb-3 flex items-center justify-between">
          <div class="inline-flex items-center gap-2">
            <FileBadge2 class="h-5 w-5 text-indigo-500" />
            <p class="text-sm font-semibold text-slate-900">
              รายวิชา / หลักสูตรที่อบรม
            </p>
          </div>
          <p class="text-xs text-slate-400">
            {{ filteredCourses.length }} รายการ
          </p>
        </div>

        <div v-if="filteredCourses.length" class="space-y-2.5">
          <button
            v-for="course in filteredCourses"
            :key="course.id"
            type="button"
            class="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white
                   px-3 py-3 text-left shadow-sm active:scale-[0.99] active:bg-slate-50"
            @click="openCourseModal(course)"
          >
            <div class="flex flex-1 items-start gap-3">
              <div
                class="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full"
                :class="course.certificateUrl ? 'bg-emerald-50' : 'bg-slate-100'"
              >
                <BadgeCheck
                  v-if="course.certificateUrl"
                  class="h-5 w-5 text-emerald-500"
                />
                <ImageIcon v-else class="h-5 w-5 text-slate-400" />
              </div>

              <div class="space-y-1">
                <p class="text-[13px] font-semibold text-gray-900 leading-snug">
                  {{ course.name }}
                </p>

                <div class="inline-flex flex-wrap items-center gap-1.5">
                  <span class="px-2.5 py-[2px] text-[11px] font-medium text-sky-600">
                    {{ course.type }}
                  </span>
                  <span
                    class="rounded-full px-2.5 py-[2px] text-[11px] font-semibold"
                    :class="
                      course.certificateUrl
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    "
                  >
                    {{ course.certificateUrl ? 'อัปโหลดแล้ว' : 'ยังไม่อัปโหลด' }}
                  </span>
                </div>

                <p
                  v-if="course.certificateUrl && course.trainingCompletedAt"
                  class="text-[11px] text-slate-400"
                >
                  อบรมสำเร็จเมื่อ {{ formatCompletedDate(course.trainingCompletedAt) }}
                </p>
              </div>
            </div>

            <div class="flex flex-col items-end gap-1">
              <span
                class="text-[11px] font-semibold"
                :class="course.certificateUrl ? 'text-emerald-600' : 'text-indigo-600'"
              >
                {{ course.certificateUrl ? 'ดูประกาศนียบัตร' : 'อัปโหลด' }}
              </span>
              <ChevronRight class="h-4 w-4 text-slate-400" />
            </div>
          </button>
        </div>

        <p v-else class="mt-4 text-center text-sm text-slate-400">
          ไม่พบรายการตามเงื่อนไขที่เลือก
        </p>
      </section>
    </main>

    <!-- MODAL: อัปโหลด / ดูประกาศนียบัตร -->
    <div
      v-if="courseModalOpen && selectedCourse"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      @click.self="closeCourseModal"
    >
      <div
        class="relative w-full sm:max-w-sm max-h-[90vh] rounded-t-3xl bg-white p-4
               pb-[calc(1.25rem+env(safe-area-inset-bottom))]
               shadow-lg sm:rounded-2xl flex flex-col"
      >
        <!-- handle -->
        <div class="mx-auto mb-2 h-1.5 w-12 rounded-full bg-slate-200 sm:hidden"></div>

        <!-- header -->
        <div class="mb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50">
              <ImageIcon class="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p class="text-sm font-semibold text-slate-900 line-clamp-2">
                {{ selectedCourse.name }}
              </p>
              <p class="text-xs text-slate-500">
                {{ selectedCourse.type }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            @click="closeCourseModal"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- เนื้อหา (ให้ scroll เฉพาะตัวนี้) -->
        <div class="space-y-3 flex-1 overflow-y-auto pr-1">
          <!-- ถ้าอัปโหลดแล้ว: โหมดอ่านอย่างเดียว -->
          <div v-if="selectedCourse.certificateUrl" class="space-y-2">
            <p class="text-sm font-semibold text-slate-800">
              ประกาศนียบัตรที่อัปโหลดแล้ว
            </p>

            <!-- ถ้าเป็นรูป -->
            <div
              v-if="selectedCourse.certificateFileType !== 'pdf'"
              class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
            >
              <img
                :src="selectedCourse.certificateUrl"
                alt="certificate preview"
                loading="lazy"
                class="max-h-[320px] w-full object-contain bg-slate-900/5"
              />
            </div>

            <!-- ถ้าเป็น PDF -->
            <div
              v-else
              class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 h-[320px]"
            >
              <iframe
                :src="selectedCourse.certificateUrl"
                loading="lazy"
                class="h-full w-full"
              ></iframe>
            </div>

            <p
              v-if="selectedCourse.trainingCompletedAt"
              class="text-xs text-slate-500"
            >
              อบรมสำเร็จเมื่อ
              {{ formatCompletedDate(selectedCourse.trainingCompletedAt) }}
            </p>

            <div class="mt-1 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
              <div class="flex items-start gap-2">
                <AlertTriangle class="h-4 w-4 mt-[1px]" />
                <p>
                  ประกาศนียบัตรสำหรับรายวิชานี้ถูกอัปโหลดแล้ว
                  <span class="font-semibold">ไม่สามารถแก้ไขหรือเปลี่ยนไฟล์ได้</span>
                  หากมีข้อผิดพลาด กรุณาติดต่อเจ้าหน้าที่ HR
                </p>
              </div>
            </div>
          </div>

          <!-- ยังไม่อัปโหลด: แสดงฟอร์มอัป -->
          <div v-else class="space-y-3">
            <p class="text-sm font-semibold text-slate-800">
              อัปโหลดประกาศนียบัตร
            </p>

            <!-- พรีวิวไฟล์ใหม่ -->
            <div
              v-if="uploadFile"
              class="relative overflow-hidden rounded-2xl border border-indigo-200 bg-slate-50"
            >
              <img
                v-if="uploadFile.type === 'image'"
                :src="uploadFile.url"
                alt="certificate preview"
                class="max-h-[260px] w-full object-contain bg-slate-900/5"
              />

              <div v-else class="h-[260px] w-full bg-slate-900/5">
                <iframe :src="uploadFile.url" class="h-full w-full"></iframe>
              </div>

              <button
                type="button"
                class="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full
                       bg-rose-500 text-white shadow-md active:scale-95"
                @click="clearUploadFile"
              >
                <X class="h-5 w-5" />
              </button>
            </div>

            <!-- ปุ่มเลือกไฟล์ -->
            <label
              v-else
              class="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-2xl
                     border border-dashed border-slate-300 bg-slate-50 px-3 py-4
                     text-sm text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/40"
            >
              <ImageIcon class="h-5 w-5 text-indigo-500" />
              <div class="text-left">
                <p class="font-semibold">เลือกไฟล์จากเครื่อง</p>
                <p class="text-xs text-slate-400">
                  รองรับ .JPG / .PNG / .PDF ขนาดไม่เกิน 5 MB
                </p>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*,.pdf"
                class="hidden"
                @change="handleFileChange"
              />
            </label>

            <!-- วันที่อบรมสำเร็จ -->
            <div class="space-y-1">
              <p class="text-sm font-semibold text-slate-800">
                วันที่อบรมสำเร็จ
              </p>
              <input
                type="date"
                v-model="trainingCompletedDate"
                class="mt-1 w-full min-h-[42px] rounded-xl border border-slate-200 bg-slate-50
                       px-3 py-2 text-[14px] text-slate-900
                       focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <p class="text-xs text-slate-400">
                เลือกวันที่ที่ท่านอบรมสำเร็จจริง เพื่อใช้บันทึกในระบบ
              </p>
            </div>

            <div class="rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
              <div class="flex items-start gap-2">
                <AlertTriangle class="h-4 w-4 mt-[1px]" />
                <p>
                  ระบบอนุญาตให้อัปโหลดประกาศนียบัตร
                  <span class="font-semibold">ได้เพียงครั้งเดียว</span>
                  เมื่อบันทึกแล้วจะไม่สามารถเปลี่ยนไฟล์ได้
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- footer (อยู่ล่างเสมอ) -->
        <div class="mt-4 flex gap-2">
          <template v-if="selectedCourse.certificateUrl">
            <button
              type="button"
              class="w-full min-h-[44px] rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold
                     text-white shadow-sm active:scale-95"
              @click="closeCourseModal"
            >
              ปิด
            </button>
          </template>

          <template v-else>
            <button
              type="button"
              class="flex-1 min-h-[44px] rounded-full border border-slate-200 bg-white px-3 py-2 text-sm
                     font-semibold text-slate-600"
              @click="closeCourseModal"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="flex-1 min-h-[44px] rounded-full bg-indigo-600 px-3 py-2 text-sm font-semibold
                     text-white shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed"
              :disabled="!uploadFile || !trainingCompletedDate"
              @click="openConfirmUpload"
            >
              บันทึกประกาศนียบัตร
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- MODAL ยืนยันการอัปโหลด -->
    <div
      v-if="confirmUploadOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="!certificateUploading && (confirmUploadOpen = false)"
    >
      <div
        class="relative w-[92%] max-w-xs rounded-2xl bg-white px-4 py-4 text-center shadow-lg"
      >
        <!-- overlay ตอนกำลังอัปโหลด + เปอร์เซ็น -->
        <div
          v-if="certificateUploading"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white/90"
        >
          <div class="progress-ring" :style="{ '--value': uploadProgress + '%' }">
            <span class="progress-ring__label">{{ uploadProgress }}%</span>
          </div>
          <p class="mt-2 text-xs text-slate-600">
            กำลังอัปโหลดประกาศนียบัตร...
          </p>
        </div>

        <div class="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
          <AlertTriangle class="h-6 w-6 text-amber-600" />
        </div>

        <p class="mb-1 text-base font-semibold text-slate-900">
          ยืนยันการอัปโหลดประกาศนียบัตร
        </p>
        <p class="mb-2 text-xs text-slate-600">
          หลักสูตร:
          <span class="font-medium" v-if="selectedCourse">
            {{ selectedCourse.name }}
          </span>
        </p>
        <p class="mb-4 text-xs leading-relaxed text-slate-600">
          วันที่อบรมสำเร็จ:
          <span class="font-medium">
            {{
              trainingCompletedDate
                ? formatCompletedDate(trainingCompletedDate + 'T00:00:00')
                : '-'
            }}
          </span>
          <br />
          เมื่อยืนยันแล้ว ระบบจะบันทึกประกาศนียบัตรสำหรับรายวิชานี้
          <span class="font-semibold">
            และจะไม่สามารถแก้ไข / เปลี่ยนไฟล์ได้ในภายหลัง
          </span>
        </p>

        <div class="flex gap-2">
          <button
            type="button"
            class="flex-1 min-h-[44px] rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold
                   text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="certificateUploading"
            @click="confirmUploadOpen = false"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            class="flex-1 min-h-[44px] rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold
                   text-white shadow-sm active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
            :disabled="certificateUploading"
            @click="saveCertificate"
          >
            {{ certificateUploading ? "กำลังอัปโหลด..." : "ยืนยันอัปโหลด" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  X,
  AlertTriangle,
  FileBadge2,
  Image as ImageIcon,
  BadgeCheck,
  ChevronRight,
  Filter,
} from "lucide-vue-next";

definePageMeta({ layout: "default" });
const router = useRouter();

/* ---------- types ---------- */
type CertificateType = "อบรมภายใน" | "อบรมภายนอก" | "ใบอนุญาตวิชาชีพ";

interface CourseCertificate {
  id: string;
  code: string;
  name: string;
  type: CertificateType;
  certificateUrl?: string;
  certificateFileType?: "image" | "pdf";
  uploadedAt?: string;
  trainingCompletedAt?: string;
}

/* ---------- mock data ---------- */
const courses = ref<CourseCertificate[]>([
  {
    id: "CRS-001",
    code: "SAF-101",
    name: "หลักสูตรความปลอดภัยในการทำงานในอาคารสูง",
    type: "อบรมภายใน",
    certificateUrl:
      "https://images.pexels.com/photos/105028/pexels-photo-105028.jpeg",
    certificateFileType: "image",
    uploadedAt: "2025-11-10T09:30:00+07:00",
    trainingCompletedAt: "2025-10-20T00:00:00+07:00",
  },
  { id: "CRS-002", code: "ELEC-201", name: "การใช้งานและบำรุงรักษาระบบไฟฟ้าเบื้องต้น", type: "อบรมภายนอก" },
  { id: "CRS-003", code: "AIR-305", name: "การซ่อมและบำรุงรักษาเครื่องปรับอากาศ", type: "อบรมภายนอก" },
  { id: "CRS-004", code: "LIFT-110", name: "การตรวจสอบและใช้งานลิฟต์โดยสารอย่างปลอดภัย", type: "อบรมภายใน" },
  { id: "CRS-005", code: "CERT-001", name: "ใบอนุญาตช่างไฟฟ้าภายในอาคาร", type: "ใบอนุญาตวิชาชีพ" },
]);

/* ---------- date format (ไทย) ---------- */
const thaiMonthsShort = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

const formatCompletedDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.getDate().toString().padStart(2, "0");
  const month = thaiMonthsShort[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
};

/* ---------- filters ---------- */
const searchQuery = ref("");
const statusFilter = ref<"all" | "uploaded" | "pending">("all");
const typeFilter = ref<"all" | CertificateType>("all");

const statusOptions = [
  { value: "all", label: "ทั้งหมด" },
  { value: "uploaded", label: "อัปแล้ว" },
  { value: "pending", label: "ยังไม่อัป" },
] as const;

const certificateTypes: CertificateType[] = ["อบรมภายใน","อบรมภายนอก","ใบอนุญาตวิชาชีพ"];

/* ---------- computed ---------- */
const filteredCourses = computed(() => {
  return courses.value.filter((c) => {
    const q = searchQuery.value.trim().toLowerCase();
    if (q) {
      const text = `${c.name} ${c.code}`.toLowerCase();
      if (!text.includes(q)) return false;
    }
    if (typeFilter.value !== "all" && c.type !== typeFilter.value) return false;

    const uploaded = !!c.certificateUrl;
    if (statusFilter.value === "uploaded" && !uploaded) return false;
    if (statusFilter.value === "pending" && uploaded) return false;

    return true;
  });
});

const totalCourses = computed(() => courses.value.length);
const uploadedCount = computed(() => courses.value.filter((c) => !!c.certificateUrl).length);
const pendingCount = computed(() => courses.value.filter((c) => !c.certificateUrl).length);

/* ---------- modal state ---------- */
const courseModalOpen = ref(false);
const selectedCourse = ref<CourseCertificate | null>(null);

const uploadFile = ref<{
  url: string;
  type: "image" | "pdf";
  name: string;
  file: File;
} | null>(null);

const fileInput = ref<HTMLInputElement | null>(null);

const confirmUploadOpen = ref(false);
const certificateUploading = ref(false);
const uploadProgress = ref(0);

const trainingCompletedDate = ref("");

/* ---------- actions ---------- */
const goBack = () => router.back();

const openCourseModal = (course: CourseCertificate) => {
  selectedCourse.value = course;
  uploadFile.value = null;
  confirmUploadOpen.value = false;
  certificateUploading.value = false;
  uploadProgress.value = 0;
  trainingCompletedDate.value = "";
  courseModalOpen.value = true;
};

const closeCourseModal = () => {
  courseModalOpen.value = false;
  uploadFile.value = null;
  confirmUploadOpen.value = false;
  certificateUploading.value = false;
  uploadProgress.value = 0;
  trainingCompletedDate.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const isPdf =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  uploadFile.value = {
    url,
    type: isPdf ? "pdf" : "image",
    name: file.name,
    file,
  };
};

const clearUploadFile = () => {
  if (certificateUploading.value) return;
  uploadFile.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

const openConfirmUpload = () => {
  if (!uploadFile.value || !selectedCourse.value || !trainingCompletedDate.value) return;
  uploadProgress.value = 0;
  confirmUploadOpen.value = true;
};

const saveCertificate = async () => {
  if (!selectedCourse.value || !uploadFile.value || certificateUploading.value) return;

  certificateUploading.value = true;
  uploadProgress.value = 0;

  try {
    for (let p = 10; p <= 100; p += 10) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      uploadProgress.value = p;
    }

    const idx = courses.value.findIndex((c) => c.id === selectedCourse.value?.id);
    if (idx !== -1) {
      const completedIso = new Date(trainingCompletedDate.value + "T00:00:00").toISOString();
      const nowIso = new Date().toISOString();

      courses.value[idx] = {
        ...courses.value[idx],
        certificateUrl: uploadFile.value.url,
        certificateFileType: uploadFile.value.type,
        uploadedAt: nowIso,
        trainingCompletedAt: completedIso,
      };
      selectedCourse.value = courses.value[idx];
    }

    confirmUploadOpen.value = false;
    closeCourseModal();
  } catch (error) {
    console.error("saveCertificate error:", error);
  } finally {
    certificateUploading.value = false;
    uploadProgress.value = 0;
    uploadFile.value = null;
    if (fileInput.value) fileInput.value.value = "";
  }
};
</script>

<style scoped>
/* วงกลม progress */
.progress-ring {
  --size: 56px;
  --thickness: 3px;
  --value: 0%;
  position: relative;
  width: var(--size);
  height: var(--size);
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-ring::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background:
    conic-gradient(#ef4444 var(--value), transparent 0),
    conic-gradient(#e5e7eb 0 360deg);
  transform: rotate(-90deg);
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(50% - var(--thickness)),
    #000 calc(50% - var(--thickness) + 1px)
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(50% - var(--thickness)),
    #000 calc(50% - var(--thickness) + 1px)
  );
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
  transition: background 0.15s linear;
}
.progress-ring__label {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--size) - var(--thickness) * 6);
  height: calc(var(--size) - var(--thickness) * 6);
  border-radius: 9999px;
  background: #ffffff;
  font-size: 11px;
  font-weight: 600;
  color: #ef4444;
  box-shadow:
    0 1px 3px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(148, 163, 184, 0.25);
}

/* ซ่อน scrollbar แนวนอนสำหรับ chips ในมือถือ */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
