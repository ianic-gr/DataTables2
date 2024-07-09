<script setup>
const items = ref([{ title: "No Items" }]);

const props = defineProps({
  params: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

onMounted(() => {
  const options = props.params.column.cellRendererFrameworkOptions(
    props.params
  );

  items.value = options?.buttons ?? [];
});
</script>

<template>
  <v-menu>
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
