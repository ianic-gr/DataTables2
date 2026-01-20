<script setup lang="ts">
import { useRefreshTable } from "@/composables/useRefreshTable";

const { refreshTableItems } = useRefreshTable();
</script>

<template>
  <v-btn
    v-for="(item, i) in refreshTableItems"
    id="header-refreshTable"
    v-bind="item"
    :key="i"
    :text="item.title"
    variant="text"
    density="comfortable"
    color="dark"
    stacked
    class="text-capitalize"
  />
</template>
