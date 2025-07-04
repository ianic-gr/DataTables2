<script setup>
const model = defineModel();
const comparison = defineModel("comparison");
</script>

<template>
  <div class="d-flex align-center" style="gap: 1rem">
    <VNumberInput v-bind="$attrs" v-model="model" :precision="null" />
    <VSelect
      v-model="comparison"
      v-bind="$attrs"
      label="Comparison"
      :items="['>', '<', '>=', '<=', '=']"
      :max-width="150"
    />
  </div>
</template>
