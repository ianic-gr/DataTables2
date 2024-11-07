<script setup>
import ExpandedVue from "@/components/examples/components/Expanded.vue";
import moment from "moment";

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
        returnFormat: "DD-MM-YYYY h:mm:ss a",
      },
    },
    valueFormatter: ({ value }) => {
      if (!value) return "-";
      return moment(value).format("DD-MM-YYYY h:mm:ss a");
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
    date: 1597872393918,
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
    date: 1577972393418,
    engine: "V8",
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
    date: 1577872394918,
    engine: "V8",
    horsepower: 375,
    torque: 415,
  },
  {
    id: 4,
    name: "Ford Mustang",
    date: 1699852393918,
    engine: "*",
    horsepower: 271,
    torque: 312,
  },
]);

const hardFilters = ref([
  {
    text: "Mustang",
    active: true,
    args: {
      name: "Mustang",
    },
  },
  {
    text: "V8",
    args: {
      engine: "V8",
    },
    query: {
      trashed: true,
    },
  },
  {
    text: "deleted",
    value: "pop",
    query: {
      trashed: true,
    },
  },
]);

const options = ref({
  header: {
    components: {
      toolbar: ExpandedVue,
    },
    export: {
      buttons: {
        disabled: true,
      },
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
    :hardFilters="hardFilters"
    class="mb-4"
  />
</template>
