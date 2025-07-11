<script setup>
import defu from "defu";
import Table from "@/components/datatables/Table.vue";
import TableServer from "@/components/datatables/TableServer.vue";
import { useDatatablesStore } from "@/stores/DatatablesStore";
import { useDatastate } from "@/composables/dataState";
import { useUserState } from "@/composables/useUserState.ts";
import { useTableState } from "@/composables/useTableState";

const { storeOptions } = useUserState();
const { saveTableOptions } = useTableState();

const model = defineModel();
const table_props = inject("table_props");

const tableRef = ref(null);
const downloadModal = ref(false);
const blueprintInit = ref(false);
const tableInit = ref(false);

const busEmits = defineEmits([
  "refreshTable",
  "refetchData",
  "advancedFilters:update",
  "hardFilters:update",
]);

const datatablesStore = useDatatablesStore();
const { dataStateGet, tableDataState, checkTableState } =
  useDatastate(table_props);

const { addTable, restoreData } = datatablesStore;

const headerVisibility = computed(() => {
  const headerOption = table_props.options?.header;

  return (
    headerOption === undefined ||
    (typeof headerOption === "object" && headerOption !== null)
  );
});

onMounted(async () => {
  addTable({ table_id: table_props.id });

  await checkTableState();

  const tableData = dataStateGet();

  if (tableData) {
    restoreData({ table_id: table_props.id, data: tableData });
  } else {
    const options = tableDataState.value.options;
    const columns = options.columns;

    columns.selected = table_props.headers
      .filter((header) => !header.hidden)
      .map((header) => header.key);

    columns.sorted = table_props.headers.map((header) => header.key);
  }

  saveTableOptions(
    defu(storeOptions.state.value, tableDataState.value.options.state)
  );

  blueprintInit.value = true;

  await nextTick();
  tableInit.value = true;
});

provide("busEmits", busEmits);
provide("tableRef", tableRef);
provide("tableState", tableDataState);
provide("downloadModal", downloadModal);

defineExpose({ tableRef });
</script>

<template>
  <div v-if="blueprintInit" class="datatables-v2">
    <v-card>
      <v-card-title v-if="headerVisibility">
        <DatatablesHeader />
      </v-card-title>
      <v-card-text class="pa-0">
        <component
          :is="table_props.api ? TableServer : Table"
          v-if="tableInit"
          ref="tableRef"
          v-model="model"
        />
      </v-card-text>
    </v-card>

    <v-dialog v-model="downloadModal" max-width="350" persistent>
      <v-list class="py-2" color="primary" elevation="12" rounded="lg">
        <v-list-item
          prepend-icon="mdi-file-download"
          :title="$t('$datatables.preparing_download_file')"
        >
          <template #prepend>
            <div class="pe-4">
              <v-icon color="primary" size="x-large" />
            </div>
          </template>

          <template #append>
            <v-progress-circular
              color="primary"
              indeterminate="disable-shrink"
              size="16"
              width="2"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>
  </div>
</template>
