<script setup lang="ts">
import { useAdvancedFilters } from "@/composables/useAdvancedFilters";

const { advancedFiltersItems, advancedFiltersDialog, activeAdvancedFilters } = useAdvancedFilters();
</script>

<template>
  <div>
    <v-btn
      v-for="(item, i) in advancedFiltersItems"
      :key="i"
      icon
      variant="text"
      :color="activeAdvancedFilters ? 'primary' : 'dark'"
      density="comfortable"
      v-bind="item"
    >
      <v-badge v-if="activeAdvancedFilters" color="primary" :content="activeAdvancedFilters">
        <v-icon :icon="item.prependIcon" />
      </v-badge>
      <v-icon v-else :icon="item.prependIcon" />
    </v-btn>

    <DatatablesHeaderAdvancedFiltersDialog v-model="advancedFiltersDialog" />
  </div>
</template>
