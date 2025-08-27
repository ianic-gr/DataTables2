import type { App, Plugin } from "vue";
import { defineAsyncComponent } from "vue";

export { useCellRendererFrameworks } from "../composables/useCellRendererFrameworks.js";

// Main DataTable Plugin
const DataTablePlugin: Plugin = {
  install(app: App) {
    // Register the DataTable component globally
    app.component(
      "DataTable",
      defineAsyncComponent(() => import("../components/datatables/index.vue"))
    );
  },
};

export default DataTablePlugin;
