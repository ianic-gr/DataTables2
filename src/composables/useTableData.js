import { inject } from "vue";
import { useDatatablesStore } from "@/stores/DatatablesStore";
import { useTableState } from "@/composables/useTableState";

export function useTableData() {
  const { getCurrentTable } = useDatatablesStore();
  const { advancedFiltersState, hardFiltersState, headersState } =
    useTableState();

  const table_props = inject("table_props");
  const tableData = ref();

  const filteredData = computed(() => {
    const hardFilters = Object.values(hardFiltersState.value)
      .filter((filter) => filter.args)
      .map((filter) => filter.args)
      .reduce((acc, obj) => ({ ...acc, ...obj }), {});

    const filters = { ...advancedFiltersState.value, ...hardFilters };
    let filteredItems = tableData.value;

    if (!filters) return filteredItems;

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        filteredItems = filteredItems.filter((item) => {
          const value = key
            .split(".")
            .reduce((acc, key) => acc && acc[key], item);

          if (typeof value === "number") {
            return value == filters[key];
          } else {
            if (Array.isArray(filters[key])) {
              return filters[key]
                .map((filter) => filter.toLowerCase())
                .includes(value.toLowerCase());
            }

            return value?.toLowerCase().includes(filters[key].toLowerCase());
          }
        });
      }
    });

    return filteredItems;
  });

  watch(
    () => table_props.data,
    async (newValue, oldValue) => {
      const data = newValue ?? [];
      const oldData = oldValue ?? [];

      if (JSON.stringify(data) !== JSON.stringify(oldData)) {
        tableData.value = newValue;
      }
    },
    { deep: true, immediate: true }
  );

  return { tableData, filteredData };
}
