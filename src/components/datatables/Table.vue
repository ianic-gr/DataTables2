<script setup>
import { useTableState } from "@/composables/useTableState";
import ActionButtons from "./cellRendererFrameworks/ActionButtons.vue";

const { searchState, advancedFiltersState } = useTableState();

const cellRendererFrameworks = { ActionButtons };

const loading = ref(false);
const table = ref(null);

const getSlotItem = (header) => (!header.lock ? `item.${header.key}` : null);

const table_props = inject("table_props");

const filteredData = computed(() => {
  const filters = advancedFiltersState.value;
  let filteredItems = table_props.data;

  if (!filters) return filteredItems;

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      filteredItems = filteredItems.filter((item) => {
        if (typeof item[key] === "number") {
          return item[key] == filters[key];
        } else {
          console.log("ssssss", item[key], item);
          return item[key].toLowerCase().includes(filters[key].toLowerCase());
        }
      });
    }
  });

  return filteredItems;
});

const tableHeaders = computed(() => {
  return table_props.headers.filter((header) => {
    return !header?.hidden;
  });
});

onMounted(() => {
  setTimeout(() => {
    console.log(table.value);
  }, 3000);
});
</script>

<template>
  <v-data-table
    ref="table"
    color="primary"
    show-select
    :items="filteredData"
    :headers="tableHeaders"
    :loading="loading"
    :search="searchState"
    v-bind="table_props.options"
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
          :is="cellRendererFrameworks[column.cellRendererFramework]"
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
  </v-data-table>
</template>

<style lang="scss">
th.v-data-table__td.v-data-table__th {
  background-color: #f5f5f5;
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
