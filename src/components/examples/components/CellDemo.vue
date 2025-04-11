<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<template>{{ item.name }}</template>
