<script setup>
import qs from "qs";
import { useFetch } from "@vueuse/core";
import { useTableState } from "@/composables/useTableState";
import { useTableData } from "@/composables/useTableData";
import { useCellRendererFrameworks } from "@/composables/useCellRendererFrameworks";

const { searchState } = useTableState();
const { tableData, filteredData, tableHeaders } = useTableData();

const table_props = inject("table_props");

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
</script>

<template>
  <v-data-table-server
    color="primary"
    show-select
    :items="filteredData"
    :items-length="itemsLength"
    :headers="tableHeaders"
    :loading="loading"
    :search="searchState"
    v-bind="table_props.options"
    @update:options="loadItems"
  >
    <template v-slot:loading>
      <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
    </template>

    <template
      v-for="(header, i) in table_props.headers"
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
  </v-data-table-server>
</template>

<style lang="scss">
th.v-data-table__td.v-data-table__th {
  background-color: #f5f5f5;
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
