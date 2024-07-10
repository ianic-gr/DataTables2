import { inject } from "vue";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export function useExportExcel() {
  const table_props = inject("table_props");

  const tableHeaders = computed(() => {
    return table_props.headers.filter((header) => {
      return header?.printable !== false;
    });
  });

  const exportExcel = () => {
    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add headers to worksheet and set column widths
    worksheet.columns = tableHeaders.value.map((header) => ({
      header: header.title,
      key: header.key,
      width: header.width || 25,
    }));

    // Add rows to worksheet
    table_props.data.forEach((item) => {
      let row = {};
      tableHeaders.value.forEach((header) => {
        if (header.value) {
          row[header.key] = header.value(item);
        } else {
          row[header.key] = item[header.key];
        }
      });
      worksheet.addRow(row);
    });

    const fileName = table_props.title ?? table_props.id;

    // Save workbook to file and trigger download
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${table_props.id}.xlsx`);
      })
      .catch((err) => {
        console.error("Error creating Excel file", err);
      });
  };

  return { exportExcel };
}
