import { useI18n } from "vue-i18n";
import { useExportExcel } from "@/composables/useExportExcel";
import { useExportCsv } from "@/composables/useExportCsv";
import { useExportPDF } from "@/composables/useExportPDF";

export function useDownload() {
  const datatablesPluginOptions = inject<any>("datatablesPluginOptions");
  const table_props = inject<any>("table_props");

  const { t } = useI18n();
  const { exportExcel } = useExportExcel();
  const { exportCsv } = useExportCsv();
  const { exportPDF } = useExportPDF();

  const downloadItems = computed(() => [
    {
      title: `${t("$datatables.export")} Excel`,
      onClick: exportExcel,
      prependIcon: datatablesPluginOptions.header.icons.excel,
      ...table_props.options.header?.export?.buttons,
    },
    {
      title: `${t("$datatables.export")} CSV`,
      onClick: exportCsv,
      prependIcon: datatablesPluginOptions.header.icons.csv,
      ...table_props.options.header?.export?.buttons,
    },
    {
      title: `${t("$datatables.export")} PDF`,
      onClick: exportPDF,
      prependIcon: datatablesPluginOptions.header.icons.pdf,
      ...table_props.options.header?.export?.buttons,
    },
  ]);

  return { downloadItems };
}
