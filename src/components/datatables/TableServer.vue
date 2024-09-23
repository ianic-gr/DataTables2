<script setup>
import defu from "defu";
import qs from "qs";
import { useFetch } from "@vueuse/core";
import { useTableState } from "@/composables/useTableState";
import { useTableData } from "@/composables/useTableData";
import { useCellRendererFrameworks } from "@/composables/useCellRendererFrameworks";

const {
  tableState,
  searchState,
  headersState,
  advancedFiltersState,
  saveTableOptions,
} = useTableState();
const { tableData } = useTableData();

const table_props = inject("table_props");

const model = defineModel();

const datatableServer = ref(null);
const loading = ref(false);
const itemsLength = ref(0);
const itemsPerPage = ref(null);

const getSlotItem = (header) => {
  return !header?.lock ? `item.${header.key}` : null;
};

const returnObjectAttributes = computed(() => {
  return defu(table_props.api?.returnObjectAttributesMap ?? {}, {
    data: "data",
    total: "total",
  });
});

const getItems = async ({ page, itemsPerPage, sortBy, search }) => {
  const { url, options } = table_props.api.get({
    search,
    page,
    itemsPerPage,
    sortBy,
    advancedFilters: advancedFiltersState.value,
  });

  let query = "";
  if (options.query) {
    query = `?${qs.stringify(options.query)}`;
  }

  return await useFetch(`${url}${query}`, { ...options }).json();
};

const getItemsForPrint = async () => {
  const sortBy = datatableServer.value.sortBy;
  const search = datatableServer.value.search;
  const { data: dataObjKey } = returnObjectAttributes.value;

  const { data } = await getItems({
    page: 1,
    itemsPerPage: -1,
    sortBy,
    search,
  });

  return data.value[dataObjKey];
};

const loadItems = async ({ page, itemsPerPage, sortBy, search }) => {
  loading.value = true;

  saveTableOptions({ page, itemsPerPage, sortBy, search });

  const { data: dataObjKey, total: totalObjKey } = returnObjectAttributes.value;
  const { data } = await getItems({ page, itemsPerPage, sortBy, search });

  tableData.value = data.value[dataObjKey];
  itemsLength.value = data.value[totalObjKey];

  loading.value = false;
};

watch(advancedFiltersState, () => {
  const page = datatableServer.value.page;
  const itemsPerPage = datatableServer.value.itemsPerPage;
  const sortBy = datatableServer.value.sortBy;
  const search = datatableServer.value.search;

  loadItems({ page, itemsPerPage, sortBy, search });
});

defineExpose({ getItemsForPrint });
</script>

<template>
  <v-data-table-server
    ref="datatableServer"
    v-model="model"
    color="primary"
    show-select
    :items="tableData"
    :items-length="itemsLength"
    :loading="loading || table_props.loading"
    :search="searchState"
    @update:options="loadItems"
    :headers="headersState"
    v-bind="{ ...table_props.options, ...tableState.options.state }"
  >
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>

    <template
      v-for="(header, i) in headersState"
      #[getSlotItem(header)]="{ item, internalItem, value, column }"
      :key="i"
    >
      <div :class="column.cellClass">
        <component
          v-if="column.cellRendererFramework"
          :is="
            typeof column.cellRendererFramework === 'string'
              ? useCellRendererFrameworks()[column.cellRendererFramework]
              : column.cellRendererFramework
          "
          :params="{ item, internalItem, value, column }"
          :cellRendererFrameworkParams="
            column.cellRendererFrameworkParams
              ? column.cellRendererFrameworkParams({
                  item,
                  internalItem,
                  value,
                  column,
                })
              : {}
          "
        />
        <span
          v-bind="
            column?.cellRendererParams
              ? column.cellRendererParams({ item, internalItem, value, column })
              : {}
          "
          v-else-if="column.cellRenderer"
          v-html="column.cellRenderer({ item, internalItem, value, column })"
        />
        <span v-else-if="column.valueFormatter">
          {{ column.valueFormatter({ item, internalItem, value, column }) }}
        </span>
        <span v-else>
          {{ String(value).length || String(value) === "0" ? value : "-" }}
        </span>
      </div>
    </template>

    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <component
            v-if="table_props.options.expandedRowRenderer"
            :is="table_props.options.expandedRowRenderer"
            :params="{ columns, item }"
          />
        </td>
      </tr>
    </template>
  </v-data-table-server>
</template>

<style lang="scss">
th.v-data-table__td.v-data-table__th {
  background-color: #f5f5f5;
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
