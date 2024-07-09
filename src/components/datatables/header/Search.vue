<script setup>
import { useDatatablesStore } from "@/stores/DatatablesStore";
import { watchDebounced } from "@vueuse/core";

const datatablesStore = useDatatablesStore();
const { setData } = datatablesStore;

const table_props = inject("table_props");

const search = ref(null);

watchDebounced(
  search,
  (v) => {
    setData({
      table_id: table_props.props.id,
      name: "search",
      value: { query: v },
    });
  },
  { debounce: 1000, maxWait: 5000 }
);

onMounted(() => {
  search.value = table_props.searchState.value;
});
</script>

<template>
  <div class="w-100" style="max-width: 280px">
    <v-text-field
      v-model="search"
      density="comfortable"
      variant="underlined"
      label="search"
      clearable
      hide-details
    />
  </div>
</template>
