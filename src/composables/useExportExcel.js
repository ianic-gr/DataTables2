import { ref, watch, computed, nextTick, onBeforeMount } from "vue";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export function useExportExcel() {
  const table_props = inject("table_props");

  // Define headers
  const headers = [
    { title: "First Name", key: "name" },
    {
      title: "Full Name",
      key: "fullName",
      value: (item) => `${item.name} <b>${item.year}</b>`,
    },
    { title: "Year", key: "year" },
    {
      title: "Engine",
      key: "engine",
      cellRenderer: ({ value }) => `<b>${value}</b>`,
    },
    { title: "Actions", key: "actions" },
  ];

  // Define data
  const data = [
    {
      id: 1,
      name: "Chevrolet Camaro",
      year: 1967,
      engine: "V8",
      horsepower: 375,
      torque: 415,
    },
    {
      id: 2,
      name: "Ford Mustang",
      year: 1965,
      engine: "",
      horsepower: 271,
      torque: 312,
    },
    {
      id: 3,
      name: "Chevrolet Camaro",
      year: 1967,
      engine: "V8",
      horsepower: 375,
      torque: 415,
    },
    {
      id: 4,
      name: "Ford Mustang",
      year: 1965,
      engine: "*",
      horsepower: 271,
      torque: 312,
    },
  ];

  const exportExcel = () => {
    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add headers to worksheet
    worksheet.columns = headers.map((header) => ({
      header: header.title,
      key: header.key,
    }));

    // Add rows to worksheet
    data.forEach((item) => {
      let row = {};
      headers.forEach((header) => {
        if (header.value) {
          row[header.key] = header.value(item);
        } else {
          row[header.key] = item[header.key];
        }
      });
      worksheet.addRow(row);
    });

    const fileName = table_props.props.title ?? table_props.props.id;

    // Save workbook to file and trigger download
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `${table_props.props.id}.xlsx`);
      })
      .catch((err) => {
        console.error("Error creating Excel file", err);
      });
  };

  return { exportExcel };
}
