<script setup>
import { useDatatablesStore } from "@/stores/DatatablesStore";
import ActionButtons from "./CellRendererFrameworks/ActionButtons.vue";

const datatablesStore = useDatatablesStore();
const { getCurrentTable } = datatablesStore;

const cellRendererFrameworks = { ActionButtons };

const props = defineProps({
  id: {
    type: String,
    default: "default",
    required: true,
  },
  api: {
    type: Object,
    default: () => {
      return {};
    },
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
  loadingData: {
    type: Boolean,
    default: true,
  },
});

const loading = ref(false);

const getSlotItem = (header) => (!header.lock ? `item.${header.key}` : null);

const tableState = computed(() => getCurrentTable(props.id));
const searchState = computed(() => tableState.value.search?.query);
const advancedFiltersState = computed(
  () => tableState.value.advancedFilters?.query
);

const filteredData = computed(() => {
  const filters = advancedFiltersState.value;
  let filteredItems = props.data;

  if (!filters) return filteredItems;

  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      filteredItems = filteredItems.filter((item) => {
        if (typeof item[key] === "number") {
          return item[key] == filters[key];
        } else {
          return item[key].toLowerCase().includes(filters[key].toLowerCase());
        }
      });
    }
  });

  return filteredItems;
});

provide("table_props", {
  props,
  tableState,
  searchState,
  advancedFiltersState,
});
</script>

<template>
  <v-card elevation="5">
    <v-card-title>
      <Header />
    </v-card-title>
    <v-card-text class="pa-0">
      <v-data-table
        color="primary"
        show-select
        :items="filteredData"
        :headers="headers"
        :loading="loading"
        :search="searchState"
      >
        <template v-slot:loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>

        <template
          v-for="(header, i) in headers"
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
              v-html="
                column.cellRenderer({ item, internalItem, value, column })
              "
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
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
th.v-data-table__td.v-data-table__th {
  background-color: #f5f5f5;
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
