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
    value: (item) => `${item.name} <b>${item.yearx}</b>`,
  },
  {
    title: "yearx",
    key: "yearx",
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
    title: "plat",
    key: "plat",
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

let data2 = ref([
  {
    id: 1,
    name: "Plop",
    yearx: 1967,
    plat: "V8",
    horsepower: 375,
    torque: 415,
  },
  {
    id: 2,
    name: "Plop2",
    yearx: 1965,
    plat: "",
    horsepower: 271,
    torque: 312,
  },
  {
    id: 3,
    name: "Plop3",
    yearx: 1967,
    plat: "V8",
    horsepower: 375,
    torque: 415,
  },
  {
    id: 4,
    name: "Plop4",
    yearx: 1965,
    plat: "*",
    horsepower: 271,
    torque: 312,
  },
]);
</script>
<template>
  <DataTable
    id="test2"
    title="Test Datatable"
    :headers="headers"
    :data="data2"
    class="mb-4"
    locale="el"
  />
</template>
