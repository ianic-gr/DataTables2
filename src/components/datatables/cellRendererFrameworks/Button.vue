<script setup>
const props = defineProps({
  params: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const options = computed(() => {
  const frameworkOptionsFn = props.params.column?.cellRendererFrameworkOptions;

  return frameworkOptionsFn ? frameworkOptionsFn(props.params) : {};
});
</script>

<template>
  <v-btn v-bind="options"></v-btn>
</template>
