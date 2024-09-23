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

const emit = defineEmits(["refreshTable"]);

const tableKey = ref(0);

const refreshTable = async () => {
  emit("refreshTable");

  await nextTick();
  tableKey.value++;
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
  />
</template>
