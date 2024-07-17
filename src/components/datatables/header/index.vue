<script setup>
const columns = ref(null);
</script>

<template>
  <v-row>
    <v-col class="d-flex align-center">
      <AdvancedFilters />
    </v-col>
    <v-col class="d-flex align-center justify-end">
      <Columns ref="columns" />
      <Search class="me-4" />
      <RefreshTable />
      <Options :component-refs="{ columns }" />
    </v-col>
  </v-row>
</template>
