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
    default: () => {
      return [];
    },
  },
  options: {
    type: Object,
    default: () => {
      return {};
    },
  },
  params: {
    type: Object,
    default: () => {
      return {};
    },
  },
  hardFilters: {
    type: Array,
    default: () => {
      return [];
    },
  },
  headers: {
    type: Array,
    default: () => {
      return [];
    },
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
const busEmits = defineEmits(["refreshTable"]);

const init = ref(false);

onMounted(async () => {
  addTable({ table_id: props.id });

  const tableData = dataState.value?.find((table) => table.id === props.id);

  await nextTick();

  if (tableData) {
    restoreData({ table_id: props.id, data: tableData });
  } else {
    const columns = tableDataState.value.options.columns;

    columns.selected = props.headers
      .filter((header) => !header.hidden)
      .map((header) => header.key);

    columns.sorted = props.headers.map((header) => header.key);
  }

  init.value = true;
});

provide("table_props", props);
provide("busEmits", busEmits);
</script>

<template>
  <Blueprint
    v-if="init"
    ref="table"
    :id="id"
    :key="id"
    @getData="$emit('getData')"
    @rowData="(data) => $emit('rowData', data)"
  />
</template>
