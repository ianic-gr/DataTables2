<script setup>
const loading = ref(false);

const onClick = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
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
