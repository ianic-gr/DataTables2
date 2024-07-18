<script setup>
import qs from "qs";
import { useFetch } from "@vueuse/core";
import { useTableState } from "@/composables/useTableState";
import { useTableData } from "@/composables/useTableData";
import { useCellRendererFrameworks } from "@/composables/useCellRendererFrameworks";

const { searchState, headersState, advancedFiltersState } = useTableState();
const { tableData } = useTableData();

const table_props = inject("table_props");

const model = defineModel();

const datatableServer = ref(null);
const loading = ref(false);
const itemsLength = ref(0);

const getSlotItem = (header) => {
  return !header.lock ? `item.${header.key}` : null;
};

const loadItems = async ({ page, itemsPerPage, sortBy, search }) => {
  loading.value = true;

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

  const { data } = await useFetch(`${url}${query}`, { ...options }).json();

  tableData.value = data.value.data;
  itemsLength.value = data.value.total;

  loading.value = false;
};

watch(advancedFiltersState, () => {
  const page = datatableServer.value.page;
  const itemsPerPage = datatableServer.value.itemsPerPage;
  const sortBy = datatableServer.value.sortBy;
  const search = datatableServer.value.search;

  loadItems({ page, itemsPerPage, sortBy, search });
});
</script>

<template>
  <v-data-table-server
    ref="datatableServer"
    v-model="model"
    color="primary"
    show-select
    :items="tableData"
    :items-length="itemsLength"
    :loading="loading"
    :search="searchState"
    v-bind="table_props.options"
    @update:options="loadItems"
    :headers="headersState"
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
