<script setup>
import { useI18n } from "vue-i18n";
import { usePrint } from "@/composables/usePrint";

const { printTable } = usePrint();

const table_props = inject("table_props");

const { t } = useI18n();

const menu = ref(false);

const items = computed(() => [
  {
    title: t("$datatables.print"),
    onClick: printTable,
    prependIcon: "mdi-printer",
    ...table_props.options.header?.export?.buttons,
  },
  ...(table_props.options?.globalButtons ?? []),
]);
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="bottom end">
    <template #activator="{ props }">
      <v-btn
        prepend-icon="mdi-dots-vertical"
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
