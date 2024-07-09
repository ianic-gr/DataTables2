<script setup>
const headers = [
  {
    title: "First Name",
    key: "name",
    cellClass: "font-weight-medium",
  },
  {
    title: "Full Name",
    key: "fullName",
    value: (item) => `${item.name} <b>${item.year}</b>`,
  },
  {
    title: "Year",
    key: "year",
  },
  {
    title: "Engine",
    key: "engine",
    cellRenderer: ({ value }) => `<b>${value}</b>`,
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    cellRendererFramework: "ActionButtons",
    cellRendererFrameworkOptions: ({ item }) => {
      return {
        buttons: [
          {
            title: "View",
            onClick: () => {
              alert("View " + item.name);
            },
          },
          {
            title: "Edit",
            onClick: () => {
              alert("Edit " + item.name);
            },
          },
          {
            title: "Delete",
            onClick: () => {
              alert("Delete " + item.name);
            },
          },
        ],
      };
    },
  },
];

let data = ref([
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
]);

let data2 = ref([
  {
    id: 1,
    name: "Plop",
    year: 1967,
    engine: "V8",
    horsepower: 375,
    torque: 415,
  },
  {
    id: 2,
    name: "Plop2",
    year: 1965,
    engine: "",
    horsepower: 271,
    torque: 312,
  },
  {
    id: 3,
    name: "Plop3",
    year: 1967,
    engine: "V8",
    horsepower: 375,
    torque: 415,
  },
  {
    id: 4,
    name: "Plop4",
    year: 1965,
    engine: "*",
    horsepower: 271,
    torque: 312,
  },
]);
</script>
<template>
  <DataTable
    id="test"
    :headers="headers"
    :data="data"
    class="mb-4"
    locale="el"
  />

  <DataTable
    id="test2"
    title="Test Datatable"
    :headers="headers"
    :data="data2"
    class="mb-4"
  />

  <DataTable id="skat" :headers="headers" :data="data" locale="el" />
</template>
