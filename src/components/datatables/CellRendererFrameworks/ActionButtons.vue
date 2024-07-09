<script setup>
const items = [
  { title: "Click Me", to: "ook", class: "text-red", disabled: true },
  { title: "Click Me" },
  { title: "Click Me" },
  { title: "Click Me 2" },
];
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
