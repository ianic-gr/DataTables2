import deepClone from "@/utils/deepClone";
import compareValues from "@/utils/compareValues";
import { useTableState } from "@/composables/useTableState";
import moment from "moment";

export function useTableData() {
  const { advancedFiltersState, hardFiltersState } = useTableState();

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
      const filterValue = filters[key].value;
      const filterComparison = filters[key]?.comparison ?? "=";

      if (filterValue) {
        filteredItems = filteredItems.filter((item) => {
          const header = table_props.headers.find((h) => {
            const headerKey = h.advancedFilter?.key ?? h.key;
            return headerKey === key;
          });

          let itemsData = deepClone(item);

          if (
            Object.hasOwn(header, "filterReturnValue") &&
            typeof header.filterReturnValue === "function"
          ) {
            itemsData[key] = header.filterReturnValue({
              value: item[key],
              item,
            });
          }

          let value = key
            .split(".")
            .reduce((acc, key) => acc && acc[key], itemsData);

          if (header.advancedFilter?.component === "datepicker") {
            return filterDateRange(value, filterValue);
          }

          if (typeof value === "number") {
            return compareValues(value, filterValue, filterComparison);
          }

          if (typeof value === "string") {
            if (Array.isArray(filterValue)) {
              return filterValue
                .map((filter) => filter.toLowerCase())
                .includes(value.toLowerCase());
            }

            return value?.toLowerCase().includes(filterValue.toLowerCase());
          }
        });
      }
    });

    return filteredItems;
  });

  const filterDateRange = (value, filterValue) => {
    const items = Array.isArray(filterValue) ? filterValue : [filterValue];

    return (
      moment(items[0]).startOf("day").isSameOrBefore(moment(value).format()) &&
      moment(items[items.length - 1])
        .endOf("day")
        .isSameOrAfter(moment(value).format())
    );
  };

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
