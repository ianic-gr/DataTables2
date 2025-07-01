<script setup>
import { useTableState } from "@/composables/useTableState";

const { advancedFiltersState } = useTableState();

const table_props = inject("table_props");
const model = defineModel();

const chipName = (tag, key) => {
  const header = table_props.headers.find((header) => {
    const headerKey = header.advancedFilter?.key ?? header.key;
    return headerKey === key;
  });

  const tags = Array.isArray(tag) ? tag : [tag];

  const returnTags = tags.map((tag) => {
    const advancedFilterItems = header.advancedFilter?.options?.items ?? [];
    let tagItem = tag;
    let foundFilter;

    if (advancedFilterItems.length) {
      foundFilter = advancedFilterItems.find((v) => v.value === tag);

      if (foundFilter) {
        tagItem = foundFilter.title;
      }
    }

    if (typeof header.advancedFilter?.valueFormatter === "function") {
      tagItem = header.advancedFilter.valueFormatter({
        item: foundFilter,
        value: tag,
      });
    }

    return tagItem;
  });

  return `${header.title}: ${returnTags}`;
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
        v-for="(tag, key) in advancedFiltersState"
        :key="key"
        class="my-0"
        :text="chipName(tag, key)"
        closable
        :value="tag"
        active
        density="comfortable"
        @click:close="removeFilter(key)"
      />
    </v-chip-group>
  </v-sheet>
</template>
