<script setup>
import Table from "@/components/datatables/Table.vue";
import TableServer from "@/components/datatables/TableServer.vue";

const model = defineModel();

const table_props = inject("table_props");
</script>

<template>
  <v-card>
    <v-card-title>
      <Header />
    </v-card-title>
    <v-card-text class="pa-0">
      <component v-model="model" :is="table_props.api ? TableServer : Table" />
    </v-card-text>
  </v-card>
</template>
