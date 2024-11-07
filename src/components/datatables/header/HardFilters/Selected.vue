<script setup>
import { useTableState } from "@/composables/useTableState";
import { useDatatablesHooksStore } from "@/stores/DatatablesHooksStore";

const table_props = inject("table_props");
const model = defineModel();

const { hardFiltersState } = useTableState();
const { registerHook, triggerHook } = useDatatablesHooksStore();

const chipName = (tag, key) => {
  const header = table_props.headers.find((header) => header.key === key);

  return `${header.title}: ${tag}`;
};

const selected = ref([]);

const emit = defineEmits("save");
const busEmits = inject("busEmits");

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
  busEmits("hardFilters:update", { keys: arr, filters: selectedObj });
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

  registerHook("hardFilters:activate", activate);
  registerHook("hardFilters:deactivate", deactivate);
});

const activate = (key) => {
  const selectedFitlers = JSON.parse(JSON.stringify(selected.value));

  selectedFitlers.push(key);
  selected.value = selectedFitlers;
};

const deactivate = (key) => {
  const selectedFitlers = JSON.parse(JSON.stringify(selected.value));
  const filterIndex = selectedFitlers.findIndex((item) => item === key);

  if (filterIndex !== -1) {
    selectedFitlers.splice(filterIndex, 1);
    selected.value = selectedFitlers;
  }
};
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
