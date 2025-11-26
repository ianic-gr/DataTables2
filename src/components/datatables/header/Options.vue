<script setup>
import { useI18n } from "vue-i18n";
import { usePrint } from "@/composables/usePrint";

const table_props = inject("table_props");
const pluginOptions = inject("pluginOptions");

const { t } = useI18n();
const { printTable } = usePrint();

const menu = ref(false);

const items = computed(() => [
  {
    title: t("$datatables.print"),
    onClick: printTable,
    prependIcon: pluginOptions.header.icons.print,
    ...table_props.options.header?.export?.buttons,
  },
  ...(table_props.options?.globalButtons ?? []),
]);
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="bottom end">
    <template #activator="{ props }">
      <v-btn
        :prepend-icon="pluginOptions.header.icons.options"
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
</template>
