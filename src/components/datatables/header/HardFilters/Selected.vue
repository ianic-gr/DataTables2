<script setup>
import { useTableState } from "@/composables/useTableState";

const table_props = inject("table_props");
const model = defineModel();

const { hardFiltersState } = useTableState();

const chipName = (tag, key) => {
  const header = table_props.headers.find((header) => header.key === key);

  return `${header.title}: ${tag}`;
};

const selected = ref([]);

const emit = defineEmits("save");

watch(selected, (arr) => {
  const selectedObj = {};
  arr.forEach((v) => {
    let filter = table_props.hardFilters?.[v] ?? null;

    if (isNaN(v)) {
      filter = table_props.hardFilters.find((hF) => hF.value === v);
    }

    selectedObj[v] = filter;
  });

  model.value = selectedObj;
  emit("save");
});

onMounted(() => {
  selected.value = Object.keys(hardFiltersState.value);

  if (!selected.value.length) {
    table_props.hardFilters.forEach((filter, key) => {
      if (filter.active) {
        selected.value.push(filter.value ?? key);
      }
    });
  }
});
</script>

<template>
  <v-sheet class="px-3">
    <v-chip-group v-model="selected" selected-class="text-primary" multiple>
      <v-chip
        class="my-0"
        v-for="(tag, key) in table_props.hardFilters"
        :key="key"
        v-bind="tag"
        density="comfortable"
      ></v-chip>
    </v-chip-group>
  </v-sheet>
</template>
