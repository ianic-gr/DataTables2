<script setup>
import { useDatatablesHooksStore } from "@/stores/DatatablesHooksStore";
import { useUserState } from "@/composables/useUserState.ts";

const props = defineProps({
  id: {
    type: String,
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
    table.value.tableRef.reloadItems(storeOptions.state.value);
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
    :id="id"
    ref="table"
    :key="`${id}-${tableKey}`"
    @refresh-table="refreshTable"
    @refetch-data="refetchData"
  />
</template>

<style lang="scss">
th.v-data-table__td.v-data-table__th {
  background-color: #f5f5f5;
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

th.v-data-table__th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

td.v-data-table__td:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
