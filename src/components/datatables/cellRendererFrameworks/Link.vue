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
  <RouterLink v-if="options.to" v-bind="options">{{ options.text }}</RouterLink>
  <a v-else v-bind="options">{{ options.text }}</a>
</template>
