import { defineAsyncComponent } from "vue";
import defu from "defu";
export { useCellRendererFrameworks } from "../composables/useCellRendererFrameworks.js";

// Main DataTable Plugin
export default {
  install(app, options) {
    app.provide(
      "pluginOptions",
      defu(options, {
        header: {
          icons: {
            advancedFilters: "mdi-filter-variant",
            search: "mdi-magnify",
            columns: "mdi-view-column-outline",
            download: "mdi-tray-arrow-down",
            refresh: "mdi-refresh",
            options: "mdi-dots-vertical",
            print: "mdi-printer",
            close: "mdi-close",
            excel: "mdi-file-excel",
            csv: "mdi-file-delimited",
            pdf: "mdi-file-pdf-box",
            drag: "mdi-drag-vertical",
          },
        },
      })
    );

    // Register the DataTable component globally
    app.component(
      "DataTable",
      defineAsyncComponent(() => import("../components/datatables/index.vue"))
    );
  },
};
