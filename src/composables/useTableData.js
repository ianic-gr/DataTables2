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

    if (!filters || Object.keys(filters).length === 0) return filteredItems;

    Object.keys(filters).forEach((key) => {
      const filterValue = filters[key].value;
      const filterComparison = filters[key]?.comparison ?? "=";
      const header = table_props.headers.find((h) => {
        const headerKey = h.advancedFilter?.key ?? h.key;
        return headerKey === key;
      });

      if (filterValue) {
        filteredItems = filteredItems.filter((item) => {
          let resultFilter = true;
          if (!header) return resultFilter;

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

          console.log(value);

          switch (header.advancedFilter?.component) {
            case "datepicker":
              resultFilter = filterDateRange(value, filterValue);
              break;

            case "comparison":
              resultFilter = compareValues(
                Number(value),
                Number(filterValue),
                filterComparison
              );
              break;

            default:
              if (Array.isArray(filterValue)) {
                resultFilter = filterValue
                  .map((filter) => filter.toString().toLowerCase())
                  .includes(value.toString().toLowerCase());
              } else {
                resultFilter = value
                  ?.toString()
                  .toLowerCase()
                  .includes(filterValue.toString().toLowerCase());
              }

              break;
          }

          return resultFilter;
        });
      }
    });

    return filteredItems;
  });

  const filterDateRange = (value, filterValue) => {
    const items = Array.isArray(filterValue) ? filterValue : [filterValue];
    const start = moment(items[0])
      .startOf("day")
      .isSameOrBefore(moment(value).format());
    const end = moment(items[items.length - 1])
      .endOf("day")
      .isSameOrAfter(moment(value).format());

    return start && end;
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
