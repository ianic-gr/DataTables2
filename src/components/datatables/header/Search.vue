<script setup>
import { useDatatablesStore } from "@/stores/DatatablesStore";
import { useTableState } from "@/composables/useTableState";
import { watchDebounced } from "@vueuse/core";
import { useTemplateRef } from "vue";

const datatablesStore = useDatatablesStore();
const { searchState } = useTableState();

const { setData } = datatablesStore;

const table_props = inject("table_props");

const search = ref(null);
const menu = ref(false);
const searchField = useTemplateRef("searchField"); // Add template ref for the text field

const searchActive = computed(() => {
  return searchState.value;
});

watchDebounced(
  search,
  (v) => {
    setData({
      table_id: table_props.id,
      name: "search",
      value: { query: v },
    });
  },
  { debounce: 1000, maxWait: 5000 }
);

watch(menu, (isOpen) => {
  if (isOpen) {
    setTimeout(() => {
      searchField.value?.focus();
    }, 250);
  }
});

onMounted(() => {
  search.value = searchState.value;
});
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    location="bottom center"
  >
    <template #activator="{ props }">
      <v-btn
        prepend-icon="mdi-magnify"
        :text="$t('$datatables.search')"
        variant="text"
        density="comfortable"
        :color="searchActive ? 'primary' : 'dark'"
        stacked
        class="text-capitalize"
        v-bind="props"
      />
    </template>

    <v-card min-width="300">
      <v-card-text>
        <v-text-field
          ref="searchField"
          v-model="search"
          density="comfortable"
          :label="$t('$datatables.search')"
          variant="outlined"
          clearable
          hide-details
          prepend-inner-icon="mdi-magnify"
        />
      </v-card-text>
    </v-card>
  </v-menu>
</template>
