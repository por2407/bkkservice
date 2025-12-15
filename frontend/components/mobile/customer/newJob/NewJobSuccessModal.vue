<template>
<div class="card-modal">
<div class="flex items-center gap-2">
<CheckCircle2 class="h-5 w-5 text-primary-500" />
<h2 class="text-[14px] font-semibold text-secondary-800">
ส่งงานแจ้งซ่อมสำเร็จ
</h2>
</div>
<p class="mt-1 text-[12px] text-secondary-600">
ระบบบันทึกงานแจ้งซ่อมเรียบร้อยแล้ว
</p>

<button type="button"
class="mt-3 w-full rounded-2xl bg-primary-600 px-3 py-2 text-[12px] font-semibold text-primary-50 shadow-sm"
@click="emit('close')">
ตกลง
</button>
</div>
</template>

<script setup lang="ts">
import { CheckCircle2 } from "lucide-vue-next";

const emit = defineEmits<{
(e: "close"): void;
}>();
</script>
