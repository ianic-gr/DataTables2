<script setup>
import { useDatatablesHooksStore } from "@/stores/DatatablesHooksStore";
import { useUserState } from "@/composables/useUserState.ts";

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

const { triggerHook } = useDatatablesHooksStore();
const { storeOptions, setUserOptions } = useUserState();

const table = ref(null);
const tableKey = ref(0);

const refreshTable = async (userOptions = {}) => {
  setUserOptions(userOptions);

  // Prevent infinite loop
  if (tableKey.value < 99) {
    emit("refreshTable");

    await nextTick();
    tableKey.value++;
  }
};

const refetchData = (userOptions = {}) => {
  setUserOptions(userOptions);

  if (table.value.tableRef.hasOwnProperty("reloadItems")) {
    table.value.tableRef.reloadItems(storeOptions);
    emit("refetchData");
  }
};

const emit = defineEmits(["refreshTable", "refetchData"]);
defineExpose({ refreshTable, refetchData, triggerHook });

provide("table_props", props);
provide("triggerHook", triggerHook);
</script>

<template>
  <DatatablesBlueprint
    ref="table"
    :id="id"
    :key="`${id}-${tableKey}`"
    @getData="$emit('getData')"
    @rowData="(data) => $emit('rowData', data)"
    @refreshTable="refreshTable"
    @refetchData="refetchData"
  />
</template>
