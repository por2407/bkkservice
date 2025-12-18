// composables/useImageCompression.ts
// Shared image compression utility (extracted from useNewJob.ts)

export interface CompressionOptions {
  maxSizeKB?: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * บีบอัดรูปภาพให้มีขนาดไม่เกินที่กำหนด
 * ใช้ canvas API สำหรับ resize และปรับ quality
 */
export const compressImage = (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const { maxSizeKB = 1000, maxWidth = 1920, maxHeight = 1920 } = options;

  return new Promise((resolve, reject) => {
    // SSR guard
    if (typeof document === "undefined") {
      resolve(file);
      return;
    }

    // Skip if file is already small enough
    if (file.size / 1024 <= maxSizeKB) {
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

      // Calculate scale ratio
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
            // Keep reducing quality until size is acceptable
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

/**
 * บีบอัดไฟล์หลายไฟล์พร้อมกัน (เฉพาะรูปภาพ)
 */
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {}
): Promise<File[]> => {
  const results: File[] = [];

  for (const file of files) {
    if (file.type.startsWith("image/")) {
      try {
        const compressed = await compressImage(file, options);
        results.push(compressed);
      } catch (err) {
        console.error("Compression failed for:", file.name, err);
        results.push(file); // Use original if compression fails
      }
    } else {
      // Non-image files pass through unchanged
      results.push(file);
    }
  }

  return results;
};
