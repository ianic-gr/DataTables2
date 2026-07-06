import compareValues from "@/utils/compareValues";
import { useTableState } from "@/composables/useTableState";
import { deepEqual } from "@/utils/deepEqual";

export function useTableData() {
  const { advancedFiltersState, hardFiltersState } = useTableState();
  const table_props = inject("table_props");
  const tableData = shallowRef();

  function filterDateRange(value, start, end) {
    const t = new Date(value).getTime();
    return t >= start && t <= end;
  }

  function filterByValue(value, filterValue) {
    if (Array.isArray(filterValue)) {
      return filterValue.map((f) => f.toString().toLowerCase()).includes(value?.toString().toLowerCase());
    }
    return value?.toString().toLowerCase().includes(filterValue.toString().toLowerCase());
  }

  function applyFilter(value, filterValue, filterComparison, header, dateBounds) {
    switch (header.advancedFilter?.component) {
      case "datepicker":
        return filterDateRange(value, dateBounds.start, dateBounds.end);
      case "comparison":
        return compareValues(Number(value), Number(filterValue), filterComparison);
      default:
        return filterByValue(value, filterValue);
    }
  }

  function mergeFilters(advanced, hard) {
    const hardFilters = {};
    for (const filter of Object.values(hard)) {
      if (filter.args) Object.assign(hardFilters, filter.args);
    }
    return { ...advanced, ...hardFilters };
  }

  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  function resolveFilterValue(item, key, header) {
    const raw = getNestedValue(item, key);
    const fn = header.advancedFilter?.filterReturnValue;
    return typeof fn === "function" ? fn({ value: raw, item }) : raw;
  }

  const headerMap = computed(() => {
    const map = new Map();
    for (const h of table_props.headers ?? []) {
      map.set(h.advancedFilter?.key ?? h.key, h);
    }
    return map;
  });

  const filteredData = computed(() => {
    const items = tableData.value;
    if (!items?.length) return [];

    const filters = mergeFilters(advancedFiltersState.value, hardFiltersState.value);
    const activeFilters = [];

    for (const [key, filter] of Object.entries(filters)) {
      const { value: filterValue, comparison: filterComparison = "=" } = filter;
      if (!filterValue) continue;

      const header = headerMap.value.get(key);
      if (!header) continue;

      let dateBounds = null;
      if (header.advancedFilter?.component === "datepicker") {
        const values = Array.isArray(filterValue) ? filterValue : [filterValue];
        dateBounds = {
          start: new Date(values[0]).setHours(0, 0, 0, 0),
          end: new Date(values[values.length - 1]).setHours(23, 59, 59, 999),
        };
      }

      const customFilterFn =
        typeof header.advancedFilter?.customFilterFn === "function" ? header.advancedFilter.customFilterFn : null;

      activeFilters.push({ key, filterValue, filterComparison, header, customFilterFn, dateBounds });
    }

    if (!activeFilters.length) return items;

    return items.filter((item) =>
      activeFilters.every(({ key, filterValue, filterComparison, header, customFilterFn, dateBounds }) => {
        const value = resolveFilterValue(item, key, header);
        return customFilterFn
          ? customFilterFn({ value, filterValue, filterComparison, header, item })
          : applyFilter(value, filterValue, filterComparison, header, dateBounds);
      }),
    );
  });

  watch(
    () => table_props.data,
    (newValue, oldValue) => {
      if (!deepEqual(newValue, oldValue)) {
        tableData.value = newValue;
      }
    },
    { deep: true, immediate: true },
  );

  return { tableData, filteredData };
}
