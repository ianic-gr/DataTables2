import { inject, computed } from "vue";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { getValueByStringPath } from "@/utils/getValueByStringPath";
import { getCurrentFormattedDate } from "@/utils/getCurrentFormattedDate";

export function useExportCsv() {
  const table_props = inject<any>("table_props");
  const tableRef = inject<any>("tableRef");
  const downloadModal = inject<any>("downloadModal");

  const tableHeaders = computed(() => {
    return table_props.headers.filter((header: any) => header?.printable !== false);
  });

  const sanitizeExportValue = (val: any) => {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") {
      return Array.isArray(val) ? val.join(", ") : JSON.stringify(val);
    }
    return val;
  };

  const exportCsv = async () => {
    downloadModal.value = true;

    const items = await tableRef.value.getItemsForPrint();
    const rows: any[] = [];

    items.forEach((item: any) => {
      const row: any = {};
      tableHeaders.value.forEach((header: any) => {
        const raw = header.value ? header.value(item) : getValueByStringPath(item, header.key);

        row[header.key] = sanitizeExportValue(raw);
      });
      rows.push(row);
    });

    const csvConfig = mkConfig({
      filename: `${table_props.id}_${getCurrentFormattedDate()}`,
      columnHeaders: tableHeaders.value.map((header: any) => ({
        key: header.key,
        displayLabel: header.title,
      })),
    });

    const csv = generateCsv(csvConfig)(rows);
    download(csvConfig)(csv);
    downloadModal.value = false;
  };

  return { exportCsv };
}
