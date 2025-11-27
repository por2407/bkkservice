import { computed, ref, watch } from "vue";
import type { Task, FilterKey } from "@/types/task";
import { taskApi } from "@/services/task.api";

// style ของแต่ละ filter
export const filterStyles: Record<FilterKey, string> = {
  all: "bg-blue-400 text-white shadow-sm ring-1 ring-white/60",
  in_progress: "bg-amber-400 text-white shadow-sm ring-1 ring-white/60",
  done: "bg-emerald-400 text-white shadow-sm ring-1 ring-white/60",
};

const VISIBLE_BATCH_SIZE = 50; // แสดงทีละกี่รายการ

export function useTaskList() {
  const selectedFilter = ref<FilterKey>("in_progress");
  const searchQuery = ref("");
  const debouncedSearch = ref("");
  const visibleLimit = ref(VISIBLE_BATCH_SIZE);

  let searchTimer: ReturnType<typeof setTimeout> | null = null;

  // ดึง list (SSR + cache + refresh ได้)
  const {
    data: allTasks,
    pending: loading,
    error,
    refresh,
  } = useAsyncData<Task[]>(
    "task-list",
    () => taskApi.getList(),
    { default: () => [] }
  );

  // debounce search (ลดการคำนวณทุก key)
  watch(
    searchQuery,
    (val) => {
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        debouncedSearch.value = val;
      }, 200); // 200ms
    },
    { immediate: true }
  );

  // เวลาเปลี่ยน filter หรือคำค้น -> reset จำนวนที่แสดง
  watch([selectedFilter, debouncedSearch], () => {
    visibleLimit.value = VISIBLE_BATCH_SIZE;
  });

  // group ตาม status ครั้งเดียว ใช้ร่วมกันทั้ง count + filter
  const groupedTasks = computed(() => {
    const result: Record<FilterKey, Task[]> = {
      all: [],
      in_progress: [],
      done: [],
    };

    for (const t of allTasks.value) {
      result.all.push(t);
      if (t.status === "in_progress") result.in_progress.push(t);
      if (t.status === "done") result.done.push(t);
    }

    return result;
  });

  // filter ตาม status + search
  const filteredTasks = computed(() => {
    const base =
      selectedFilter.value === "all"
        ? groupedTasks.value.all
        : groupedTasks.value[selectedFilter.value];

    const q = debouncedSearch.value.trim().toLowerCase();
    if (!q) return base;

    return base.filter((t) => {
      const ticket = t.ticket?.toLowerCase() ?? "";
      const room = t.room?.toLowerCase() ?? "";
      const desc = t.description?.toLowerCase() ?? "";
      return ticket.includes(q) || room.includes(q) || desc.includes(q);
    });
  });

  // แสดงเฉพาะบางส่วน เพื่อลด DOM ที่ต้อง render
  const visibleTasks = computed(() =>
    filteredTasks.value.slice(0, visibleLimit.value)
  );

  const canLoadMore = computed(
    () => visibleLimit.value < filteredTasks.value.length
  );

  const loadMore = () => {
    visibleLimit.value += VISIBLE_BATCH_SIZE;
  };

  // count ต่าง ๆ ใช้จาก groupedTasks (ไม่ filter ซ้ำ)
  const totalTasks = computed(() => groupedTasks.value.all.length);
  const inProgressCount = computed(
    () => groupedTasks.value.in_progress.length
  );
  const doneCount = computed(() => groupedTasks.value.done.length);

  const pageBgClass = computed(() => {
    switch (selectedFilter.value) {
      // case "all":
      //   return "bg-blue-50";
      // case "in_progress":
      //   return "bg-amber-50";
      // case "done":
      //   return "bg-emerald-50";
      default:
        return "bg-slate-50";
    }
  });

  return {
    // state
    selectedFilter,
    searchQuery,

    // data / computed
    allTasks,
    filteredTasks, // ทั้งหมดที่ match filter + search
    visibleTasks, // ชุดที่เอาไป render จริง (limit ตาม visibleLimit)
    totalTasks,
    inProgressCount,
    doneCount,
    pageBgClass,
    filterStyles,

    // paging
    canLoadMore,
    loadMore,

    // async state
    loading,
    error,
    refresh,
  };
}