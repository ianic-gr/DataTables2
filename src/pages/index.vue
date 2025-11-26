<script setup>
import ExpandedVue from "@/components/examples/components/Expanded.vue";
import { useCellRendererFrameworks } from "@/composables/useCellRendererFrameworks";
import moment from "moment";
import { VChip } from "vuetify/components";

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
    cell: ({ value }) => {
      const { DTLink } = useCellRendererFrameworks();

      return h(DTLink, {
        options: {
          variant: "link",
          text: value,
          class: "primary-text font-weight-bold text-decoration-none",
          href: "#",
        },
      });
    },
    advancedFilter: {
      component: "select",
      valueFormatter: ({ value }) => {
        return value === "Chevrolet Camaro" ? "Vrooom!!" : "Oh yes!";
      },
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
    value: (item) => `${item.name} <b>${moment(item.date).format("YYYY-MM-DD h:mm:ss a")}</b>`,
  },
  {
    title: "Date",
    key: "date",
    advancedFilter: {
      component: "datepicker",
      options: {
        returnFormat: "DD/MM/YYYY",
        multiple: "range",
      },
    },
    value: (item) => {
      if (!item.date) return "-";
      return moment(item.date, "DD/MM/YYYY").format("MM-DD-YYYY");
    },
  },
  {
    title: "Engine",
    key: "engine",
    cell: ({ value }) => h("b", value),
  },
  {
    title: "Horsepower",
    key: "horsepower",
    advancedFilter: {
      component: "comparison",
    },
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
    advancedFilter: {
      key: "name",
    },
  },
  {
    title: "Alarms",
    key: "alarms",
    advancedFilter: {
      component: "select",
      options: {
        // multiple: true,
        items: [
          {
            title: "Engine Fail",
            value: "engine_fail",
          },
          {
            title: "Overheat",
            value: "overheat",
          },

          {
            title: "Burst",
            value: "burst",
          },
        ],
      },
      customFilterFn: ({ value, filterValue }) => {
        if (!filterValue || !filterValue.length) return true;

        const activeAlarms = value.filter((item) => item.active === 1).map((item) => item.alarm);

        for (const i in filterValue) {
          if (activeAlarms.includes(filterValue[i])) {
            return true;
          }
        }

        return false;
      },
    },
    // filterReturnValue: ({ value }) => {
    //   return value
    //     .filter((item) => item.active === 1)
    //     .map((item) => item.alarm)
    //     .join();
    // },
    cell: ({ value }) => {
      const badges = [];
      for (const i in value) {
        if (value[i].active === 1) {
          let alarmColor = "error";

          if (value[i].alarm === "overheat") {
            alarmColor = "warning";
          }

          badges.push(
            h(
              VChip,
              {
                class: "font-weight-bold text-center py-1 px-4",
                style: "height:unset",
                color: alarmColor,
                size: "small",
              },
              {
                default: () => h("div", value[i].alarm),
              }
            )
          );
        }
      }
      return h("div", { class: "d-flex", style: "gap: 0.2rem" }, badges);
    },
  },
  {
    title: "Actions",
    key: "actions",
    printable: false,
    sortable: false,
    advancedFilter: false,
    cell: ({ item }) => {
      const { DTActionButtons } = useCellRendererFrameworks();

      const buttons = [
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
      ];

      return h(DTActionButtons, {
        buttons,
      });
    },
  },
];

const data = ref([
  {
    id: 1,
    name: "Chevrolet Camaro",
    date: "05/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    pop: {
      stop: "Hellox",
    },
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 2,
    name: "Ford Mustang",
    date: "06/11/2025 08:34:31",
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
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 1 },
    ],
  },
  {
    id: 3,
    name: "Chevrolet Camaro",
    date: "07/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 1 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 4,
    name: "Ford Mustang",
    date: "08/11/2025 08:34:31",
    engine: "*",
    horsepower: 271,
    torque: 312,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 1,
    name: "Chevrolet Camaro",
    date: "05/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    pop: {
      stop: "Hellox",
    },
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 2,
    name: "Ford Mustang",
    date: "06/11/2025 08:34:31",
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
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 1 },
    ],
  },
  {
    id: 3,
    name: "Chevrolet Camaro",
    date: "07/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 1 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 4,
    name: "Ford Mustang",
    date: "08/11/2025 08:34:31",
    engine: "*",
    horsepower: 271,
    torque: 312,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 1,
    name: "Chevrolet Camaro",
    date: "05/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    pop: {
      stop: "Hellox",
    },
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 2,
    name: "Ford Mustang",
    date: "06/11/2025 08:34:31",
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
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 1 },
    ],
  },
  {
    id: 3,
    name: "Chevrolet Camaro",
    date: "07/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 1 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 4,
    name: "Ford Mustang",
    date: "08/11/2025 08:34:31",
    engine: "*",
    horsepower: 271,
    torque: 312,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 1,
    name: "Chevrolet Camaro",
    date: "05/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    pop: {
      stop: "Hellox",
    },
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 2,
    name: "Ford Mustang",
    date: "06/11/2025 08:34:31",
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
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 1 },
    ],
  },
  {
    id: 3,
    name: "Chevrolet Camaro",
    date: "07/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 1 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 4,
    name: "Ford Mustang",
    date: "08/11/2025 08:34:31",
    engine: "*",
    horsepower: 271,
    torque: 312,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 1,
    name: "Chevrolet Camaro",
    date: "05/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    pop: {
      stop: "Hellox",
    },
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 2,
    name: "Ford Mustang",
    date: "06/11/2025 08:34:31",
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
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 1 },
    ],
  },
  {
    id: 3,
    name: "Chevrolet Camaro",
    date: "07/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 1 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 4,
    name: "Ford Mustang",
    date: "08/11/2025 08:34:31",
    engine: "*",
    horsepower: 271,
    torque: 312,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 1,
    name: "Chevrolet Camaro",
    date: "05/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    pop: {
      stop: "Hellox",
    },
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 2,
    name: "Ford Mustang",
    date: "06/11/2025 08:34:31",
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
    alarms: [
      { alarm: "burst", active: 1 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 1 },
    ],
  },
  {
    id: 3,
    name: "Chevrolet Camaro",
    date: "07/11/2025 08:34:31",
    engine: "V8",
    horsepower: 375,
    torque: 415,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 1 },
      { alarm: "overheat", active: 0 },
    ],
  },
  {
    id: 4,
    name: "Ford Mustang",
    date: "08/11/2025 08:34:31",
    engine: "*",
    horsepower: 271,
    torque: 312,
    alarms: [
      { alarm: "burst", active: 0 },
      { alarm: "engine_fail", active: 0 },
      { alarm: "overheat", active: 0 },
    ],
  },
]);

const hardFilters = ref([
  {
    text: "Mustang",
    active: true,
    args: {
      name: {
        value: "Mustang",
      },
    },
  },
  {
    text: "V8",
    args: {
      engine: {
        value: "V8",
      },
    },
    query: {
      trashed: {
        value: true,
      },
    },
  },
  {
    text: "deleted",
    value: "pop",
    query: {
      trashed: {
        value: true,
      },
    },
  },
]);

const options = ref({
  header: {
    components: {
      toolbar: markRaw(ExpandedVue),
    },
    export: {
      buttons: {
        disabled: false,
      },
    },
  },
  showExpand: true,
  expandedRowRenderer: markRaw(ExpandedVue),
  advancedFilters: {
    onMounted: () => {},
  },
});
</script>
<template>
  <DataTable id="test" :headers="headers" :data="data" :options="options" :hard-filters="hardFilters" class="mb-4" />
</template>
