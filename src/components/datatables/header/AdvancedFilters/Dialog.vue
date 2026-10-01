<script setup lang="ts">
import { useDatatablesStore } from "@/stores/DatatablesStore";
import { useTableState } from "@/composables/useTableState";
import deepClone from "@/utils/deepClone";
import { deepEqual } from "@/utils/deepEqual";
import { useEventBus } from "@vueuse/core";

const table_props = inject<any>("table_props");
const busEmits = inject<any>("busEmits");

interface Props {
  showSelected: boolean;
}
defineProps<Props>();

const datatablesStore = useDatatablesStore();
const { advancedFiltersState } = useTableState();
const bus = useEventBus("advancedFilters");

const { setData } = datatablesStore;

const dialog = defineModel<boolean>({ required: true });

const advancedFiltersData = ref<Record<string, any>>({});

const save = () => {
  const newFilters = Object.entries(advancedFiltersData.value)
    .filter(([, filter]) => {
      const value = filter.value;

      if (Array.isArray(value) || typeof value === "string") {
        return value.length > 0;
      }

      return value !== null && value !== undefined && value !== "";
    })
    .reduce((result: any, [key, filter]) => {
      result[key] = filter;
      return result;
    }, {});

  // Only update if the filters have actually changed
  if (!deepEqual(newFilters, advancedFiltersState.value)) {
    setData({
      table_id: table_props.id,
      name: "advancedFilters",
      value: { query: deepClone(newFilters) },
    });

    busEmits("advancedFilters:update", newFilters);
  }

  dialog.value = false;
};

const listener = (event: string, payload: any) => {
  if (event === "save") {
    advancedFiltersData.value[payload.key] = { comparison: payload.comparison, value: payload.value };
    save();
  }
};

const unsubscribe = bus.on(listener as any);

onMounted(() => {
  advancedFiltersData.value = deepClone(advancedFiltersState.value);
});
onUnmounted(unsubscribe);
</script>

<template>
  <div>
    <v-dialog v-model="dialog" max-width="550" :retain-focus="false">
      <template #default="{ isActive }">
        <DatatablesHeaderAdvancedFiltersFields
          v-model="advancedFiltersData"
          @save="save"
          @close-dialog="isActive.value = false"
        />
      </template>
    </v-dialog>
    <DatatablesHeaderAdvancedFiltersSelected
      v-if="Object.keys(advancedFiltersState).length && showSelected"
      v-model="advancedFiltersData"
      @save="save"
    />
  </div>
</template>
