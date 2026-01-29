// lib/index.d.ts
import type { DataTableHeader } from "vuetify/lib/types.mjs";
import type { Component } from "vue";
import { VSelect, VTextField, VNumberInput, VDateInput } from "vuetify/components";

type BuiltInAdvancedFiltersComponent = "textfield" | "select" | "number" | "datepicker" | "comparison";

type BaseAdvancedFilter = {
  key?: string;
  valueFormatter?: (context: { value: any }) => any;
  filterReturnValue?: (context: { value: any }) => any;
  customFilterFn?: (context: { value: any; filterValue: any }) => boolean;
};

type AdvancedFilterConfig =
  | false
  | (BaseAdvancedFilter & {
      component: "textfield";
      options?: InstanceType<typeof VTextField>["$props"] & {
        [key: `on${string}`]: any;
      };
    })
  | (BaseAdvancedFilter & {
      component: "select";
      options?: InstanceType<typeof VSelect>["$props"] & {
        [key: `on${string}`]: any;
      };
    })
  | (BaseAdvancedFilter & {
      component: "number";
      options?: InstanceType<typeof VNumberInput>["$props"] & {
        [key: `on${string}`]: any;
      };
    })
  | (BaseAdvancedFilter & {
      component: "datepicker";
      options?: InstanceType<typeof VDateInput>["$props"] & {
        returnFormat?: string;
        [key: `on${string}`]: any;
      };
    })
  | (BaseAdvancedFilter & {
      component: "comparison";
      options?: InstanceType<typeof VNumberInput>["$props"] &
        InstanceType<typeof VSelect>["$props"] & {
          [key: `on${string}`]: any;
        };
    })
  | (BaseAdvancedFilter & {
      component?: Component;
      options?: Record<string, any>;
    });

export interface ColumnDef<T> extends Omit<DataTableHeader, "value"> {
  hidden?: boolean;
  printable?: boolean;
  value?: (item: T) => any;
  cell?: (context: { value: any; item: T }) => any;
  advancedFilter?: AdvancedFilterConfig;
}

export function useCellRendererFrameworks(): any;
