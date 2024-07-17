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

const items = computed(() => {
  return options.value?.buttons ?? [{ title: "No Items" }];
});
</script>

<template>
  <v-menu class="action-buttons">
    <template v-slot:activator="{ props }">
      <v-btn
        icon="mdi-dots-vertical"
        variant="text"
        v-bind="props"
        size="small"
      />
    </template>

    <v-list>
      <v-list-item v-bind="item" v-for="(item, i) in items" :key="i">
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style lang="scss">
.action-buttons {
  .v-list-item__spacer {
    width: 10px !important;
  }
}
</style>
