<template>
  <div class="service-map-web">
    <!-- Trigger Button -->
    <button 
      type="button"
      class="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-600 active:scale-[0.98]"
      @click="openStaffLocationModal"
    >
      <MapPin class="h-4 w-4" />
      <span>ดูตำแหน่งช่าง</span>
    </button>

    <!-- Google Maps Modal (Web) -->
    <ResponsiveModal :model-value="staffLocationModalOpen" @update:model-value="closeStaffLocationModal">
      <div class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <!-- Header -->
        <div class="mb-5 flex items-center justify-between border-b border-secondary-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
              <MapPin class="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-secondary-900">ตำแหน่งช่างบริการ</h2>
              <p class="text-xs text-secondary-500">ติดตามตำแหน่งช่างแบบ Real-time</p>
            </div>
          </div>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-100 text-secondary-500 transition hover:bg-secondary-200"
            @click="closeStaffLocationModal"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingLocations" class="flex flex-col items-center justify-center py-16">
          <Loader2 class="h-10 w-10 animate-spin text-primary-500" />
          <p class="mt-3 text-sm text-secondary-500">กำลังโหลดข้อมูลตำแหน่ง...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="flex flex-col items-center justify-center py-16">
          <MapPinOff class="h-12 w-12 text-error-400" />
          <p class="mt-3 text-sm text-error-600">{{ loadError }}</p>
          <button 
            type="button" 
            class="btn-secondary mt-4 !w-auto !min-h-0 !py-2 !px-5 text-sm"
            @click="fetchLocations"
          >
            ลองใหม่
          </button>
        </div>

        <!-- No Data State -->
        <div v-else-if="!locations" class="flex flex-col items-center justify-center py-16">
          <MapPinOff class="h-12 w-12 text-secondary-300" />
          <p class="mt-3 text-sm text-secondary-500">ไม่พบข้อมูลตำแหน่งของช่าง</p>
        </div>

        <!-- Map Display -->
        <div v-else class="flex gap-4">
          <!-- Map Area -->
          <div class="flex-1">
            <!-- Selected Employee Info -->
            <div v-if="selectedLocation" class="mb-3 rounded-xl border border-primary-200 bg-primary-50/70 p-3">
              <div class="flex items-center gap-3">
                <img 
                  :src="selectedLocation.photoUrl" 
                  :alt="selectedLocation.username"
                  class="h-12 w-12 rounded-full border-2 border-primary-400 object-cover"
                  @error="handleImageError"
                />
                <div class="flex-1">
                  <p class="text-sm font-semibold text-secondary-900">{{ selectedLocation.username }}</p>
                  <p class="text-xs text-secondary-500">รหัสพนักงาน: {{ selectedLocation.usercode }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[11px] text-secondary-400">อัปเดตล่าสุด</p>
                  <p class="text-sm font-medium text-primary-700">{{ formatDate(selectedLocation.userdate) }}</p>
                </div>
              </div>
            </div>

            <!-- Google Map -->
            <GoogleMap 
              :locations="locations" 
              height="380px"
              @marker-click="handleMarkerClick"
            />
          </div>
        </div>
      </div>
    </ResponsiveModal>
  </div>
</template>

<script setup lang="ts">
import { MapPin, X, Loader2, MapPinOff, Navigation, Clock } from "lucide-vue-next";
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
      year: "numeric",
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
  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff`;
};
</script>

<style scoped>
.service-map-web {
  @apply inline-block;
}
</style>
