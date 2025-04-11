import { defineAsyncComponent } from "vue";
export { useCellRendererFrameworks } from "../composables/useCellRendererFrameworks";

export default {
  install(app) {
    // Register a global component
    app.component(
      "DataTable",
      defineAsyncComponent(() => import("../components/datatables"))
    );
  },
};
