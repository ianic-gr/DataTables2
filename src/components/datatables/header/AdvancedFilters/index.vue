<script setup>
import { useDatatablesStore } from "@/stores/DatatablesStore";
import { useTableState } from "@/composables/useTableState";
import deepClone from "@/utils/deepClone";

const datatablesStore = useDatatablesStore();
const { advancedFiltersState } = useTableState();
const { setData } = datatablesStore;

const dialog = ref(false);
const advancedFiltersData = ref({});

const table_props = inject("table_props");
const busEmits = inject("busEmits");

const save = () => {
  const newFilters = Object.entries(advancedFiltersData.value)
    .filter(([key, value]) => {
      if (Array.isArray(value) || typeof value === "string") {
        return value.length > 0;
      }
      return value !== null && value !== undefined && value !== "";
    })
    .reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {});

  // Only update if the filters have actually changed
  if (JSON.stringify(newFilters) !== JSON.stringify(advancedFiltersState.value)) {
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
  <v-dialog v-model="dialog" max-width="500">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="text"
        icon="mdi-filter-outline"
        density="comfortable"
      />
      <DatatablesHeaderAdvancedFiltersSelected
        v-if="Object.keys(advancedFiltersState).length"
        v-model="advancedFiltersData"
        @save="save"
      />
    </template>

    <template #default="{ isActive }">
      <DatatablesHeaderAdvancedFiltersFields
        v-model="advancedFiltersData"
        @save="save"
        @close-dialog="isActive.value = false"
      />
    </template>
  </v-dialog>
</template>
