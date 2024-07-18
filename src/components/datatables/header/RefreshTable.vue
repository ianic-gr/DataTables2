<script setup>
const loading = ref(false);

const busEmits = inject("busEmits");

const onClick = () => {
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
    @click="onClick"
  />
</template>
