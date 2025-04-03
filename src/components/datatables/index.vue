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
  // Only update if the options have actually changed
  if (JSON.stringify(userOptions) !== JSON.stringify(storeOptions.state.value)) {
    setUserOptions(userOptions);

    // Prevent infinite loop
    if (tableKey.value < 99) {
      emit("refreshTable");
      await nextTick();
      tableKey.value++;
    }
  }
};

const refetchData = (userOptions = {}) => {
  // Only update if the options have actually changed
  if (JSON.stringify(userOptions) !== JSON.stringify(storeOptions.state.value)) {
    setUserOptions(userOptions);

    if (table.value.tableRef.hasOwnProperty("reloadItems")) {
      table.value.tableRef.reloadItems(storeOptions.state.value);
      emit("refetchData");
    }
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
