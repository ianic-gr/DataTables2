import type { App, Plugin } from "vue";
import { defineAsyncComponent } from "vue";
export { useCellRendererFrameworks } from "../composables/useCellRendererFrameworks.js";

const DataTablePlugin: Plugin = {
  install(app: App) {
    // Register a global component
    app.component(
      "DataTable",
      defineAsyncComponent(() => import("../components/datatables/index.vue"))
    );
  },
};

export default DataTablePlugin;
