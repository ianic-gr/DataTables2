import { useI18n } from "vue-i18n";

export function useColumns() {
  const datatablesPluginOptions = inject<any>("datatablesPluginOptions");

  const { t } = useI18n();

  const columnsRef = ref();

  const columnsItems = computed(() => {
    return [
      {
        title: `${t("$datatables.columns")}`,
        onClick: columnsRef.value?.openDialog,
        prependIcon: datatablesPluginOptions.header.icons.columns,
      },
    ];
  });

  return { columnsItems, columnsRef };
}
