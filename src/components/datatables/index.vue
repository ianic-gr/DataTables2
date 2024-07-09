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
const query = ref({
  search: "",
  advancedFilters: {},
  hardFilters: [],
  options: {},
  columns: {},
});

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

  if (tableData) {
    restoreData({ table_id: props.id, data: tableData });
  }

  const searchRecord = tableDataState.value.search?.query;

  if (searchRecord?.length) {
    query.value.search = searchRecord;
  }

  const advancedFiltersRecord = tableDataState.value.advancedFilters?.query;

  if (Object.keys(advancedFiltersRecord)?.length) {
    query.value.advancedFilters = advancedFiltersRecord;
  }

  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("s")) {
    query.value.search = urlParams.get("s");
  }

  const hardFiltersRecord = tableDataState.value.hardFilters?.query;

  if (Object.keys(hardFiltersRecord)?.length) {
    query.value.hardFilters = hardFiltersRecord;
  }

  const optionsRecord = tableDataState.value.options?.query;

  if (Object.keys(optionsRecord)?.length) {
    query.value.options = optionsRecord;
  }

  const columnsRecord = tableDataState.value.options?.columns;

  if (Object.keys(columnsRecord)?.length) {
    query.value.columns = columnsRecord;
  }

  init.value = true;
});
</script>

<template>
  <v-locale-provider :locale="props.locale">
    <Table
      v-if="init"
      ref="table"
      :id="id"
      :api="api"
      :data="data"
      :options="options"
      :query="query"
      :params="params"
      :hardFilters="hardFilters"
      :headers="headers"
      :loadingData="loadingData"
      :locale="locale"
      :title="title"
      :key="`${id}-${key}`"
      @forceRefresh="forceRefresh"
      @getData="$emit('getData')"
      @rowData="(data) => $emit('rowData', data)"
      @advancedFiltersChange="advancedFiltersChange"
    />
  </v-locale-provider>
</template>
