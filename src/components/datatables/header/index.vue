<script setup>
import Search from "@/components/datatables/header/Search.vue";
import RefreshTable from "@/components/datatables/header/RefreshTable.vue";
import Options from "@/components/datatables/header/Options.vue";
import HardFilters from "@/components/datatables/header/HardFilters/index.vue";

const table_props = inject("table_props");

const columns = ref(null);
const advancedFiltersDialog = ref(false);
const optionAPIComponents = table_props.options?.header?.components ?? {};
</script>

<template>
  <div>
    <v-row>
      <v-col class="d-flex align-center" style="gap: 0.75rem">
        <v-btn
          variant="text"
          icon="mdi-filter-variant"
          color="dark"
          density="comfortable"
          @click="advancedFiltersDialog = true"
        />
        <component
          :is="optionAPIComponents.hardFilters ?? HardFilters"
          v-if="table_props.hardFilters.length"
          id="header-hardFilters"
        />
        <DatatablesHeaderAdvancedFilters v-model="advancedFiltersDialog" />
        <component :is="optionAPIComponents.toolbar" id="header-toolbar" />
      </v-col>
      <v-col class="d-flex align-center justify-end">
        <component
          :is="optionAPIComponents.search ?? Search"
          id="header-search"
          class="me-4"
        />
        <component
          :is="optionAPIComponents.refreshTable ?? RefreshTable"
          id="header-refreshTable"
        />
        <component
          :is="optionAPIComponents.options ?? Options"
          id="header-options"
          :component-refs="{ columns }"
        />
      </v-col>
    </v-row>
    <DatatablesHeaderColumns ref="columns" />
  </div>
</template>
