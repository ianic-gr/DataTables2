import { inject, computed } from "vue";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getValueByStringPath } from "@/utils/getValueByStringPath";
import { getCurrentFormattedDate } from "@/utils/getCurrentFormattedDate";

export function useExportExcel() {
  const table_props = inject("table_props");
  const tableRef = inject("tableRef");
  const downloadModal = inject("downloadModal");

  const tableHeaders = computed(() => {
    return table_props.headers.filter((header) => header?.printable !== false);
  });

  // Function to estimate column width based on content length
  function estimateColumnWidths(headers, dataRows, minWidth = 15) {
    return headers.map((header, colIndex) => {
      const headerLength = header.title.length;
      const maxDataLength = Math.max(
        ...dataRows.map((row) => {
          const cell = row[colIndex];
          return cell ? cell.toString().length : 0;
        })
      );

      const widthFromHeader = headerLength + 5;
      const widthFromData = maxDataLength + 5;

      const customWidth = header.width || 0;

      // Use the highest value from header, data, or provided width
      return {
        wch: Math.max(minWidth, widthFromHeader, widthFromData, customWidth),
      };
    });
  }

  const exportExcel = async () => {
    try {
      downloadModal.value = true;
      const items = await tableRef.value.getItemsForPrint();

      // Build header row
      const headerRow = tableHeaders.value.map((header) => header.title);

      // Build data rows
      const dataRows = items.map((item) =>
        tableHeaders.value.map((header) => {
          if (header.value) {
            return header.value(item);
          }
          return getValueByStringPath(item, header.key) ?? "";
        })
      );

      // Combine headers with data
      const worksheetData = [headerRow, ...dataRows];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Calculate and set column widths
      worksheet["!cols"] = estimateColumnWidths(tableHeaders.value, dataRows);

      // Create workbook and append sheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

      // Generate Excel file buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Trigger download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${table_props.id}_${getCurrentFormattedDate()}.xlsx`);
    } catch (err) {
      console.error("Error exporting Excel file:", err);
    } finally {
      downloadModal.value = false;
    }
  };

  return { exportExcel };
}
