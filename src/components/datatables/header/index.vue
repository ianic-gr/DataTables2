<script setup lang="ts">
const Search = defineAsyncComponent(() => import("@/components/datatables/header/Search.vue"));
const RefreshTable = defineAsyncComponent(() => import("@/components/datatables/header/RefreshTable.vue"));
const Options = defineAsyncComponent(() => import("@/components/datatables/header/Options.vue"));
const HardFilters = defineAsyncComponent(() => import("@/components/datatables/header/HardFilters/index.vue"));
const Columns = defineAsyncComponent(() => import("@/components/datatables/header/Columns/index.vue"));
const Download = defineAsyncComponent(() => import("@/components/datatables/header/Download/index.vue"));

const table_props = inject<any>("table_props");

interface Props {
  responsiveHeader: boolean;
}
defineProps<Props>();

const columns = ref(null);
const optionAPIComponents = table_props.options?.header?.components ?? {};
</script>

<template>
  <div class="d-flex align-center" style="gap: 0.75rem">
    <DatatablesHeaderAdvancedFilters v-if="!responsiveHeader" />

    <component
      :is="optionAPIComponents.hardFilters ?? HardFilters"
      v-if="table_props.hardFilters.length"
      id="header-hardFilters"
    />

    <component :is="optionAPIComponents.toolbar" id="header-toolbar" />

    <div class="ms-auto">
      <component :is="optionAPIComponents.search ?? Search" id="header-search" />
      <component :is="optionAPIComponents.columns ?? Columns" v-if="!responsiveHeader" :component-refs="{ columns }" />
      <component :is="optionAPIComponents.download ?? Download" v-if="!responsiveHeader" />
      <component :is="optionAPIComponents.refreshTable ?? RefreshTable" v-if="!responsiveHeader" />
      <component :is="optionAPIComponents.options ?? Options" :responsive-header />
    </div>
  </div>
</template>
