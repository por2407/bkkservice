<template>
  <div class="mt-2 flex items-center justify-between">
    <p class="text-[11px] text-secondary-500">แตะเพื่อดูตำแหน่งของช่างบนแผนที่</p>
    <button type="button"
      class="inline-flex items-center gap-1 rounded-full bg-primary-500 px-2.5 py-1 text-[11px] font-medium text-white shadow-sm active:scale-95"
      @click.stop="openStaffLocationModal">
      <MapPin class="h-3.5 w-3.5 text-white" />
      <span>ดูตำแหน่ง</span>
    </button>
  </div>

  <!--(Google Maps JS API) -->
  <ResponsiveModal :model-value="staffLocationModalOpen" @update:model-value="closeStaffLocationModal">
    <div class="relative w-full rounded-t-3xl bg-white p-5 pb-5 shadow-lg">
      <div class="h-[70vh] w-full max-w-md rounded-t-3xl bg-white shadow-lg sm:h-[70vh] sm:rounded-2xl">
        <!-- header -->
        <div class="flex items-center justify-between px-4 pt-3 pb-2">
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
              <MapPin class="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <p class="text-sm font-semibold text-secondary-900">
                ตำแหน่งช่าง (เรียลไทม์)
              </p>
              <p class="text-[11px] text-secondary-500">
                {{ staffLocationTimeLabel }}
              </p>
            </div>
          </div>

          <button type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-100 text-secondary-500"
            @click="closeStaffLocationModal">
            <X class="h-4 w-4" />
          </button>
        </div>

        <div class="h-[1px] bg-secondary-100"></div>

        <!-- container ของ Google Map -->
        <div class="h-[calc(100%-49px)] w-full">
          <div ref="mapContainer" class="h-full w-full"></div>
        </div>
      </div>
    </div>
  </ResponsiveModal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { MapPin, X } from "lucide-vue-next";
import ResponsiveModal from "../../../share/ResponsiveModal.vue";

/* ---------- type ---------- */

interface StaffLocation {
  lat: number;
  lng: number;
  updatedAt: string;
}

/* ---------- state ตำแหน่งช่าง ---------- */

const staffLocation = ref<StaffLocation>({
  lat: 13.7563,
  lng: 100.5018,
  updatedAt: new Date().toISOString(),
});

const staffLocationModalOpen = ref(false);

/* helper format เวลา (ถ้ามี util ของโปรเจกต์อยู่แล้ว สามารถเปลี่ยนมาใช้ของเดิมได้) */
const formatUpdatedAt = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const staffLocationTimeLabel = computed(
  () => `อัปเดตล่าสุด ${formatUpdatedAt(staffLocation.value.updatedAt)}`
);

/* ---------- map refs ---------- */

const mapContainer = ref<HTMLDivElement | null>(null);
const mapInstance = ref<any>(null);
const staffMarker = ref<any>(null);

let googleMapsLoading: Promise<void> | null = null;

/* ---------- เปิด/ปิด modal ---------- */

const openStaffLocationModal = () => {
  staffLocationModalOpen.value = true;
};

const closeStaffLocationModal = () => {
  staffLocationModalOpen.value = false;

  // reset map เพื่อไม่ให้มีปัญหาเปิด-ปิดแล้วไม่ขึ้น
  if (staffMarker.value) {
    staffMarker.value.setMap(null);
    staffMarker.value = null;
  }
  if (mapInstance.value) {
    mapInstance.value = null;
  }
};

/* ---------- โหลด Google Maps JS API ---------- */

const loadGoogleMaps = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();

  const g = (window as any).google;
  if (g && g.maps) {
    return Promise.resolve();
  }

  if (!googleMapsLoading) {
    googleMapsLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAgf48aWg9fr48mzGvoJqKSsNINYzBhdRQ&language=th&region=TH";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Google Maps JavaScript API failed to load"));
      document.head.appendChild(script);
    });
  }

  return googleMapsLoading;
};

/* ---------- init map (ปรับ UI ให้โล่ง / function น้อย) ---------- */

const initMap = async () => {
  if (!mapContainer.value) return;

  await loadGoogleMaps();

  const g = (window as any).google;
  if (!g || !g.maps) return;

  const { lat, lng } = staffLocation.value;

  if (!mapInstance.value) {
    mapInstance.value = new g.maps.Map(mapContainer.value, {
      center: { lat, lng },
      zoom: 13, // ซูมออกให้เห็นบริเวณกว้าง คล้ายรูปตัวอย่าง
      disableDefaultUI: true, // ตัด UI มาตรฐานออกให้เรียบ
      zoomControl: true, // เหลือแค่ปุ่มซูม
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      gestureHandling: "greedy",
    });

    staffMarker.value = new g.maps.Marker({
      position: { lat, lng },
      map: mapInstance.value,
      title: "ตำแหน่งช่าง",
    });
  } else {
    mapInstance.value.setCenter({ lat, lng });
    if (staffMarker.value) {
      staffMarker.value.setPosition({ lat, lng });
    }
  }
};

/* ---------- watch เปิด modal แล้วค่อย init map ---------- */

watch(staffLocationModalOpen, async (open) => {
  if (open) {
    await nextTick();
    await initMap();
  }
});

/* ---------- watch ตำแหน่งเปลี่ยนแล้วอัปเดต marker ---------- */

watch(
  staffLocation,
  (loc) => {
    if (!mapInstance.value || !staffMarker.value || !loc) return;
    const pos = { lat: loc.lat, lng: loc.lng };
    staffMarker.value.setPosition(pos);
    mapInstance.value.setCenter(pos);
  },
  { deep: true }
);
</script>

<style scoped></style>