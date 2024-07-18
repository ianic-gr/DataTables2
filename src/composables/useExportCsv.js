import { inject } from "vue";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { getValueByStringPath } from "@/utils/getValueByStringPath";

export function useExportCsv() {
  const table_props = inject("table_props");
  const tableRef = inject("tableRef");
  const downloadModal = inject("downloadModal");

  const tableHeaders = computed(() => {
    return table_props.headers.filter((header) => {
      return header?.printable !== false;
    });
  });

  const exportCsv = async () => {
    downloadModal.value = true;

    const items = await tableRef.value.getItemsForPrint();
    const rows = [];

    items.forEach((item) => {
      let row = {};
      tableHeaders.value.forEach((header) => {
        if (header.value) {
          row[header.key] = header.value(item);
        } else {
          row[header.key] = getValueByStringPath(item, header.key);
        }
      });
      rows.push(row); // Move this line outside the inner loop
    });

    // mkConfig merges your options with the defaults
    // and returns WithDefaults<ConfigOptions>
    const csvConfig = mkConfig({
      columnHeaders: tableHeaders.value.map((header) => {
        return {
          key: header.key,
          displayLabel: header.title,
        };
      }),
    });

    // Converts your Array<Object> to a CsvOutput string based on the configs
    const csv = generateCsv(csvConfig)(rows);

    // Add a click handler that will run the `download` function.
    // `download` takes `csvConfig` and the generated `CsvOutput`
    // from `generateCsv`.
    download(csvConfig)(csv);
    downloadModal.value = false;
  };

  return { exportCsv };
}
