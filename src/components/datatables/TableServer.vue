<script setup>
import _ from "lodash";
import defu from "defu";
import { useTableState } from "@/composables/useTableState";
import { useTableData } from "@/composables/useTableData";
import { CellRender } from "@/utils/cellRender";
import { deepEqual } from "@/utils/deepEqual";
import deepClone from "@/utils/deepClone";

const { tableState, searchState, headersState, advancedFiltersState, hardFiltersState, saveTableOptions } = useTableState();
const { tableData } = useTableData();

const table_props = inject("table_props");
const datatablesPluginOptions = inject("datatablesPluginOptions");

const model = defineModel();

const datatableServer = ref(null);
const loading = ref(false);
const itemsLength = ref(0);

const tableOptions = computed(() => defu(table_props.options, datatablesPluginOptions.options));
const advancedFilters = computed(() => {
  return Object.fromEntries(
    Object.entries(deepClone(advancedFiltersState.value)).map(([key, filter]) => {
      const header = headersState.value.find((h) => h.key === key);

      if (
        Object.hasOwn(header?.advancedFilter ?? {}, "filterReturnValue") &&
        typeof header.advancedFilter.filterReturnValue === "function"
      ) {
        filter.value = header.advancedFilter.filterReturnValue({ value: filter.value });
      }

      return [key, filter];
    }),
  );
});

const returnObjectAttributes = computed(() => {
  return defu(table_props.api?.returnObjectAttributesMap ?? {}, {
    data: "data",
    total: "total",
  });
});

const getSlotItem = (header) => {
  return !header?.lock ? `item.${header.key}` : null;
};

const getItems = async ({ page, itemsPerPage, sortBy, search }) => {
  return await table_props.api.get({
    search,
    page,
    itemsPerPage,
    sortBy,
    advancedFilters: advancedFilters.value,
    hardFilters: hardFiltersState.value,
    headers: headersState.value,
  });
};

const getItemsForPrint = async () => {
  const sortBy = datatableServer.value.sortBy;
  const search = datatableServer.value.search;
  const { data: dataObjKey } = returnObjectAttributes.value;

  const data = await getItems({
    page: 1,
    itemsPerPage: -1,
    sortBy,
    search,
  });

  return _.get(data, dataObjKey);
};

const loadItems = async ({ page, itemsPerPage, sortBy, search }) => {
  loading.value = true;

  saveTableOptions({ page, itemsPerPage, sortBy, search });

  const { data: dataObjKey, total: totalObjKey } = returnObjectAttributes.value;
  const responseData = await getItems({ page, itemsPerPage, sortBy, search });

  if (!responseData) return;
  const data = responseData;

  tableData.value = _.get(data, dataObjKey);
  itemsLength.value = _.get(data, totalObjKey);

  loading.value = false;
};

const reloadItems = (userOptions = {}) => {
  if (!datatableServer.value) return;

  const page = datatableServer.value.page;
  const itemsPerPage = datatableServer.value.itemsPerPage;
  const sortBy = datatableServer.value.sortBy;
  const search = datatableServer.value.search;

  loadItems(defu(userOptions, { page, itemsPerPage, sortBy, search }));
};

onMounted(async () => {
  await nextTick();
  watch(
    [advancedFiltersState, hardFiltersState],
    (newValues, oldValues) => {
      const [newAdvanced, newHard] = newValues;
      const [oldAdvanced, oldHard] = oldValues;

      if (!deepEqual(newAdvanced, oldAdvanced) || !deepEqual(newHard, oldHard)) {
        reloadItems();
      }
    },
    { deep: true },
  );
});

defineExpose({ getItemsForPrint, reloadItems });
</script>

<template>
  <v-data-table-server
    ref="datatableServer"
    v-model="model"
    :loading="loading || table_props.loading"
    v-bind="{ ...tableOptions, ...tableState.options.state }"
    :headers="headersState"
    :items="tableData"
    :items-length="itemsLength"
    :search="searchState"
    @update:options="loadItems"
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
      <span v-else>
        {{ String(value).length || String(value) === "0" ? value : "-" }}
      </span>
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
  </v-data-table-server>
</template>
