<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { usePrint } from "@/composables/usePrint";
import { useDownload } from "@/composables/useDownload";
import { useRefreshTable } from "@/composables/useRefreshTable";
import { useColumns } from "@/composables/useColumns";
import { useAdvancedFilters } from "@/composables/useAdvancedFilters";

const table_props = inject<any>("table_props");
const datatablesPluginOptions = inject<any>("datatablesPluginOptions");

interface Props {
  responsiveHeader: boolean;
}
const props = defineProps<Props>();

const { t } = useI18n();
const { printTable } = usePrint();
const { downloadItems } = useDownload();
const { refreshTableItems } = useRefreshTable();
const { columnsItems, columnsRef } = useColumns();
const { advancedFiltersItems, advancedFiltersDialog } = useAdvancedFilters();

const menu = ref(false);

const items = computed(() => [
  {
    title: t("$datatables.print"),
    onClick: printTable,
    prependIcon: datatablesPluginOptions.header.icons.print,
    ...table_props.options.header?.export?.buttons,
  },
  ...(props.responsiveHeader ? downloadItems.value : []),
  ...(props.responsiveHeader ? refreshTableItems.value : []),
  ...(props.responsiveHeader ? columnsItems.value : []),
  ...(props.responsiveHeader ? advancedFiltersItems.value : []),
  ...(table_props.options?.globalButtons ?? []),
]);
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="bottom end">
    <template #activator="{ props }">
      <v-btn
        id="header-options"
        :prepend-icon="datatablesPluginOptions.header.icons.options"
        :text="$t('$datatables.more')"
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
      <v-list-item v-for="(item, i) in items" v-bind="item" :key="i" rounded="lg" link />
    </v-list>
  </v-menu>

  <DatatablesHeaderColumnsDialog v-if="responsiveHeader" ref="columnsRef" />
  <DatatablesHeaderAdvancedFiltersDialog v-if="responsiveHeader" v-model="advancedFiltersDialog" />
</template>
