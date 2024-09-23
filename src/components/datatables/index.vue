<script setup>
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

const table = ref(null);
const emit = defineEmits(["refreshTable", "refetchData"]);

const tableKey = ref(0);

const refreshTable = async () => {
  emit("refreshTable");

  await nextTick();
  tableKey.value++;
};

const refetchData = () => {
  if (table.value.tableRef.hasOwnProperty("reloadItems")) {
    table.value.tableRef.reloadItems();
  }
};

provide("table_props", props);
defineExpose({ refreshTable });
</script>

<template>
  <Blueprint
    ref="table"
    :id="id"
    :key="`${id}-${tableKey}`"
    @getData="$emit('getData')"
    @rowData="(data) => $emit('rowData', data)"
    @refreshTable="refreshTable"
    @refetchData="refetchData"
  />
</template>
