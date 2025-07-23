<script setup>
import Search from "@/components/datatables/header/Search.vue";
import RefreshTable from "@/components/datatables/header/RefreshTable.vue";
import Options from "@/components/datatables/header/Options.vue";
import HardFilters from "@/components/datatables/header/HardFilters/index.vue";
import Columns from "@/components/datatables/header/Columns.vue";
import Download from "@/components/datatables/header/Download.vue";
import { useTableState } from "@/composables/useTableState";

const table_props = inject("table_props");

const { advancedFiltersState } = useTableState();

const columns = ref(null);
const advancedFiltersDialog = ref(false);
const optionAPIComponents = table_props.options?.header?.components ?? {};

const activeAdvancedFilters = computed(() => {
  return Object.keys(advancedFiltersState.value).length;
});
</script>

<template>
  <div>
    <v-row>
      <v-col class="d-flex align-center" style="gap: 0.75rem">
        <v-btn
          variant="text"
          icon="mdi-filter-variant"
          :color="activeAdvancedFilters ? 'primary' : 'dark'"
          density="comfortable"
          @click="advancedFiltersDialog = true"
        >
          <v-badge
            v-if="activeAdvancedFilters"
            color="primary"
            :content="activeAdvancedFilters"
          >
            <v-icon />
          </v-badge>

          <v-icon v-else />
        </v-btn>
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
        />
        <component
          :is="optionAPIComponents.columns ?? Columns"
          id="header-columns"
          :component-refs="{ columns }"
        />
        <component
          :is="optionAPIComponents.download ?? Download"
          id="header-download"
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
