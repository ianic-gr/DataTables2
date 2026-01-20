<script setup lang="ts">
import { useColumns } from "@/composables/useColumns";

const { columnsItems, columnsRef } = useColumns();
</script>
<template>
  <div class="d-inline-block">
    <v-btn
      v-for="(item, i) in columnsItems"
      id="header-columns"
      v-bind="item"
      :key="i"
      :text="item.title"
      variant="text"
      density="comfortable"
      color="dark"
      stacked
      class="text-capitalize"
    />
    <DatatablesHeaderColumnsDialog ref="columnsRef" />
  </div>
</template>
