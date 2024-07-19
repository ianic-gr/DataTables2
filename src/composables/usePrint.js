import print from "print-js";
import { getValueByStringPath } from "@/utils/getValueByStringPath";
import { escapeKeyString } from "@/utils/escapeKeyString";

export function usePrint() {
  const table_props = inject("table_props");
  const tableRef = inject("tableRef");
  const downloadModal = inject("downloadModal");

  const tableHeaders = computed(() => {
    return table_props.headers.filter((header) => header?.printable !== false);
  });

  const printTable = async () => {
    downloadModal.value = true;

    const items = await tableRef.value.getItemsForPrint();
    const rows = [];

    items.forEach((item) => {
      let row = {};
      tableHeaders.value.forEach((header) => {
        if (header.value) {
          row[escapeKeyString(header.key)] = header.value(item);
        } else {
          row[escapeKeyString(header.key)] =
            getValueByStringPath(item, header.key) ?? "";
        }
      });
      rows.push(row); // Move this line outside the inner loop
    });

    print({
      printable: rows,
      type: "json",
      properties: tableHeaders.value.map((header) => {
        return {
          field: escapeKeyString(header.key),
          displayName: header.title,
        };
      }),
    });

    downloadModal.value = false;
  };

  return { printTable };
}
