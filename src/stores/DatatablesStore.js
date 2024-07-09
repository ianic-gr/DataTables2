// Utilities
import { ref } from "vue";
import { defineStore } from "pinia";

export const useDatatablesStore = defineStore("datatables", () => {
  const tables = ref([]);
  const preset = ref({
    search: {
      query: "",
    },
    advancedFilters: {
      query: {},
    },
    hardFilters: {
      query: {},
    },
    options: {
      test: true,
      query: {},
      columns: {},
    },
  });

  const addTable = ({ table_id }) => {
    const no_reac_table = JSON.parse(JSON.stringify(tables.value));

    no_reac_table.push({ id: table_id, ...preset.value });
    tables.value = no_reac_table;
  };

  const setData = ({ table_id, name, value }) => {
    tables.value = tables.value.map((table) => {
      if (table.id === table_id && table.hasOwnProperty(name)) {
        const targetObj = table[name];
        console.log(table, targetObj);

        if (targetObj && typeof value === "object") {
          for (const prop in value) {
            if (prop in targetObj) {
              targetObj[prop] = value[prop];
            }
          }
        }
      }
      return table;
    });
  };

  const restoreData = ({ table_id, data }) => {
    tables.value = tables.value.map((table) => {
      if (table.id === table_id) {
        table = data;
      }
      return table;
    });
  };

  const getCurrentTable = (table_id) => {
    return tables.value.find((table) => {
      return table.id === table_id;
    });
  };

  const shell = {
    // Store Data
    tables,
    // Store Methods
    addTable,
    setData,
    restoreData,
    getCurrentTable,
  };

  return shell;
});
