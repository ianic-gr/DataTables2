import { inject } from "vue";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useDatatablesStore } from "@/stores/DatatablesStore";

export function useTableState() {
  const { getCurrentTable } = useDatatablesStore();

  const table_props = inject("table_props");

  const tableState = computed(() => getCurrentTable(table_props.id));
  const searchState = computed(() => {
    return tableState.value.search?.query;
  });

  const headersState = computed(() => {
    if (!table_props?.headers.length) return null;

    console.log(table_props.headers.length);

    const selected = tableState.value.options?.columns.selected ?? [];
    const sorted = tableState.value.options?.columns.sorted ?? [];

    const keys = sorted.filter((item) => selected.includes(item));

    return keys.map((key) =>
      table_props.headers.find((header) => header.key === key)
    );
  });

  const advancedFiltersState = computed(() => {
    return tableState.value.advancedFilters?.query;
  });

  return { tableState, searchState, advancedFiltersState, headersState };
}
