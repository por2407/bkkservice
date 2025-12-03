<!-- components/customer/NewJob/NewJobForm.vue -->
<template>
    <form class="space-y-3" @submit.prevent="emit('submit')">
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
              แนบได้ทั้งรูปและวิดีโอ (จำลองบีบอัดรูปไม่เกิน 1000KB)
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
            @change="(e) => emit('files-change', e)"
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
            @click="emit('open-file-modal')"
          >
            ดูรายละเอียดไฟล์
          </button>
        </div>
  
        <div v-else class="mt-2 text-[11px] text-slate-400">
          ยังไม่ได้เลือกไฟล์ ระบบจะบันทึกเพียงว่ามีหรือไม่มีสื่อประกอบ
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
          :disabled="!canSubmit || saving || errorCount > 0"
        >
          <span>ส่งงานแจ้งซ่อม</span>
        </button>
  
        <p class="mt-1 text-center text-[11px] text-slate-400">
          เมื่อบันทึกแล้ว งานนี้จะแสดงในหน้ารายการแจ้งงานอัตโนมัติ
        </p>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import {
    UploadCloud,
    AlertCircle,
  } from "lucide-vue-next";
  
  import type { UploadItem } from "@/composables/task/customer/useNewJob";
  
  const props = defineProps<{
    form: {
      room: string;
      machineNo: string;
      description: string;
    };
    uploads: UploadItem[];
    imageCount: number;
    videoCount: number;
    totalSizeLabel: string;
    errorMessage: string;
    errorCount: number;
    canSubmit: boolean;
    saving: boolean;
  }>();
  
  const emit = defineEmits<{
    (e: "submit"): void;
    (e: "open-file-modal"): void;
    (e: "files-change", event: Event): void;
  }>();
  
  // props.form, props.uploads ฯลฯ ถูก expose ให้ใช้ใน template เป็น form, uploads, ...
  </script>
  