import { defineAsyncComponent } from "vue";

export { useCellRendererFrameworks } from "../composables/useCellRendererFrameworks.js";

// Main DataTable Plugin
export default {
  install(app) {
    // Register the DataTable component globally
    app.component(
      "DataTable",
      defineAsyncComponent(() => import("../components/datatables/index.vue"))
    );
  },
};
