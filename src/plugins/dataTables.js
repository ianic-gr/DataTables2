import { defineAsyncComponent } from "vue";

export { useCellRendererFrameworks } from "../composables/useCellRendererFrameworks.js";

// Main DataTable Plugin
export default {
  install(app, options) {
    app.provide("pluginOptions", {
      header: {
        icons: {
          advancedFilters: "mdi-filter-variant",
          search: "mdi-magnify",
          columns: "mdi-view-column-outline",
          download: "mdi-tray-arrow-down",
          refresh: "mdi-refresh",
          options: "mdi-dots-vertical",
          print: "mdi-printer",
        },
      },
      ...options,
    });

    // Register the DataTable component globally
    app.component(
      "DataTable",
      defineAsyncComponent(() => import("../components/datatables/index.vue"))
    );
  },
};
