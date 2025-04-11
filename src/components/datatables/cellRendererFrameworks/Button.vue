<script setup lang="ts">
import type { RouterLinkProps } from "vue-router";

interface Props {
  options?: Record<string, any> & RouterLinkProps;
}
withDefaults(defineProps<Props>(), {
  options: () => ({ to: "#" }),
});
</script>

<template>
  <v-btn v-bind="options" />
</template>
