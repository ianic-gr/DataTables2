<script setup>
import { useDatatablesStore } from "@/stores/DatatablesStore";

const datatablesStore = useDatatablesStore();
const { setData } = datatablesStore;

const hardFiltersData = ref({});

const table_props = inject("table_props");

const save = () => {
  const query = Object.entries(hardFiltersData.value)
    .filter(([, value]) => {
      if (Array.isArray(value) || typeof value === "string") {
        return value.length > 0;
      }
      return value !== null && value !== undefined && value !== "";
    })
    .reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {});

  setData({
    table_id: table_props.id,
    name: "hardFilters",
    value: { query },
  });
};
</script>

<template>
  <DatatablesHeaderHardFiltersSelected v-model="hardFiltersData" @save="save" />
</template>
