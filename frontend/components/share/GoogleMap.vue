<template>
  <div class="google-map-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="map-loading">
      <div class="map-loading-spinner"></div>
      <p class="text-sm text-secondary-500 mt-2">กำลังโหลดแผนที่...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="map-error">
      <MapPinOff class="h-10 w-10 text-error-400 mb-2" />
      <p class="text-sm text-error-600">{{ error }}</p>
      <button
        type="button"
        class="btn-secondary mt-3 !w-auto !min-h-0 !py-1.5 !px-4 text-xs"
        @click="retryLoad"
      >
        ลองใหม่
      </button>
    </div>

    <!-- Map Container -->
    <div
      v-show="!isLoading && !error"
      ref="mapContainer"
      class="map-element"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { MapPinOff } from "lucide-vue-next";
import type { EmployeeLocation } from "@/types/task";

const props = defineProps<{
  locations: EmployeeLocation | null;
  height?: string;
}>();

const emit = defineEmits<{
  (e: "marker-click", location: EmployeeLocation): void;
}>();

const config = useRuntimeConfig();
const mapContainer = ref<HTMLDivElement | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const containerHeight = computed(() => props.height ?? "300px");

let map: any = null;
let markers: any[] = [];
let infoWindows: any[] = [];

// Load Google Maps Script
const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).google?.maps) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("ไม่สามารถโหลด Google Maps ได้"))
      );
      return;
    }

    // Create new script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAgf48aWg9fr48mzGvoJqKSsNINYzBhdRQ&language=th&region=TH`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error("ไม่สามารถโหลด Google Maps ได้"));

    document.head.appendChild(script);
  });
};

// Initialize map
const initMap = async () => {
  if (!mapContainer.value) return;

  try {
    isLoading.value = true;
    error.value = null;

    await loadGoogleMapsScript();

    const google = (window as any).google;

    // Default center (Bangkok)
    const defaultCenter = { lat: 13.7563, lng: 100.5018 };
    const center = props.locations
      ? { lat: props.locations.lat, lng: props.locations.lng }
      : defaultCenter;

    map = new google.maps.Map(mapContainer.value, {
      center,
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    addMarkers();
    isLoading.value = false;

    // Ensure proper sizing after becoming visible
    if (map && google?.maps) {
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    }
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดแผนที่";
    isLoading.value = false;
  }
};

// Add markers to map
const addMarkers = () => {
  if (!map) return;

  const google = (window as any).google;
  if (!google?.maps) return;

  // Clear existing markers
  clearMarkers();

  const bounds = new google.maps.LatLngBounds();

  if (props.locations) {
    const position = { lat: props.locations.lat, lng: props.locations.lng };
    bounds.extend(position);

    // Create custom marker with photo
    const marker = new google.maps.Marker({
      position,
      map,
      title: props.locations.username,
      icon: {
        url: "/images/markericon.png",
        scaledSize: new google.maps.Size(44, 44),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(22, 44),
      },
    });

    // Create info window content
    const infoContent = `
      <div style="padding: 8px; min-width: 180px; font-family: 'Noto Sans Thai', sans-serif;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <img 
            src="${props.locations.photoUrl}" 
            alt="${props.locations.username}"
            style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #059669;"
            onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(
              props.locations.username
            )}&background=059669&color=fff'"
          />
          <div>
            <p style="margin: 0; font-weight: 600; color: #1e293b; font-size: 14px;">${
              props.locations.username
            }</p>
            <p style="margin: 0; color: #64748b; font-size: 11px;">รหัส: ${
              props.locations.usercode
            }</p>
          </div>
        </div>
        <div style="background: #f1f5f9; border-radius: 8px; padding: 6px 10px; font-size: 11px; color: #475569;">
          <span style="display: flex; align-items: center; gap: 4px;">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="flex:0 0 auto;">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M8 14h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 18h.01"></path>
    <path d="M12 18h.01"></path>
    <path d="M16 18h.01"></path>
  </svg> อัปเดตล่าสุด: ${formatDate(props.locations.userdate)}
          </span>
        </div>
      </div>
    `;
    const infoWindow = new google.maps.InfoWindow({
      content: infoContent,
    });

    marker.addListener("click", () => {
      infoWindows.forEach((iw) => iw.close());
      infoWindow.open(map, marker);
      emit("marker-click", props.locations!);
    });

    markers.push(marker);
    infoWindows.push(infoWindow);

    map.fitBounds(bounds);
  }
};

// Clear all markers
const clearMarkers = () => {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  infoWindows.forEach((iw) => iw.close());
  infoWindows = [];
};

// Format date helper
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

// Retry loading
const retryLoad = () => {
  initMap();
};

// Watch for location changes
watch(
  () => props.locations,
  () => {
    if (map) {
      addMarkers();
    }
  },
  { deep: true }
);

// Initialize on mount
onMounted(() => {
  initMap();
});

// Cleanup on unmount
onUnmounted(() => {
  clearMarkers();
  map = null;
});
</script>

<style scoped>
.google-map-container {
  @apply relative w-full overflow-hidden rounded-2xl bg-secondary-100;
  height: v-bind(containerHeight);
}

.map-element {
  @apply h-full w-full;
}

.map-loading {
  @apply absolute inset-0 flex flex-col items-center justify-center bg-secondary-50;
}

.map-loading-spinner {
  @apply h-8 w-8 animate-spin rounded-full border-primary-200 border-t-primary-500;
  border-width: 3px;
}
.map-error {
  @apply absolute inset-0 flex flex-col items-center justify-center bg-secondary-50 px-4 text-center;
}
</style>
