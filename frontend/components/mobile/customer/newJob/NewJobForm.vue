<!-- components/customer/NewJob/NewJobForm.vue -->
<template>
<form class="space-y-3" @submit.prevent="emit('submit')">
<!-- ห้อง -->
<div class="card-surface">
<label class="block text-label">
หมายเลขห้อง <span class="text-error-500">*</span>
</label>
<p class="mt-0.5 text-hint">เช่น 1205, 803, 1502</p>
<input v-model="form.room" type="text" class="input-field mt-2" placeholder="กรอกหมายเลขห้อง" />
</div>

<!-- หมายเลขเครื่อง -->
<div class="card-surface">
<label class="block text-label">
หมายเลขเครื่อง / Serial (ถ้ามี)
</label>
<p class="mt-0.5 text-hint">
เช่น เลขหลังรีโมตแอร์, หมายเลขเครื่องซักผ้า
</p>
<input v-model="form.machineNo" type="text" class="input-field mt-2"
placeholder="ถ้าไม่ทราบ สามารถเว้นว่างได้" />
</div>

<!-- รายละเอียดงาน -->
<div class="card-surface">
<label class="block text-label">
รายละเอียดงาน <span class="text-error-500">*</span>
</label>
<p class="mt-0.5 text-hint">
อธิบายอาการปัญหา, ช่วงเวลาที่ต้องการให้เข้าดำเนินการ ฯลฯ
</p>
<textarea v-model="form.description" rows="4" class="textarea-field mt-2"
placeholder="ตัวอย่าง: แอร์ไม่เย็น มีเสียงดังตอนเปิดโหมดเย็น ขอช่างเข้ามาดูช่วง 10.00–12.00
น."></textarea>
</div>

<!-- upload -->
<div class="card-surface">
<div class="flex items-center justify-between gap-2">
<div>
<label class="block text-label">
รูปภาพ / วิดีโอ ประกอบ
</label>
<p class="mt-0.5 text-hint">
แนบได้ทั้งรูปและวิดีโอ (จำลองบีบอัดรูปไม่เกิน 1000KB)
</p>
</div>
</div>

<label class="btn-upload mt-2">
<div class="flex items-center gap-2">
<UploadCloud class="h-4 w-4" />
<span>แตะเพื่อเลือกรูปภาพ/วิดีโอ</span>
</div>
<span class="text-hint">รองรับหลายไฟล์</span>
<input type="file" class="hidden" multiple accept="image/*,video/*" @change="(e) => emit('files-change', e)"
/>
</label>

<!-- error รวม -->
<div v-if="errorCount > 0" class="badge-error mt-2">
มี {{ errorCount }} ไฟล์ที่ขนาดเกิน 1000KB หรือผิดเงื่อนไข
</div>

<!-- summary -->
<div v-if="uploads.length" class="mt-1 flex items-center justify-between text-xs text-secondary-500">
<div class="flex flex-wrap items-center gap-1.5">
<span>เลือกไฟล์แล้ว {{ uploads.length }} ไฟล์</span>
<span v-if="imageCount">· รูป {{ imageCount }}</span>
<span v-if="videoCount">· วิดีโอ {{ videoCount }}</span>
<span class="text-hint">· {{ totalSizeLabel }}</span>
</div>
<button type="button" class="link-primary" @click="emit('open-file-modal')">
ดูรายละเอียดไฟล์
</button>
</div>

<div v-else class="mt-2 text-hint">
ยังไม่ได้เลือกไฟล์ ระบบจะบันทึกเพียงว่ามีหรือไม่มีสื่อประกอบ
</div>
</div>

<!-- error ฟอร์ม -->
<p v-if="errorMessage" class="mt-1 flex items-center gap-1 text-xs text-error-500">
<AlertCircle class="h-3.5 w-3.5" />
<span>{{ errorMessage }}</span>
</p>

<!-- submit -->
<div class="pt-2">
<button type="submit" class="btn-primary"
:disabled="!canSubmit || saving || errorCount > 0">
<span>ส่งงานแจ้งซ่อม</span>
</button>

<p class="mt-1 text-center text-hint">
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