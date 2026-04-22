import { ref } from "vue";
import { defineStore } from "pinia";

export const useDatatablesHooksStore = defineStore("datatablesHooks", () => {
  const hooks = ref<Record<string, any>>({});

  const registerHook = (key: string, method: any) => {
    Object.assign(hooks.value, { [key]: method });
  };

  const triggerHook = (key: string, attrs: any) => {
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
