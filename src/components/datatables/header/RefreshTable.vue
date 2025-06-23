<script setup>
import { useDatastate } from "@/composables/dataState";

const loading = ref(false);

const busEmits = inject("busEmits");
const table_props = inject("table_props");

const { deleteDataStorage } = useDatastate(table_props);

const onClick = () => {
  deleteDataStorage();
  busEmits("refreshTable");
};
</script>

<template>
  <v-btn
    :disabled="loading"
    icon="mdi-refresh"
    text="Refresh"
    variant="text"
    density="comfortable"
    color="dark"
    @click="onClick"
  />
</template>
