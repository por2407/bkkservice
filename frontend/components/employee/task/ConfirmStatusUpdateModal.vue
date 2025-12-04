<template>
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="modelValue"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div
            class="w-[90%] max-w-md rounded-2xl bg-white shadow-lg overflow-hidden"
          >
            <!-- หัวข้อ + ไอคอนแจ้งเตือน -->
            <div class="px-6 pt-6 pb-4 text-center border-b border-slate-100">
              <div
                class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600"
              >
                <AlertCircle class="w-6 h-6" />
              </div>
  
              <h2 class="text-lg font-semibold text-sky-700">
                ยืนยันในการอัปเดตสถานะ
              </h2>
              <p class="mt-2 text-base font-semibold text-emerald-600">
                {{ questionText }}
              </p>
            </div>
  
            <!-- การ์ดรายละเอียด -->
            <div class="px-6 py-4">
              <div
                class="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 space-y-2"
              >
                <p class="flex items-start gap-2">
                  <FileText class="w-4 h-4 mt-0.5 text-sky-500" />
                  <span>
                    <span class="font-medium text-slate-900">หมายเลขงาน:</span>
                    {{ jobNo }}
                  </span>
                </p>
  
                <p class="flex items-start gap-2">
                  <MapPin class="w-4 h-4 mt-0.5 text-sky-500" />
                  <span>
                    <span class="font-medium text-slate-900">สถานที่:</span>
                    {{ place }}
                  </span>
                </p>
  
                <p v-if="room" class="flex items-start gap-2">
                  <DoorOpen class="w-4 h-4 mt-0.5 text-sky-500" />
                  <span>
                    <span class="font-medium text-slate-900">ห้อง:</span>
                    {{ room }}
                  </span>
                </p>
  
                <p class="flex items-start gap-2">
                  <CheckCircle2 class="w-4 h-4 mt-0.5 text-emerald-500" />
                  <span>
                    <span class="font-medium text-slate-900">
                      สถานะที่จะบันทึก:
                    </span>
                    {{ statusLabel }}
                  </span>
                </p>
  
                <p v-if="assignee" class="flex items-start gap-2">
                  <User class="w-4 h-4 mt-0.5 text-sky-500" />
                  <span>
                    <span class="font-medium text-slate-900">ผู้ดำเนินการ:</span>
                    {{ assignee }}
                  </span>
                </p>
  
                <p v-if="updatedAt" class="flex items-start gap-2">
                  <Clock3 class="w-4 h-4 mt-0.5 text-sky-500" />
                  <span>
                    <span class="font-medium text-slate-900">เวลาอัปเดต:</span>
                    {{ updatedAt }}
                  </span>
                </p>
              </div>
            </div>
  
            <!-- ปุ่มกด -->
            <div class="flex justify-center gap-3 px-6 pb-5 pt-2">
              <button
                type="button"
                class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50"
                @click="onCancel"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                class="rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 shadow-sm flex items-center gap-1.5"
                @click="onConfirm"
              >
                <Save class="w-4 h-4" />
                <span>ยืนยันบันทึกสถานะ</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import {
    AlertCircle,
    FileText,
    MapPin,
    DoorOpen,
    User,
    Clock3,
    CheckCircle2,
    Save
  } from 'lucide-vue-next'
  
  const props = defineProps<{
    modelValue: boolean
  
    jobNo?: string
    place?: string
    room?: string
    statusLabel?: string
    assignee?: string
    updatedAt?: string
    questionText?: string
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm'): void
    (e: 'cancel'): void
  }>()
  
  const onCancel = () => {
    emit('cancel')
    emit('update:modelValue', false)
  }
  
  const onConfirm = () => {
    emit('confirm')
    emit('update:modelValue', false)
  }
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  