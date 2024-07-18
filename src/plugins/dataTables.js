import { defineAsyncComponent } from "vue";

export default {
  install(app) {
    // Register a global component
    app.component(
      "DataTable",
      defineAsyncComponent(() => import("../components/datatables"))
    );
    // .use(i18n);
  },
};
