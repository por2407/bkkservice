import { defineStore } from "pinia";
import type { FilterKey } from "@/types/task";

export const useTaskFilterStore = defineStore("taskFilter", {
    state: () => ({
      activeFilter: "in_progress" as FilterKey,
    }),
    actions: {
      setActiveFilter(type: FilterKey) {
        this.activeFilter = type;
      },
    },
  });