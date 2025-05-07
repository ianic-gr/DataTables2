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
  <div>
    <RouterLink v-if="options.to" v-bind="options">
      {{ options.text }}
    </RouterLink>
    <a v-else v-bind="options">{{ options.text }}</a>
  </div>
</template>
