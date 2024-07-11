import { inject } from "vue";
import { mkConfig, generateCsv, download } from "export-to-csv";

export function useExportCsv() {
  const table_props = inject("table_props");

  const tableHeaders = computed(() => {
    return table_props.headers.filter((header) => {
      return header?.printable !== false;
    });
  });

  const tableData = computed(() => {
    const rows = [];

    table_props.data.forEach((item) => {
      let row = {};
      tableHeaders.value.forEach((header) => {
        if (header.value) {
          row[header.key] = header.value(item);
        } else {
          row[header.key] = item[header.key];
        }

        rows.push(row);
      });
    });

    return rows;
  });

  const exportCsv = () => {
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
    const csv = generateCsv(csvConfig)(tableData.value);

    // Add a click handler that will run the `download` function.
    // `download` takes `csvConfig` and the generated `CsvOutput`
    // from `generateCsv`.
    download(csvConfig)(csv);
  };

  return { exportCsv };
}
