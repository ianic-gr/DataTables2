// Plugins
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Layouts from "vite-plugin-vue-layouts-next";
import Vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import { VueRouterAutoImports } from "unplugin-vue-router";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import * as path from "path";

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      dts: "src/typed-router.d.ts",
    }),
    Layouts(),
    AutoImport({
      imports: [
        "vue",
        VueRouterAutoImports,
        {
          pinia: ["defineStore", "storeToRefs"],
        },
      ],
      dts: "src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    Components({
      dts: "src/components.d.ts",
      deep: true,
      directoryAsNamespace: true,
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    Vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    Fonts({
      google: {
        families: [
          {
            name: "Roboto",
            styles: "wght@100;300;400;500;700;900",
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: [
      "vuetify",
      "vue-router",
      "unplugin-vue-router/runtime",
      "unplugin-vue-router/data-loaders",
      "unplugin-vue-router/data-loaders/basic",
    ],
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  build: {
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(__dirname, "src/plugins/dataTables.js"),
      formats: ["es", "cjs"],
      name: "DataTables2",
      fileName: (format) => `datatables.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["vue", "vuetify", "pinia", "vue-i18n", "moment"],
      output: {
        globals: {
          vue: "Vue",
          vuetify: "Vuetify",
          pinia: "Pinia",
        },
        // manualChunks: {
        //   sortablejs: ["sortablejs"],
        //   jspdf: ["jspdf", "jspdf-autotable"],
        //   xlsx: ["xlsx"],
        //   exporttocsv: ["export-to-csv"],
        //   printjs: ["print-js"],
        //   filesaver: ["file-saver"],
        // },
      },
    },
  },
  server: {
    port: 3000,
  },
});
