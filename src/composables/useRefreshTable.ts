import { useI18n } from "vue-i18n";
import { useDatastate } from "@/composables/useDataState";

export function useRefreshTable() {
  const datatablesPluginOptions = inject<any>("datatablesPluginOptions");
  const table_props = inject<any>("table_props");
  const busEmits = inject<any>("busEmits");

  const { t } = useI18n();
  const { deleteDataStorage } = useDatastate(table_props);

  const refreshTableItems = computed(() => [
    {
      title: `${t("$datatables.refresh")}`,
      onClick,
      prependIcon: datatablesPluginOptions.header.icons.refresh,
    },
  ]);

  const onClick = () => {
    deleteDataStorage();
    busEmits("refetchData");
  };

  return { refreshTableItems };
}
