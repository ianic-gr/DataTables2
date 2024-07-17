import { inject } from "vue";
import { useDatatablesStore } from "@/stores/DatatablesStore";
import { useTableState } from "@/composables/useTableState";

export function useTableData() {
  const { getCurrentTable } = useDatatablesStore();
  const { advancedFiltersState, headersState } = useTableState();

  const table_props = inject("table_props");

  const tableData = ref();

  const filteredData = computed(() => {
    const filters = advancedFiltersState.value;
    let filteredItems = tableData.value;

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

  const tableHeaders = computed(() => {
    return headersState.value.filter((header) => {
      return !header?.hidden;
    });
  });

  watch(
    table_props,
    (v) => {
      tableData.value = v.data;
    },
    { deep: true, immediate: true }
  );

  return { tableData, filteredData, tableHeaders };
}