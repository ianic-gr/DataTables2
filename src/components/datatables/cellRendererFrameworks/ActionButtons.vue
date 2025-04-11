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
  <v-menu class="action-buttons">
    <template #activator="{ props: btnProps }">
      <v-btn
        icon="mdi-dots-vertical"
        variant="text"
        v-bind="btnProps"
        size="small"
      />
    </template>
    <v-list>
      <v-list-item v-for="(item, i) in items" v-bind="item" :key="i" />
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
