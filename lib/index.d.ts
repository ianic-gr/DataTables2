// lib/index.d.ts
import type { DataTableHeader } from "vuetify/components";

export interface ColumnDef<T> extends Omit<DataTableHeader, "value"> {
  hidden?: boolean;
  printable?: boolean;

  value?: (item: T) => any;
  cell?: (context: { value: any; item: T }) => any;

  advancedFilter?:
    | false
    | {
        key?: string;
        component?: "select" | "datepicker" | "comparison" | "number";
        valueFormatter?: (context: { value: any }) => any;
        filterReturnValue?: (context: { value: any }) => any;
        customFilterFn?: (context: { value: any; filterValue: any }) => boolean;
        options?: {
          multiple?: boolean | "range";
          items?: Array<{ title: string; value: any }>;
          returnFormat?: string;
          controlVariant?: "stacked" | string;
        };
      };
}

export function useCellRendererFrameworks(): any;
