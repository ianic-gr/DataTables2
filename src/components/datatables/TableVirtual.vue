<script setup lang="ts">
import defu from "defu";
import { useTableState } from "@/composables/useTableState";
import { useTableData } from "@/composables/useTableData";
import { CellRender } from "@/utils/cellRender";

const table_props = inject<any>("table_props");
const datatablesPluginOptions = inject<any>("datatablesPluginOptions");

const model = defineModel<string[]>({ default: () => [] });

const { tableState, searchState, headersState, saveTableOptions } = useTableState();
const { filteredData } = useTableData();

const datatable = useTemplateRef("datatable");

const tableOptions = computed(() => defu(table_props.options, datatablesPluginOptions.options));

const getSlotItem = (header: any) => {
  return !header?.lock ? `item.${header.key}` : null;
};

const getItemsForPrint = async () => {
  return filteredData.value;
};

defineExpose({ getItemsForPrint });
</script>

<template>
  <v-data-table-virtual
    ref="datatable"
    v-model="model"
    :loading="table_props.loading"
    v-bind="{ ...tableOptions, ...tableState.options.state }"
    :items="filteredData"
    :headers="headersState"
    :search="searchState"
    @update:options="saveTableOptions"
  >
    <template #loading>
      <v-skeleton-loader type="table-row@20" />
    </template>

    <template v-for="(header, i) in headersState" #[getSlotItem(header)]="{ item, internalItem, value, column }" :key="i">
      <CellRender
        v-if="column?.cell"
        :render="column.cell({ item, internalItem, value, column })"
        :params="{ item, internalItem, value, column }"
      />
      <template v-else>
        {{ String(value).length || String(value) === "0" ? value : "-" }}
      </template>
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

    <template #bottom>
      <v-divider />
      <div class="v-data-table-footer">
        <div class="v-data-table-footer__info" style="min-height: 61.5px">
          <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap">
            <div v-if="model?.length" class="dt-footer__stat">
              <span class="dt-footer__stat-value">{{ model?.length }} </span>
              <span class="dt-footer__stat-label">{{ $t("$datatables.virtual.selected") }}</span>
            </div>

            <div v-if="filteredData?.length !== table_props.data?.length" class="dt-footer__stat">
              <span class="dt-footer__stat-value">{{ filteredData?.length }} </span>
              <span class="dt-footer__stat-label">{{ $t("$datatables.virtual.filtered") }}</span>
            </div>

            <div class="dt-footer__stat">
              <span class="dt-footer__stat-value">{{ table_props.data?.length }} </span>
              <span class="dt-footer__stat-label">{{ $t("$datatables.virtual.total") }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </v-data-table-virtual>
</template>

<style scoped>
.dt-footer__stat {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}

.dt-footer__stat-value {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: rgba(var(--v-theme-on-surface), 0.87);
  letter-spacing: -0.02em;
}

.dt-footer__stat-label {
  font-weight: 400;
  color: rgba(var(--v-theme-on-surface), 0.45);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
