<script setup>
import { useI18n } from "vue-i18n";
import { useExportExcel } from "@/composables/useExportExcel";
import { useExportCsv } from "@/composables/useExportCsv";
import { useExportPDF } from "@/composables/useExportPDF";

const { exportExcel } = useExportExcel();
const { exportCsv } = useExportCsv();
const { exportPDF } = useExportPDF();

const table_props = inject("table_props");

const { t } = useI18n();

const menu = ref(false);

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
]);
</script>

=

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom center"
  >
    <template #activator="{ props }">
      <v-btn
        prepend-icon="mdi-tray-arrow-down"
        :text="t('$datatables.download')"
        variant="text"
        density="comfortable"
        color="dark"
        stacked
        class="text-capitalize"
        v-bind="props"
      />
    </template>

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
</template>

<style lang="scss">
.options-list {
  .v-list-item__spacer {
    width: 10px !important;
  }
}
</style>
