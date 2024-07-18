<script setup>
import { useTableState } from "@/composables/useTableState";

const { advancedFiltersState } = useTableState();

const table_props = inject("table_props");
const model = defineModel();

const chipName = (tag, key) => {
  const header = table_props.headers.find((header) => header.key === key);

  return `${header.title}: ${tag}`;
};

const removeFilter = (key) => {
  model.value[key] = null;
  emit("save");
};

const emit = defineEmits("save");
</script>

<template>
  <v-sheet class="px-3">
    <v-chip-group selected-class="text-primary" multiple>
      <v-chip
        class="my-0"
        v-for="(tag, key) in advancedFiltersState"
        :key="key"
        :text="chipName(tag, key)"
        closable
        :value="tag"
        active
        density="comfortable"
        @click:close="removeFilter(key)"
      ></v-chip>
    </v-chip-group>
  </v-sheet>
</template>
