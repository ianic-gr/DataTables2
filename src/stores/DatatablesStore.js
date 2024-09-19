// Utilities
import { ref } from "vue";
import { defineStore } from "pinia";

export const useDatatablesStore = defineStore("datatables", () => {
  const tables = ref([]);

  const addTable = ({ table_id }) => {
    const no_reac_table = JSON.parse(JSON.stringify(tables.value));
    const existingTableIndex = no_reac_table.findIndex(
      (table) => table.id === table_id
    );
    const preset = {
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
        hash: null,
        columns: {},
        pagination: {
          itemsPerPage: null,
        },
      },
    };

    if (existingTableIndex !== -1) {
      no_reac_table.splice(existingTableIndex, 1);
    }

    no_reac_table.push({ id: table_id, ...preset });
    tables.value = no_reac_table;
  };

  const hashString = async (input) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const setTableHash = ({ table_id, headers }) => {
    hashString(JSON.stringify(headers ?? [])).then((hash) => {
      setData({ table_id, name: "options", value: { hash } });
    });
  };

  const setData = ({ table_id, name, value }) => {
    tables.value = tables.value.map((table) => {
      if (table.id === table_id && table.hasOwnProperty(name)) {
        const targetObj = table[name];

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
    // Hash
    hashString,
    setTableHash,
  };

  return shell;
});
