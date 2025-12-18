<template>
  <div class="mt-2 flex items-center justify-between">
    <p class="text-[11px] text-secondary-500">
      แตะเพื่อดูตำแหน่งของช่างบนแผนที่
    </p>
    <button
      type="button"
      class="inline-flex items-center gap-1 rounded-full bg-primary-500 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm active:scale-95"
      @click.stop="openStaffLocationModal"
    >
      <MapPin class="h-3.5 w-3.5 text-white" />
      <span>ดูตำแหน่ง</span>
    </button>
  </div>

  <!-- Google Maps Modal (Mobile) -->
  <ResponsiveModal
    :model-value="staffLocationModalOpen"
    @update:model-value="closeStaffLocationModal"
  >
    <div class="card-modal">
      <!-- Header -->
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100"
          >
            <MapPin class="h-4 w-4 text-primary-600" />
          </div>
          <h2 class="text-base font-semibold text-secondary-900">
            ตำแหน่งช่างบริการ
          </h2>
        </div>
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 text-secondary-500 active:bg-secondary-200"
          @click="closeStaffLocationModal"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoadingLocations"
        class="flex flex-col items-center justify-center py-12"
      >
        <Loader2 class="h-8 w-8 animate-spin text-primary-500" />
        <p class="mt-2 text-sm text-secondary-500">กำลังโหลดข้อมูลตำแหน่ง...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="loadError"
        class="flex flex-col items-center justify-center py-12"
      >
        <MapPinOff class="h-10 w-10 text-error-400" />
        <p class="mt-2 text-sm text-error-600">{{ loadError }}</p>
        <button
          type="button"
          class="btn-secondary mt-3 !w-auto !min-h-0 !py-1.5 !px-4 text-xs"
          @click="fetchLocations"
        >
          ลองใหม่
        </button>
      </div>

      <!-- No Data State -->
      <div
        v-else-if="!locations"
        class="flex flex-col items-center justify-center py-12"
      >
        <MapPinOff class="h-10 w-10 text-secondary-300" />
        <p class="mt-2 text-sm text-secondary-500">ไม่พบข้อมูลตำแหน่งของช่าง</p>
      </div>

      <!-- Map Display -->
      <template v-else>
        <!-- Employee Info Card -->
        <div
          v-if="selectedLocation"
          class="mb-3 rounded-2xl border border-primary-100 bg-primary-50/50 p-3"
        >
          <div class="flex items-center gap-3">
            <img
              :src="selectedLocation.photoUrl"
              :alt="selectedLocation.username"
              class="h-10 w-10 rounded-full border-2 border-primary-400 object-cover"
              @error="handleImageError"
            />
            <div class="flex-1">
              <p class="text-sm font-semibold text-secondary-900">
                {{ selectedLocation.username }}
              </p>
              <p class="text-xs text-secondary-500">
                รหัส: {{ selectedLocation.usercode }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-secondary-400">อัปเดตล่าสุด</p>
              <p class="text-xs text-secondary-600">
                {{ formatDate(selectedLocation.userdate) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Google Map -->
        <GoogleMap
          :locations="locations"
          height="280px"
          @marker-click="handleMarkerClick"
        />
      </template>
    </div>
  </ResponsiveModal>
</template>

<script setup lang="ts">
import { MapPin, X, Loader2, MapPinOff, Navigation } from "lucide-vue-next";
import ResponsiveModal from "../../../share/ResponsiveModal.vue";
import GoogleMap from "../../../share/GoogleMap.vue";
import { taskApi } from "@/services/task.api";
import type { EmployeeLocation } from "@/types/task";

const props = defineProps<{
  empCode: string;
}>();

const staffLocationModalOpen = ref(false);
const isLoadingLocations = ref(false);
const loadError = ref<string | null>(null);
const locations = ref<EmployeeLocation | null>(null);
const selectedLocation = ref<EmployeeLocation | null>(null);

/* ---------- Fetch Locations ---------- */
const fetchLocations = async () => {
  if (!props.empCode) {
    loadError.value = "ไม่พบรหัสช่าง";
    return;
  }

  try {
    isLoadingLocations.value = true;
    loadError.value = null;

    const result = await taskApi.getMapLocation(props.empCode);
    locations.value = result;

    // Auto-select first location
    if (result) {
      selectedLocation.value = result;
    }
  } catch (err) {
    loadError.value = "ไม่สามารถโหลดข้อมูลตำแหน่งได้";
    console.error("Error fetching locations:", err);
  } finally {
    isLoadingLocations.value = false;
  }
};

/* ---------- Open/Close Modal ---------- */
const openStaffLocationModal = () => {
  staffLocationModalOpen.value = true;
  fetchLocations();
};

const closeStaffLocationModal = () => {
  staffLocationModalOpen.value = false;
  // Reset state after modal closes
  setTimeout(() => {
    locations.value = null;
    selectedLocation.value = null;
    loadError.value = null;
  }, 300);
};

/* ---------- Handle Marker Click ---------- */
const handleMarkerClick = (location: EmployeeLocation) => {
  selectedLocation.value = location;
};

/* ---------- Select Location ---------- */
const selectLocation = (location: EmployeeLocation) => {
  selectedLocation.value = location;
};

/* ---------- Format Date ---------- */
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleString("th-TH", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

/* ---------- Handle Image Error ---------- */
const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  const name = target.alt || "User";
  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=059669&color=fff`;
};
</script>

<style scoped></style>
