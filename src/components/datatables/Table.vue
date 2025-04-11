<script setup>
import { useTableState } from "@/composables/useTableState";
import { useTableData } from "@/composables/useTableData";
import { CellRender } from "@/utils/cellRender";

const { tableState, searchState, headersState, saveTableOptions } =
  useTableState();
const { filteredData } = useTableData();

const table_props = inject("table_props");

const model = defineModel();

const datatable = ref(null);

const getSlotItem = (header) => {
  return !header?.lock ? `item.${header.key}` : null;
};

const getItemsForPrint = async () => {
  return filteredData.value;
};

defineExpose({ getItemsForPrint });
</script>

<template>
  <v-data-table
    ref="datatable"
    v-model="model"
    color="primary"
    show-select
    :items="filteredData"
    :headers="headersState"
    :loading="table_props.loading"
    v-bind="{ ...table_props.options, ...tableState.options.state }"
    :search="searchState"
    @update:options="saveTableOptions"
  >
    <template #loading>
      <v-skeleton-loader type="table-row@10" />
    </template>

    <template
      v-for="(header, i) in headersState"
      #[getSlotItem(header)]="{ item, internalItem, value, column }"
      :key="i"
    >
      <div :class="column.cellClass">
        <CellRender
          v-if="column?.cell"
          :render="column.cell({ item, internalItem, value, column })"
          :params="{ item, internalItem, value, column }"
        />
        <span v-else>
          {{ String(value).length || String(value) === "0" ? value : "-" }}
        </span>
      </div>
    </template>

    <template #expanded-row="{ columns, item }">
      <tr class="expandable-row">
        <td class="expandable-row--column" :colspan="columns.length">
          <component
            :is="table_props.options.expandedRowRenderer"
            v-if="table_props.options.expandedRowRenderer"
            :params="{ columns, item }"
          />
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<style lang="scss">
th.v-data-table__td.v-data-table__th {
  background-color: #f5f5f5;
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
