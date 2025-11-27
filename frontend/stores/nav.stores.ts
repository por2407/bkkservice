import { defineStore } from "pinia";

export const useNavStore = defineStore("nav", {
  state: () => ({
    activeIndex: 0 as number,
  }),
  actions: {
    setActive(index: number) {
      this.activeIndex = index;
    },
  },
});
