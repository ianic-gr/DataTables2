<script setup lang="ts">
import { useDownload } from "@/composables/useDownload";

const { downloadItems } = useDownload();
</script>

<template>
  <v-list
    bg-color="surface-light"
    class="options-list d-flex flex-column ga-1 pa-1"
    density="compact"
    rounded="lg"
    variant="text"
    slim
  >
    <v-list-item v-for="(item, i) in downloadItems" v-bind="item" :key="i" rounded="lg" link />
  </v-list>
</template>
