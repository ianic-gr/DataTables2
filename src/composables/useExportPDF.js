import jsPDF from "jspdf";
import "jspdf-autotable";
import { getValueByStringPath } from "@/utils/getValueByStringPath";
import { escapeKeyString } from "@/utils/escapeKeyString";
import "../assets/fonts/roboto-normal";

export function useExportPDF() {
  const table_props = inject("table_props");
  const tableRef = inject("tableRef");
  const downloadModal = inject("downloadModal");

  const tableHeaders = computed(() => {
    return table_props.headers.filter((header) => header?.printable !== false);
  });

  const exportPDF = async () => {
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

    var doc = new jsPDF({
      orientation: "landscape",
    });

    doc.autoTable({
      styles: { font: "roboto" },
      margin: { top: 0, left: 0, right: 0, bottom: 0 },
      head: [tableHeaders.value.map((prop) => prop.title)],
      body: [...rows.map((row) => Object.values(row))],
    });

    doc.save(`${table_props.id}.pdf`);
    downloadModal.value = false;
  };

  return { exportPDF };
}
