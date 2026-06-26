import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { getValueByStringPath } from "@/utils/getValueByStringPath";
import { getCurrentFormattedDate } from "@/utils/getCurrentFormattedDate";
import "../assets/fonts/roboto-normal";

const BRAND_BLUE = [41, 128, 186]; // 0.16, 0.5, 0.73 * 255
const ROW_GRAY = [245, 245, 245]; // 0.96 * 255

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

    var doc = new jsPDF({
      orientation: "portrait",
    });

    items.forEach((item, index) => {
      if (index > 0) {
        doc.addPage();
      }

      const body = tableHeaders.value.map((header) => {
        const value = header.value ? header.value(item) : (getValueByStringPath(item, header.key) ?? "");
        return [header.title, value];
      });

      // Heading per item — same font as the table, no bold (no bold file registered)
      doc.setFont("roboto", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`${table_props.id} — ${index + 1}/${items.length}`, 14, 14);

      autoTable(doc, {
        startY: 20,
        theme: "plain", // don't fight a built-in theme; we color everything explicitly
        styles: {
          font: "roboto",
          fontStyle: "normal", // only registered weight — never "bold" here
          fontSize: 9,
          cellPadding: 3,
          lineColor: [220, 220, 220],
          lineWidth: 0.1,
        },
        columnStyles: {
          0: {
            cellWidth: 50,
            fillColor: BRAND_BLUE,
            textColor: [255, 255, 255], // white label text on blue, like your header row
          },
          1: {
            cellWidth: "auto",
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
          },
        },
        alternateRowStyles: {
          // applies to the value column's row background on alternating rows
          fillColor: ROW_GRAY,
        },
        margin: { top: 20, left: 14, right: 14, bottom: 14 },
        body,
      });
    });

    doc.save(`${table_props.id}_${getCurrentFormattedDate()}.pdf`);
    downloadModal.value = false;
  };

  return { exportPDF };
}
