import { inject } from "vue";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useDatatablesStore } from "@/stores/DatatablesStore";

export function useTableState() {
  const { getCurrentTable } = useDatatablesStore();

  const table_props = inject("table_props");

  const tableState = computed(() => getCurrentTable(table_props.id));
  const searchState = computed(() => tableState.value.search?.query);
  const advancedFiltersState = computed(
    () => tableState.value.advancedFilters?.query
  );

  return { tableState, searchState, advancedFiltersState };
}
