<script setup lang="ts">
import { useAdvancedFilters } from "@/composables/useAdvancedFilters";
import { createReusableTemplate } from "@vueuse/core";

const { advancedFiltersItems, advancedFiltersDialog, activeAdvancedFilters } = useAdvancedFilters();
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();

interface Props {
  responsiveHeader: boolean;
}
defineProps<Props>();
</script>

<template>
  <div class="d-flex align-center" style="gap: 0.5rem">
    <DefineTemplate>
      <v-btn
        v-for="(item, i) in advancedFiltersItems"
        :key="i"
        icon
        variant="text"
        :color="activeAdvancedFilters ? 'primary' : 'dark'"
        density="comfortable"
        v-bind="item"
      >
        <v-icon :icon="item.prependIcon" />
      </v-btn>
    </DefineTemplate>

    <v-badge v-if="activeAdvancedFilters" color="primary" :content="activeAdvancedFilters">
      <ReuseTemplate />
    </v-badge>
    <div v-else>
      <ReuseTemplate />
    </div>

    <DatatablesHeaderAdvancedFiltersDialog v-model="advancedFiltersDialog" :show-selected="!responsiveHeader" />
  </div>
</template>
