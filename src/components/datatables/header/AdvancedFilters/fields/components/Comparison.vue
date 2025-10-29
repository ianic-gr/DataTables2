<script setup lang="ts">
const model = defineModel<number>();
const comparison = defineModel<string>("comparison");
</script>

<template>
  <div class="d-flex align-center" style="gap: 1rem">
    <VNumberInput
      v-bind="$attrs"
      v-model="model"
      :precision="null"
      decimal-separator=","
    />
    <VSelect
      v-model="comparison"
      v-bind="$attrs"
      label="Comparison"
      :items="['>', '<', '>=', '<=', '=']"
      :max-width="150"
    />
  </div>
</template>
