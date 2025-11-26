<script setup>
import defu from "defu";
import { useTableState } from "@/composables/useTableState";
import { useDatatablesHooksStore } from "@/stores/DatatablesHooksStore";

const table_props = inject("table_props");
const datatablesPluginOptions = inject("datatablesPluginOptions");

const model = defineModel();

const { hardFiltersState } = useTableState();
const { registerHook } = useDatatablesHooksStore();

const selected = ref([]);

const emit = defineEmits(["save"]);
const busEmits = inject("busEmits");

const tableOptions = computed(() => defu(table_props.options, datatablesPluginOptions.options));

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
  <v-sheet>
    <v-chip-group v-model="selected" :selected-class="`text-${tableOptions.color}`" :color="tableOptions.color" multiple>
      <v-chip v-for="(tag, key) in table_props.hardFilters" :key="key" class="my-0" v-bind="tag" density="comfortable" />
    </v-chip-group>
  </v-sheet>
</template>
