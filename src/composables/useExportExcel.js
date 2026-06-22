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
        }),
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

  // Coerce raw value into a real Date/Number so SheetJS sets the correct
  // cell type before the excelCellFormat (.z) is applied
  function coerceForFormat(value, format) {
    if (value === null || value === undefined || value === "") return value;

    // crude heuristic: format strings containing y/m/d/h are date-like
    const isDateFormat = /[ymdh]/i.test(format) && !/[#0]/.test(format);

    if (isDateFormat) {
      const d = value instanceof Date ? value : new Date(value);
      return isNaN(d.getTime()) ? value : d;
    }

    const n = typeof value === "number" ? value : parseFloat(value);
    return isNaN(n) ? value : n;
  }

  function applyCellFormats(worksheet, headers, rowCount) {
    headers.forEach((header, colIndex) => {
      if (!header.excelCellFormat) return;

      for (let r = 1; r <= rowCount; r++) {
        const cellRef = XLSX.utils.encode_cell({ r, c: colIndex });
        const cell = worksheet[cellRef];
        if (!cell || cell.v === undefined || cell.v === null || cell.v === "") continue;
        cell.z = header.excelCellFormat;
      }
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
          if (header.excelCellFormat) {
            return coerceForFormat(getValueByStringPath(item, header.key), header.excelCellFormat);
          }

          return header.value ? header.value(item) : (getValueByStringPath(item, header.key) ?? "");
        }),
      );

      // Combine headers with data
      const worksheetData = [headerRow, ...dataRows];
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData, { cellDates: true });

      // Calculate and set column widths
      worksheet["!cols"] = estimateColumnWidths(tableHeaders.value, dataRows);

      applyCellFormats(worksheet, tableHeaders.value, dataRows.length);

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
