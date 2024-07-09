<script setup>
import { useExportExcel } from "@/composables/useExportExcel";

const { exportExcel } = useExportExcel();

const items = [
  {
    title: "Export Excel",
    onClick: exportExcel,
    prependIcon: "mdi-file-excel",
  },
  {
    title: "Columns",
    onClick: exportExcel,
    prependIcon: "mdi-view-column",
  },
];
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        icon="mdi-dots-vertical"
        variant="text"
        v-bind="props"
        density="comfortable"
      ></v-btn>
    </template>

    <v-list class="options-list">
      <v-list-item v-for="(item, i) in items" v-bind="item" :key="i">
      </v-list-item>
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
