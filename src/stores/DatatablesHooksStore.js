// Utilities
import { ref } from "vue";
import { defineStore } from "pinia";

export const useDatatablesHooksStore = defineStore("datatablesHooks", () => {
  const hooks = ref({});

  const registerHook = (key, method) => {
    Object.assign(hooks.value, { [key]: method });
  };

  const triggerHook = (key, attrs) => {
    if (hooks.value.hasOwnProperty(key)) {
      hooks.value[key](attrs);
    }
  };

  return {
    hooks,
    registerHook,
    triggerHook,
  };
});
