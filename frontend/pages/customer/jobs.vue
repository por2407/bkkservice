<template>
  <div class="min-h-screen bg-slate-50 px-4 pt-4 pb-6 text-slate-900">
    <!-- header / hero -->
    <section
      class="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 px-4 pt-4 pb-4 text-emerald-50 shadow-sm"
    >
      <h1 class="mt-2 text-[20px] font-bold leading-snug">แจ้งงานใหม่</h1>
      <p class="mt-0.5 text-[12px] leading-relaxed text-emerald-50/95">
        กรอกข้อมูลปัญหาที่ต้องการให้ช่างเข้าดำเนินการ
      </p>
      <p class="mt-2 text-[11px] text-emerald-50/80">
        ห้องที่ต้องการแจ้ง, หมายเลขเครื่อง (ถ้ามี) และรายละเอียดงาน
      </p>
    </section>

    <!-- form -->
    <section class="mt-3">
      <form class="space-y-3" @submit.prevent="handleSubmit">
        <!-- ห้อง -->
        <div
          class="rounded-[22px] bg-white px-3.5 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
        >
          <label class="block text-[12px] font-semibold text-slate-700">
            หมายเลขห้อง <span class="text-red-500">*</span>
          </label>
          <p class="mt-0.5 text-[11px] text-slate-400">เช่น 1205, 803, 1502</p>
          <input
            v-model="form.room"
            type="text"
            class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] outline-none ring-0 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            placeholder="กรอกหมายเลขห้อง"
          />
        </div>

        <!-- หมายเลขเครื่อง -->
        <div
          class="rounded-[22px] bg-white px-3.5 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
        >
          <label class="block text-[12px] font-semibold text-slate-700">
            หมายเลขเครื่อง / Serial (ถ้ามี)
          </label>
          <p class="mt-0.5 text-[11px] text-slate-400">
            เช่น เลขหลังรีโมตแอร์, หมายเลขเครื่องซักผ้า
          </p>
          <input
            v-model="form.machineNo"
            type="text"
            class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] outline-none ring-0 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            placeholder="ถ้าไม่ทราบ สามารถเว้นว่างได้"
          />
        </div>

        <!-- รายละเอียดงาน -->
        <div
          class="rounded-[22px] bg-white px-3.5 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
        >
          <label class="block text-[12px] font-semibold text-slate-700">
            รายละเอียดงาน <span class="text-red-500">*</span>
          </label>
          <p class="mt-0.5 text-[11px] text-slate-400">
            อธิบายอาการปัญหา, ช่วงเวลาที่ต้องการให้เข้าดำเนินการ ฯลฯ
          </p>
          <textarea
            v-model="form.description"
            rows="4"
            class="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] leading-snug outline-none ring-0 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            placeholder="ตัวอย่าง: แอร์ไม่เย็น มีเสียงดังตอนเปิดโหมดเย็น ขอช่างเข้ามาดูช่วง 10.00–12.00 น."
          ></textarea>
        </div>

        <!-- upload -->
        <div
          class="rounded-[22px] bg-white px-3.5 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
        >
          <div class="flex items-center justify-between gap-2">
            <div>
              <label class="block text-[12px] font-semibold text-slate-700">
                รูปภาพ / วิดีโอ ประกอบ
              </label>
              <p class="mt-0.5 text-[11px] text-slate-400">
                แนบได้ทั้งรูปและวิดีโอ (mock: ย่อรูปอัตโนมัติ ≤ 1000KB +
                จำลองอัปโหลด)
              </p>
            </div>
          </div>

          <label
            class="mt-2 flex cursor-pointer items-center justify-between gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-[12px] text-slate-600 hover:border-emerald-400 hover:bg-emerald-50/40"
          >
            <div class="flex items-center gap-2">
              <UploadCloud class="h-4 w-4" />
              <span>แตะเพื่อเลือกรูปภาพ/วิดีโอ</span>
            </div>
            <span class="text-[11px] text-slate-400">รองรับหลายไฟล์</span>
            <input
              type="file"
              class="hidden"
              multiple
              accept="image/*,video/*"
              @change="handleFilesChange"
            />
          </label>

          <!-- error รวม -->
          <div
            v-if="errorCount > 0"
            class="mt-2 rounded-xl bg-red-50 px-3 py-1.5 text-[11px] text-red-600"
          >
            มี {{ errorCount }} ไฟล์ที่ขนาดเกิน 1000KB หรือผิดเงื่อนไข
          </div>

          <!-- summary -->
          <div
            v-if="uploads.length"
            class="mt-1 flex items-center justify-between text-[11px] text-slate-500"
          >
            <div class="flex flex-wrap items-center gap-1.5">
              <span>เลือกไฟล์แล้ว {{ uploads.length }} ไฟล์</span>
              <span v-if="imageCount">· รูป {{ imageCount }}</span>
              <span v-if="videoCount">· วิดีโอ {{ videoCount }}</span>
              <span class="text-slate-400">· {{ totalSizeLabel }}</span>
            </div>
            <button
              type="button"
              class="text-[11px] font-medium text-emerald-600 underline"
              @click="openFileModal"
            >
              ดูรายละเอียดไฟล์
            </button>
          </div>

          <div v-else class="mt-2 text-[11px] text-slate-400">
            ยังไม่ได้เลือกไฟล์ ระบบจะบันทึกแค่ว่ามี/ไม่มีรูปหรือวิดีโอ (mock)
          </div>
        </div>

        <!-- error ฟอร์ม -->
        <p
          v-if="errorMessage"
          class="mt-1 flex items-center gap-1 text-[11px] text-red-500"
        >
          <AlertCircle class="h-3.5 w-3.5" />
          <span>{{ errorMessage }}</span>
        </p>

        <!-- submit -->
        <div class="pt-2">
          <button
            type="submit"
            class="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-[13px] font-semibold text-emerald-50 shadow-[0_10px_26px_rgba(5,150,105,0.45)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:shadow-none"
            :disabled="!canSubmit || loading || uploading || errorCount > 0"
          >
            <span v-if="!loading && !uploading">ส่งงานแจ้งซ่อม</span>
            <span v-else>กำลังบันทึก...</span>
          </button>

          <p class="mt-1 text-center text-[11px] text-slate-400">
            เมื่อบันทึกแล้ว งานนี้จะแสดงในหน้ารายการแจ้งงานอัตโนมัติ
          </p>
        </div>
      </form>
    </section>

    <!-- MODAL: รายละเอียดไฟล์ + process อัปโหลด -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showFileModal"
        class="fixed inset-0 z-40 flex items-end justify-center bg-slate-900/40 sm:items-center"
        @click.self="onBackdropClick"
      >
        <div
          class="w-full max-w-sm rounded-t-3xl bg-white p-3 shadow-lg sm:max-w-md sm:rounded-3xl"
        >
          <!-- header -->
          <div class="flex items-center justify-between">
            <h2 class="text-[13px] font-semibold text-slate-800">
              {{ uploading ? "กำลังอัปโหลดไฟล์" : "ไฟล์ที่เลือก" }}
            </h2>
            <button
              type="button"
              class="rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-500 disabled:opacity-60"
              :disabled="uploading"
              @click="closeFileModal"
            >
              ปิด
            </button>
          </div>

          <p class="mt-0.5 text-[11px] text-slate-500">
            รวม {{ uploads.length }} ไฟล์ · {{ totalSizeLabel }}
          </p>

          <!-- progress รวม -->
          <div
            v-if="uploading && uploads.length"
            class="mt-2 rounded-2xl bg-emerald-50 px-3 py-2"
          >
            <div
              class="flex items-center justify-between text-[11px] text-emerald-700"
            >
              <span v-if="currentUploading">
                กำลังอัปโหลดไฟล์
                {{ currentUploadingIndex + 1 }}/{{ uploads.length }}:
                {{ currentUploading.name }}
              </span>
              <span v-else>กำลังเตรียมข้อมูล...</span>
              <span>{{ overallProgress }}%</span>
            </div>
            <div
              class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-emerald-100"
            >
              <div
                class="h-full rounded-full bg-emerald-500 transition-[width] duration-150"
                :style="{ width: overallProgress + '%' }"
              ></div>
            </div>
          </div>

          <!-- รายการไฟล์ -->
          <ul class="mt-2 max-h-[60vh] space-y-1.5 overflow-y-auto">
            <li
              v-for="item in uploads"
              :key="item.id"
              class="rounded-2xl bg-slate-50 px-3 py-1.5"
            >
              <div class="flex items-center justify-between gap-2 text-[11px]">
                <div class="flex items-center gap-1.5">
                  <ImageIcon
                    v-if="item.type === 'image'"
                    class="h-3.5 w-3.5"
                  />
                  <Video v-else class="h-3.5 w-3.5" />
                  <span class="max-w-[200px] truncate font-medium">
                    {{ item.name }}
                  </span>
                </div>
                <span class="text-[10px] text-slate-400">
                  {{ item.sizeKB }} KB
                </span>
              </div>

              <div class="mt-1 flex items-center justify-between text-[10px]">
                <span
                  class="rounded-full px-1.5 py-0.5"
                  :class="statusClass(item.status, !!item.error)"
                >
                  {{ statusLabel(item.status, !!item.error) }}
                  <span v-if="item.status === 'uploading'">
                    · {{ item.progress }}%
                  </span>
                </span>

                <!-- ลบได้เฉพาะ pending และยังไม่อัปโหลด -->
                <button
                  v-if="!uploading && item.status === 'pending'"
                  type="button"
                  class="text-red-500 underline"
                  @click="removeFile(item.id)"
                >
                  ลบ
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Transition>

    <!-- MODAL: ส่งงานสำเร็จ -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 sm:items-center"
        @click.self="showSuccessModal = false"
      >
        <div
          class="w-full max-w-sm rounded-t-3xl bg-white p-4 shadow-lg sm:max-w-sm sm:rounded-3xl"
        >
          <div class="flex items-center gap-2">
            <CheckCircle2 class="h-5 w-5 text-emerald-500" />
            <h2 class="text-[14px] font-semibold text-slate-800">
              ส่งงานแจ้งซ่อมสำเร็จ
            </h2>
          </div>
          <p class="mt-1 text-[12px] text-slate-600">
            ระบบบันทึกงานแจ้งซ่อมเรียบร้อยแล้ว
          </p>

          <button
            type="button"
            class="mt-3 w-full rounded-2xl bg-emerald-600 px-3 py-2 text-[12px] font-semibold text-emerald-50 shadow-sm"
            @click="showSuccessModal = false"
          >
            ตกลง
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import {
  UploadCloud,
  Image as ImageIcon,
  Video,
  AlertCircle,
  CheckCircle2,
} from "lucide-vue-next";

const form = reactive({
  room: "",
  machineNo: "",
  description: "",
  hasImage: false,
  hasVideo: false,
});

type UploadStatus = "pending" | "uploading" | "done" | "error";

interface UploadItem {
  id: number;
  name: string;
  type: "image" | "video";
  sizeKB: number;
  progress: number;
  status: UploadStatus;
  error?: string;
  file?: File;
}

const uploads = ref<UploadItem[]>([]);
let uploadId = 0;

const showFileModal = ref(false);
const showSuccessModal = ref(false);
const uploading = ref(false); // process upload
const loading = ref(false); // process submit (รวม upload+save)
const errorMessage = ref("");

// modal control
const openFileModal = () => {
  if (uploads.value.length) showFileModal.value = true;
};
const closeFileModal = () => {
  if (uploading.value) return;
  showFileModal.value = false;
};
const onBackdropClick = () => {
  closeFileModal();
};

// counts
const errorCount = computed(
  () => uploads.value.filter((u) => u.status === "error").length
);
const imageCount = computed(
  () => uploads.value.filter((u) => u.type === "image").length
);
const videoCount = computed(
  () => uploads.value.filter((u) => u.type === "video").length
);

// total size
const totalSizeKB = computed(() =>
  uploads.value.reduce((sum, u) => sum + (u.sizeKB || 0), 0)
);
const totalSizeLabel = computed(() => {
  if (totalSizeKB.value < 1024) return `${totalSizeKB.value} KB`;
  const mb = totalSizeKB.value / 1024;
  return `${mb.toFixed(1)} MB`;
});

// current uploading
const currentUploading = computed<UploadItem | null>(() => {
  return uploads.value.find((u) => u.status === "uploading") ?? null;
});
const currentUploadingIndex = computed(() => {
  if (!currentUploading.value) return -1;
  return uploads.value.findIndex((u) => u.id === currentUploading.value!.id);
});

// overall progress
const overallProgress = computed(() => {
  if (!uploads.value.length) return 0;
  const total = uploads.value.reduce((sum, u) => sum + (u.progress || 0), 0);
  return Math.round(total / uploads.value.length);
});

// status helpers
const statusLabel = (status: UploadStatus, hasError: boolean) => {
  if (hasError || status === "error") return "มีปัญหา";
  if (status === "done") return "อัปโหลดแล้ว";
  if (status === "uploading") return "กำลังอัปโหลด";
  return "ยังไม่อัปโหลด";
};

const statusClass = (status: UploadStatus, hasError: boolean) => {
  if (hasError || status === "error") {
    return "bg-red-100 text-red-600";
  }
  if (status === "done") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (status === "uploading") {
    return "bg-emerald-50 text-emerald-700";
  }
  return "bg-slate-100 text-slate-500";
};

// remove file (pending เท่านั้น และไม่กำลังอัปโหลด)
const removeFile = (id: number) => {
  if (uploading.value) return;
  const idx = uploads.value.findIndex((u) => u.id === id);
  if (idx === -1) return;
  uploads.value.splice(idx, 1);

  form.hasImage = uploads.value.some((u) => u.type === "image");
  form.hasVideo = uploads.value.some((u) => u.type === "video");

  if (!uploads.value.length) {
    showFileModal.value = false;
  }
};

// ---------- compress image ----------
const compressImage = (
  file: File,
  maxSizeKB = 1000,
  maxWidth = 1920,
  maxHeight = 1920
): Promise<File> => {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target) {
        reject(new Error("อ่านรูปไม่สำเร็จ"));
        return;
      }
      img.src = e.target.result as string;
    };

    reader.onerror = (err) => reject(err);

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("ไม่สามารถสร้าง canvas ได้"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.9;

      const exportBlob = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("บีบอัดรูปไม่สำเร็จ"));
              return;
            }

            const sizeKB = blob.size / 1024;
            if (sizeKB > maxSizeKB && quality > 0.3) {
              quality -= 0.1;
              exportBlob();
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: blob.type || "image/jpeg",
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };

      exportBlob();
    };

    img.onerror = (err) => reject(err);

    reader.readAsDataURL(file);
  });
};

// ---------- mock upload ต่อไฟล์ ----------
const uploadFile = (item: UploadItem): Promise<void> => {
  return new Promise((resolve) => {
    if (item.error) {
      item.status = "error";
      item.progress = 0;
      resolve();
      return;
    }

    item.status = "uploading";
    item.progress = 0;

    const totalTime = 2000 + Math.random() * 2000;
    const step = 120;
    const increment = 100 / (totalTime / step);

    const timer = setInterval(() => {
      if (item.progress >= 100) {
        item.progress = 100;
        item.status = "done";
        clearInterval(timer);
        resolve();
        return;
      }

      item.progress = Math.min(100, Math.round(item.progress + increment));
    }, step);
  });
};

// ---------- handle file change ----------
const handleFilesChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;

  uploads.value = [];
  form.hasImage = false;
  form.hasVideo = false;
  showFileModal.value = false;

  if (!files || files.length === 0) return;

  for (const file of Array.from(files)) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) continue;

    let finalFile = file;

    try {
      if (isImage) {
        // รูปภาพ: resize/บีบอัด + จำกัด 1000KB
        finalFile = await compressImage(file, 1000);
        form.hasImage = true;
      }
      if (isVideo) {
        // วิดีโอ: ไม่บีบอัด ไม่จำกัดขนาด
        form.hasVideo = true;
      }
    } catch (err) {
      console.error("compress image error:", err);
    }

    const sizeKB = Math.round(finalFile.size / 1024);

    // เช็ค limit 1000KB แค่ "รูปภาพ" เท่านั้น
    const overLimit = isImage && sizeKB > 1000;

    const item: UploadItem = {
      id: uploadId++,
      name: finalFile.name,
      type: isImage ? "image" : "video",
      sizeKB,
      progress: 0,
      status: overLimit ? "error" : "pending",
      error: overLimit
        ? "ไฟล์รูปนี้มีขนาดเกิน 1000KB หลังบีบอัด/ตรวจสอบ"
        : undefined,
      file: finalFile,
    };

    uploads.value.push(item);
  }

  input.value = "";
};


// ---------- form submit ----------
const canSubmit = computed(() => {
  return form.room.trim() !== "" && form.description.trim() !== "";
});

const resetForm = () => {
  form.room = "";
  form.machineNo = "";
  form.description = "";
  form.hasImage = false;
  form.hasVideo = false;
  uploads.value = [];
};

const handleSubmit = async () => {
  errorMessage.value = "";

  if (!canSubmit.value) {
    errorMessage.value = "กรุณากรอกหมายเลขห้องและรายละเอียดงาน";
    return;
  }

  if (errorCount.value > 0) {
    errorMessage.value =
      "มีไฟล์บางรายการขนาดเกิน 1000KB กรุณาลบออกหรือเลือกไฟล์ใหม่";
    return;
  }

  loading.value = true;

  try {
    // ถ้ามีไฟล์ แสดง modal + process อัปโหลด
    if (uploads.value.length) {
      showFileModal.value = true;
      uploading.value = true;

      for (const item of uploads.value) {
        if (item.status === "pending") {
          await uploadFile(item);
        }
      }

      uploading.value = false;
    }

    // mock บันทึกงาน
    await new Promise((resolve) => setTimeout(resolve, 600));

    // reset ฟอร์ม และโชว์ success modal (ไม่ redirect)
    resetForm();
    showFileModal.value = false;
    showSuccessModal.value = true;
  } catch (err) {
    console.error(err);
    errorMessage.value = "ไม่สามารถบันทึกงานได้ กรุณาลองใหม่อีกครั้ง";
  } finally {
    uploading.value = false;
    loading.value = false;
  }
};
</script>
