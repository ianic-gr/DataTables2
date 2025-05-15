<script setup lang="ts">
import { computed } from "vue";

interface Props {
  buttons?: Record<string, any>[];
}
const props = withDefaults(defineProps<Props>(), {
  buttons: () => [],
});

const items = computed(() => {
  return props.buttons ?? [{ title: "No Items" }];
});
</script>

<template>
  <v-btn icon="mdi-dots-vertical" variant="text" size="small">
    <v-icon />
    <v-menu
      class="action-buttons"
      location="bottom end"
      activator="parent"
      offset="4"
    >
      <v-list
        bg-color="surface-light"
        class="options-list d-flex flex-column ga-1 pa-1"
        density="compact"
        rounded="lg"
        variant="text"
        slim
      >
        <v-list-item
          v-for="(item, i) in items"
          v-bind="item"
          :key="i"
          rounded="lg"
          link
        />
      </v-list>
    </v-menu>
  </v-btn>
</template>

<style lang="scss">
.options-list {
  .v-list-item__spacer {
    width: 10px !important;
  }
}
</style>
