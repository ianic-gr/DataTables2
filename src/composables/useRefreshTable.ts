import { useI18n } from "vue-i18n";

export function useRefreshTable() {
  const datatablesPluginOptions = inject<any>("datatablesPluginOptions");
  const table_props = inject<any>("table_props");
  const busEmits = inject<any>("busEmits");

  const { t } = useI18n();

  const refreshTableItems = computed(() => {
    return table_props.api
      ? [
          {
            title: `${t("$datatables.refresh")}`,
            onClick,
            prependIcon: datatablesPluginOptions.header.icons.refresh,
          },
        ]
      : [];
  });

  const onClick = () => {
    busEmits("refetchData");
  };

  return { refreshTableItems };
}
