import deepClone from "@/utils/deepClone";
import compareValues from "@/utils/compareValues";
import { useTableState } from "@/composables/useTableState";
import moment from "moment";
import { deepEqual } from "@/utils/deepEqual";

export function useTableData() {
  const { advancedFiltersState, hardFiltersState } = useTableState();
  const table_props = inject("table_props");
  const tableData = shallowRef();
  const filteredData = shallowRef();

  function filterDateRange(value, filterValue) {
    const items = Array.isArray(filterValue) ? filterValue : [filterValue];
    const start = moment(items[0]).startOf("day").isSameOrBefore(moment(value).format());
    const end = moment(items[items.length - 1])
      .endOf("day")
      .isSameOrAfter(moment(value).format());

    return start && end;
  }

  function filterByValue(value, filterValue) {
    if (Array.isArray(filterValue)) {
      return filterValue.map((f) => f.toString().toLowerCase()).includes(value.toString().toLowerCase());
    }

    return value?.toString().toLowerCase().includes(filterValue.toString().toLowerCase());
  }

  function applyFilter(value, filterValue, filterComparison, header) {
    switch (header.advancedFilter?.component) {
      case "datepicker":
        return filterDateRange(value, filterValue);

      case "comparison":
        return compareValues(Number(value), Number(filterValue), filterComparison);

      default:
        return filterByValue(value, filterValue);
    }
  }

  function mergeFilters(advancedFiltersState, hardFiltersState) {
    const hardFilters = Object.values(hardFiltersState)
      .filter((filter) => filter.args)
      .map((filter) => filter.args)
      .reduce((acc, obj) => ({ ...acc, ...obj }), {});

    return { ...advancedFiltersState, ...hardFilters };
  }

  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc && acc[key], obj);
  }

  function processItemData(item, key, header) {
    const itemsData = deepClone(item);

    const fn = header.advancedFilter?.filterReturnValue;
    if (typeof fn === "function") {
      itemsData[key] = fn({
        value: item[key],
        item,
      });
    }

    return getNestedValue(itemsData, key);
  }

  function findHeaderForKey(headers, key) {
    return headers.find((h) => {
      const headerKey = h.advancedFilter?.key ?? h.key;
      return headerKey === key;
    });
  }

  watch(
    () => [tableData.value, advancedFiltersState.value, hardFiltersState.value],
    () => {
      const items = deepClone(tableData.value);
      if (!items?.length) {
        filteredData.value = items;
        return;
      }

      const filters = mergeFilters(advancedFiltersState.value, hardFiltersState.value);
      if (!filters) {
        filteredData.value = items;
        return;
      }

      const activeFilters = Object.entries(filters).reduce((acc, [key, filter]) => {
        const { value: filterValue, comparison: filterComparison = "=" } = filter;
        if (!filterValue) return acc;

        const header = findHeaderForKey(table_props.headers, key);
        if (!header) return acc;

        const customFilterFn =
          typeof header.advancedFilter?.customFilterFn === "function" ? header.advancedFilter.customFilterFn : null;

        acc.push({ key, filterValue, filterComparison, header, customFilterFn });
        return acc;
      }, []);

      if (!activeFilters.length) {
        filteredData.value = items;
        return;
      }

      filteredData.value = items.filter((item) =>
        activeFilters.every(({ key, filterValue, filterComparison, header, customFilterFn }) => {
          const value = processItemData(item, key, header);

          return customFilterFn
            ? customFilterFn({ value, filterValue, filterComparison, header, item })
            : applyFilter(value, filterValue, filterComparison, header);
        }),
      );
    },
    { immediate: true, deep: true },
  );

  watch(
    () => table_props.data,
    (newValue, oldValue) => {
      const data = newValue ?? [];
      const oldData = oldValue ?? [];

      if (!deepEqual(data, oldData)) {
        tableData.value = newValue;
      }
    },
    { deep: true, immediate: true },
  );

  return { tableData, filteredData };
}
