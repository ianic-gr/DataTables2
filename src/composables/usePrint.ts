import print from "print-js";
import { getValueByStringPath } from "@/utils/getValueByStringPath";
import { escapeKeyString } from "@/utils/escapeKeyString";

export function usePrint() {
  const table_props = inject<any>("table_props");
  const tableRef = inject<any>("tableRef");
  const downloadModal = inject<any>("downloadModal");

  const tableHeaders = computed(() => {
    return table_props.headers.filter((header: any) => header?.printable !== false);
  });

  const printTable = async () => {
    downloadModal.value = true;

    const items = await tableRef.value.getItemsForPrint();
    const rows: any = [];

    items.forEach((item: any) => {
      const row: any = {};
      tableHeaders.value.forEach((header: any) => {
        if (header.value) {
          row[escapeKeyString(header.key)] = header.value(item);
        } else {
          row[escapeKeyString(header.key)] = getValueByStringPath(item, header.key) ?? "";
        }
      });
      rows.push(row); // Move this line outside the inner loop
    });

    print({
      printable: rows,
      type: "json",
      properties: tableHeaders.value.map((header: any) => {
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
