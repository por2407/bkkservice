import { defineStore } from "pinia";
import type { TaskBase } from "@/types/task";

export const useTaskStore = defineStore("task", {
  state: () => ({
    list: null as TaskBase | null,
  }),
  getters: {
    getItem: (s) => s.list,
  },
  actions: {
    setList(tasks: TaskBase) {
      this.list = {
        id: tasks.id ?? null,
        ticket: tasks.ticket,
        room: tasks.room,
        description: tasks.description,
        status: tasks.status,
        updatedAt: tasks.updatedAt,
        canRate: tasks.canRate,
        rating: tasks.rating,
        currentStep: tasks.currentStep,
        media: tasks.media,
      };

      // console.log(JSON.stringify(this.list, null, 2));
    },
  },
});
