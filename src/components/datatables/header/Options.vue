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
    ...table_props.options.header?.export?.buttons,
  },
  {
    title: `${t("$datatables.export")} CSV`,
    onClick: exportCsv,
    prependIcon: "mdi-file-delimited",
    ...table_props.options.header?.export?.buttons,
  },
  {
    title: `${t("$datatables.export")} PDF`,
    onClick: exportPDF,
    prependIcon: "mdi-file-pdf-box",
    ...table_props.options.header?.export?.buttons,
  },
  {
    title: t("$datatables.print"),
    onClick: printTable,
    prependIcon: "mdi-printer",
    ...table_props.options.header?.export?.buttons,
  },
  {
    title: t("$datatables.columns"),
    onClick: props.componentRefs.columns?.openDialog,
    prependIcon: "mdi-view-column",
    ...table_props.options.header?.columns?.button,
  },
  ...(table_props.options?.globalButtons ?? []),
]);
</script>

<template>
  <v-btn
    icon="mdi-dots-vertical"
    variant="text"
    v-bind="props"
    color="dark"
    density="comfortable"
  >
    <v-icon />
    <v-menu location="bottom end" activator="parent" offset="4">
      <v-list
        bg-color="surface-light"
        class="options-list d-flex flex-column ga-1 pa-1"
        density="compact"
        rounded="lg"
        variant="text"
        slim
      >
        <v-list-item
          v-for="(item, i) in items"
          v-bind="item"
          :key="i"
          rounded="lg"
          link
        />
      </v-list>
    </v-menu>
  </v-btn>
</template>

<style lang="scss">
.options-list {
  .v-list-item__spacer {
    width: 10px !important;
  }
}
</style>
