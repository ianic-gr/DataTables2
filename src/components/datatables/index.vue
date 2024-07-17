<script setup>
import { useDatatablesStore } from "@/stores/DatatablesStore";
import { useDatastate } from "@/composables/dataState";

const props = defineProps({
  id: {
    type: String,
    default: "default",
    required: true,
  },
  api: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Object,
    default: () => {},
  },
  params: {
    type: Object,
    default: () => {},
  },
  hardFilters: {
    type: Array,
    default: () => [],
  },
  headers: {
    type: Array,
    default: () => [],
  },
  loadingData: {
    type: Boolean,
    default: true,
  },
  locale: {
    type: String,
    default: "en",
  },
  title: {
    type: String,
    default: "",
  },
});

const datatablesStore = useDatatablesStore();
const { dataState, tableDataState } = useDatastate(props);
const { addTable, restoreData } = datatablesStore;

const emit = defineEmits(["advancedFiltersChange"]);

const init = ref(false);
const key = ref(0);

const forceRefresh = async (cb = () => {}) => {
  if (typeof cb === "function") {
    cb();
  }

  key.value++;
};

const advancedFiltersChange = async (data) => {
  emit("advancedFiltersChange", data);
};

onMounted(async () => {
  addTable({ table_id: props.id });

  const tableData = dataState.value?.find((table) => table.id === props.id);

  await nextTick();

  if (tableData) {
    restoreData({ table_id: props.id, data: tableData });
  } else {
    tableDataState.value.options.columns.selected = props.headers
      .filter((header) => !header.hidden)
      .map((header) => header.key);
    tableDataState.value.options.columns.sorted = props.headers.map(
      (header) => header.key
    );
  }

  init.value = true;
});

provide("table_props", props);
</script>

<template>
  <Blueprint
    v-if="init"
    ref="table"
    :id="id"
    :key="`${id}-${key}`"
    @forceRefresh="forceRefresh"
    @getData="$emit('getData')"
    @rowData="(data) => $emit('rowData', data)"
    @advancedFiltersChange="advancedFiltersChange"
  />
</template>
