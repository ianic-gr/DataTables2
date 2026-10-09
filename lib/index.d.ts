// lib/index.d.ts
import type { DataTableHeader } from "vuetify/lib/types.mjs";
import type { Component, Plugin } from "vue";
import { VSelect, VTextField, VNumberInput, VDateInput } from "vuetify/components";

declare const DataTables: Plugin;

export type BuiltInAdvancedFiltersComponent = "textfield" | "select" | "number" | "datepicker" | "comparison";

export type BaseAdvancedFilter = {
  key?: string;
  valueFormatter?: (context: { value: any }) => any;
  filterReturnValue?: (context: { value: any }) => any;
  customFilterFn?: (context: { value: any; filterValue: any }) => boolean;
};

type EventHandlers = {
  [key: `on${string}`]: any;
};

// Maps each built-in component name to its props.
// Adding a new built-in filter = add it to the union above and to this map.
type BuiltInFilterOptions = {
  textfield: InstanceType<typeof VTextField>["$props"];
  select: InstanceType<typeof VSelect>["$props"];
  number: InstanceType<typeof VNumberInput>["$props"];
  datepicker: InstanceType<typeof VDateInput>["$props"] & {
    returnFormat?: string;
  };
  comparison: InstanceType<typeof VNumberInput>["$props"] & InstanceType<typeof VSelect>["$props"];
};

type BuiltInAdvancedFilter = {
  [K in BuiltInAdvancedFiltersComponent]: BaseAdvancedFilter & {
    component: K;
    options?: BuiltInFilterOptions[K] & EventHandlers;
  };
}[BuiltInAdvancedFiltersComponent];

type CustomAdvancedFilter = BaseAdvancedFilter & {
  component?: Component;
  options?: Record<string, any>;
};

export type AdvancedFilterConfig = false | BuiltInAdvancedFilter | CustomAdvancedFilter;

export interface ColumnDef<T> extends Omit<DataTableHeader, "value"> {
  excelCellFormat?: string;
  hidden?: boolean;
  printable?: boolean;
  value?: (item: T) => any;
  cell?: (context: { value: any; item: T }) => any;
  advancedFilter?: AdvancedFilterConfig;
}

export default DataTables;
export function useCellRendererFrameworks(): any;
