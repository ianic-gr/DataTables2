<script setup>
import Search from "@/components/datatables/header/Search.vue";
import RefreshTable from "@/components/datatables/header/RefreshTable.vue";
import Options from "@/components/datatables/header/Options.vue";
import HardFilters from "@/components/datatables/header/HardFilters/index.vue";

const table_props = inject("table_props");

const columns = ref(null);
const optionAPIComponents = table_props.options?.header?.components ?? {};
</script>

<template>
  <v-row>
    <v-col class="d-flex align-center">
      <DatatablesHeaderAdvancedFilters />
      <component
        v-if="table_props.hardFilters.length"
        id="header-hardFilters"
        :is="optionAPIComponents.hardFilters ?? HardFilters"
        class="me-4"
      />
      <component
        id="header-toolbar"
        :is="optionAPIComponents.toolbar"
        class="me-4"
      />
    </v-col>
    <v-col class="d-flex align-center justify-end">
      <component
        id="header-search"
        :is="optionAPIComponents.search ?? Search"
        class="me-4"
      />
      <component
        id="header-refreshTable"
        :is="optionAPIComponents.refreshTable ?? RefreshTable"
      />
      <component
        id="header-options"
        :is="optionAPIComponents.options ?? Options"
        :component-refs="{ columns }"
      />
    </v-col>
  </v-row>
  <DatatablesHeaderColumns ref="columns" />
</template>
