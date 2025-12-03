// composables/task/customer/useNewJob.ts
import { ref, reactive, computed } from "vue";
import type { AxiosProgressEvent } from "axios";
import { taskApi } from "@/services/task.api";

export type UploadStatus = "pending" | "error";

export interface UploadItem {
  id: number;
  name: string;
  type: "image" | "video";
  sizeKB: number;
  status: UploadStatus;
  error?: string;
  file?: File;
}

export function useNewJob() {
  const form = reactive({
    room: "",
    machineNo: "",
    description: "",
    hasImage: false,
    hasVideo: false,
  });

  const uploads = ref<UploadItem[]>([]);
  let uploadId = 0;

  const showFileModal = ref(false);
  const confirmModalOpen = ref(false);
  const showSuccessModal = ref(false);

  const saving = ref(false);
  const saveProgress = ref(0);
  const errorMessage = ref("");

  // modal control
  const openFileModal = () => {
    if (uploads.value.length) showFileModal.value = true;
  };
  const closeFileModal = () => {
    showFileModal.value = false;
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

  // remove file
  const removeFile = (id: number) => {
    const idx = uploads.value.findIndex((u) => u.id === id);
    if (idx === -1) return;
    uploads.value.splice(idx, 1);

    form.hasImage = uploads.value.some((u) => u.type === "image");
    form.hasVideo = uploads.value.some((u) => u.type === "video");

    if (!uploads.value.length) {
      showFileModal.value = false;
    }
  };

  // compress image
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

      reader.onerror = (err) => reject(err as any);

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

      img.onerror = (err) => reject(err as any);

      reader.readAsDataURL(file);
    });
  };

  // handle file change
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
          finalFile = await compressImage(file, 1000);
          form.hasImage = true;
        }
        if (isVideo) {
          form.hasVideo = true;
        }
      } catch (err) {
        console.error("compress image error:", err);
      }

      const sizeKB = Math.round(finalFile.size / 1024);
      const overLimit = isImage && sizeKB > 1000;

      const item: UploadItem = {
        id: uploadId++,
        name: finalFile.name,
        type: isImage ? "image" : "video",
        sizeKB,
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

  // form submit
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

  const handleSubmit = () => {
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

    confirmModalOpen.value = true;
  };

  const confirmSend = async () => {
    if (saving.value) return;
    saving.value = true;
    saveProgress.value = 0;
    errorMessage.value = "";

    try {
      const files = uploads.value
        .filter((u) => !u.error && u.file)
        .map((u) => u.file!) as File[];

      const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
        if (!progressEvent.total) return;
        const loaded = progressEvent.loaded ?? 0;
        const percent = Math.round((loaded * 100) / progressEvent.total);
        saveProgress.value = Math.min(percent, 95);
      };

      await taskApi.createTask(
        {
          room: form.room.trim(),
          machineNo: form.machineNo.trim(),
          description: form.description.trim(),
        },
        files,
        onUploadProgress
      );

      saveProgress.value = 100;
      await new Promise((r) => setTimeout(r, 200));

      resetForm();
      confirmModalOpen.value = false;
      showSuccessModal.value = true;
    } catch (err: any) {
      console.error(err);
      errorMessage.value =
        err?.response?.data?.message ||
        "ไม่สามารถบันทึกงานได้ กรุณาลองใหม่อีกครั้ง";
    } finally {
      saving.value = false;
      saveProgress.value = 0;
    }
  };

  return {
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
    totalSizeKB,
    totalSizeLabel,

    canSubmit,

    openFileModal,
    closeFileModal,
    handleFilesChange,
    removeFile,
    handleSubmit,
    confirmSend,
  };
}
