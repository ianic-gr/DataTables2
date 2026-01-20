import { useI18n } from "vue-i18n";
import { useTableState } from "@/composables/useTableState";

export function useAdvancedFilters() {
  const datatablesPluginOptions = inject<any>("datatablesPluginOptions");

  const { t } = useI18n();
  const { advancedFiltersState } = useTableState();

  const advancedFiltersDialog = ref(false);

  const activeAdvancedFilters = computed(() => Object.keys(advancedFiltersState.value).length);
  const advancedFiltersItems = computed(() => {
    return [
      {
        title: `${t("$datatables.advancedFilters")}`,
        onClick: () => (advancedFiltersDialog.value = true),
        prependIcon: datatablesPluginOptions.header.icons.advancedFilters,
      },
    ];
  });

  return { advancedFiltersItems, advancedFiltersDialog, activeAdvancedFilters };
}
