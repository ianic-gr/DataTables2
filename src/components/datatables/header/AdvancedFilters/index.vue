<script setup>
import { useDatatablesStore } from "@/stores/DatatablesStore";
import { useTableState } from "@/composables/useTableState";
import deepClone from "@/utils/deepClone";
import { deepEqual } from "@/utils/deepEqual";

const datatablesStore = useDatatablesStore();
const { advancedFiltersState } = useTableState();
const { setData } = datatablesStore;

const dialog = defineModel({ required: true });
const advancedFiltersData = ref({});

const table_props = inject("table_props");
const busEmits = inject("busEmits");

const save = () => {
  const newFilters = Object.entries(advancedFiltersData.value)
    .filter(([, filter]) => {
      const value = filter.value;
      if (Array.isArray(value) || typeof value === "string") {
        return value.length > 0;
      }
      return value !== null && value !== undefined && value !== "";
    })
    .reduce((result, [key, filter]) => {
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

onMounted(() => {
  advancedFiltersData.value = deepClone(advancedFiltersState.value);
});
</script>

<template>
  <div>
    <v-dialog v-model="dialog" max-width="550">
      <template #default="{ isActive }">
        <DatatablesHeaderAdvancedFiltersFields
          v-model="advancedFiltersData"
          @save="save"
          @close-dialog="isActive.value = false"
        />
      </template>
    </v-dialog>
    <DatatablesHeaderAdvancedFiltersSelected
      v-if="Object.keys(advancedFiltersState).length"
      v-model="advancedFiltersData"
      @save="save"
    />
  </div>
</template>
