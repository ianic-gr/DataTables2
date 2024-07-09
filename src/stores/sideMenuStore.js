// Utilities
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSideMenuStore = defineStore("sideMenuStore", () => {
  const menu = ref([]);

  return {
    menu,
  };
});
