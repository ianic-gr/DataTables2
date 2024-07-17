<script setup>
const headers = [
  {
    title: "ID",
    key: "id",
    advancedFilter: false,
    hidden: true,
  },
  {
    title: "First Name",
    key: "name",
    cellClass: "font-weight-medium",
  },
  {
    title: "Full Name",
    key: "fullName",
    hidden: true,
    value: (item) => `${item.name} <b>${item.year}</b>`,
  },
  {
    title: "Year",
    key: "year",
    cellRendererFramework: "Link",
    cellRendererFrameworkOptions: () => {
      return {
        variant: "link",
        text: "Hello",
        class: "primary-text font-weight-bold text-decoration-none",
        href: "#",
      };
    },
  },
  {
    title: "Engine",
    key: "engine",
    cellRenderer: ({ value }) => `<b>${value}</b>`,
  },
  {
    title: "Actions",
    key: "actions",
    printable: false,
    sortable: false,
    cellRendererFramework: "ActionButtons",
    cellRendererFrameworkOptions: ({ item }) => {
      return {
        buttons: [
          {
            title: "View",
            prependIcon: "mdi-eye",
            onClick: () => {
              alert("View " + item.name);
            },
          },
          {
            title: "Edit",
            prependIcon: "mdi-pencil",
            onClick: () => {
              alert("Edit " + item.name);
            },
          },
          {
            title: "Delete",
            prependIcon: "mdi-delete",
            class: "text-error",
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
</script>
<template>
  <DataTable
    id="test"
    :headers="headers"
    :data="data"
    :options="{
      showExpand: true,
    }"
    class="mb-4"
  />
</template>
