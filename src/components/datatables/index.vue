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
  loading: {
    type: Boolean,
    default: false,
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
const { dataStateGet, tableDataState, checkTableState } = useDatastate(props);

const { addTable, restoreData, setTableHash } = datatablesStore;
const busEmits = defineEmits(["refreshTable"]);

const init = ref(false);

onMounted(async () => {
  addTable({ table_id: props.id });

  await checkTableState();

  const tableData = dataStateGet();

  if (tableData) {
    restoreData({ table_id: props.id, data: tableData });
  } else {
    const columns = tableDataState.value.options.columns;

    columns.selected = props.headers
      .filter((header) => !header.hidden)
      .map((header) => header.key);

    columns.sorted = props.headers.map((header) => header.key);
  }

  await nextTick();

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
