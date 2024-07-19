<script setup>
import { useI18n } from "vue-i18n";
import { useExportExcel } from "@/composables/useExportExcel";
import { useExportCsv } from "@/composables/useExportCsv";
import { useExportPDF } from "@/composables/useExportPDF";
import { usePrint } from "@/composables/usePrint";

const { exportExcel } = useExportExcel();
const { exportCsv } = useExportCsv();
const { exportPDF } = useExportPDF();
const { printTable } = usePrint();

const table_props = inject("table_props");
const props = defineProps({
  componentRefs: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const { t } = useI18n();

const items = computed(() => [
  {
    title: `${t("$datatables.export")} Excel`,
    onClick: exportExcel,
    prependIcon: "mdi-file-excel",
  },
  {
    title: `${t("$datatables.export")} CSV`,
    onClick: exportCsv,
    prependIcon: "mdi-file-delimited",
  },
  {
    title: `${t("$datatables.export")} PDF`,
    onClick: exportPDF,
    prependIcon: "mdi-file-pdf-box",
  },
  {
    title: t("$datatables.print"),
    onClick: printTable,
    prependIcon: "mdi-printer",
  },
  {
    title: t("$datatables.columns"),
    onClick: props.componentRefs.columns?.openDialog,
    prependIcon: "mdi-view-column",
  },
  ...(table_props.options?.globalButtons ?? []),
]);
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        icon="mdi-dots-vertical"
        variant="text"
        v-bind="props"
        density="comfortable"
      ></v-btn>
    </template>

    <v-list class="options-list">
      <v-list-item v-for="(item, i) in items" v-bind="item" :key="i">
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style lang="scss">
.options-list {
  .v-list-item__spacer {
    width: 10px !important;
  }
}
</style>
