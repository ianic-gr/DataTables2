<script setup>
import ExpandedVue from "@/components/examples/components/Expanded.vue";

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
    cellRendererFramework: "Link",
    cellRendererFrameworkOptions: (v) => {
      return {
        variant: "link",
        text: v.value,
        class: "primary-text font-weight-bold text-decoration-none",
        href: "#",
      };
    },
    advancedFilter: {
      component: "select",
      options: {
        multiple: true,
        items: [
          { title: "Camaro", value: "Chevrolet Camaro" },
          { title: "Mustang", value: "Ford Mustang" },
        ],
      },
    },
  },
  {
    title: "Full Name",
    key: "fullName",
    hidden: true,
    value: (item) => `${item.name} <b>${item.date}</b>`,
  },
  {
    title: "Date",
    key: "date",
    advancedFilter: {
      component: "datepicker",
      options: {
        viewMode: "date",
        returnFormat: "DD-MM-YYYY",
      },
    },
  },
  {
    title: "Engine",
    key: "engine",
    cellRenderer: ({ value }) => `<b>${value}</b>`,
  },
  {
    title: "Pop Stop",
    key: "pop.stop",
  },
  {
    title: "Skop",
    key: "skop[0].pop",
    advancedFilter: {
      component: "number",
      options: {
        controlVariant: "stacked",
      },
    },
  },
  {
    title: "Random",
    key: "random",
    value: () => Math.floor(Math.random() * 100000),
  },

  {
    title: "Actions",
    key: "actions",
    printable: false,
    sortable: false,
    advancedFilter: false,
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
    date: "20-09-2024",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    pop: {
      stop: "Hellox",
    },
  },
  {
    id: 2,
    name: "Ford Mustang",
    date: "21-09-2024",
    engine: "",
    horsepower: 271,
    torque: 312,
    skop: [
      {
        pop: "22222222222222222",
      },
      {
        pop: "xxxxxxxxxxxxx",
      },
    ],
  },
  {
    id: 3,
    name: "Chevrolet Camaro",
    date: "20-09-2024",
    engine: "V8",
    horsepower: 375,
    torque: 415,
  },
  {
    id: 4,
    name: "Ford Mustang",
    date: "25-09-2024",
    engine: "*",
    horsepower: 271,
    torque: 312,
  },
]);

const options = ref({
  header: {
    components: {
      search: ExpandedVue,
    },
  },
  showExpand: true,
  expandedRowRenderer: ExpandedVue,
  advancedFilters: {
    onMounted: () => {},
  },
});
</script>
<template>
  <DataTable
    id="test"
    :headers="headers"
    :data="data"
    :options="options"
    class="mb-4"
  />
</template>
