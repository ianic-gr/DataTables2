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

  const operator = tag.comparison === "=" ? ":" : " " + tag.comparison;
  const tags = Array.isArray(tag.value) ? tag.value : [tag.value];

  const returnTags = tags
    .filter((_, i) => {
      if (header.advancedFilter?.component === "datepicker") {
        if (i !== 0 && i !== tags.length - 1) {
          return false;
        }
      }

      return true;
    })
    .map((tag) => {
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

  return `${header.title}${operator} ${returnTags.join(", ")}`;
};

const removeFilter = (key) => {
  model.value[key] = { comparison: "=", value: null };
  emit("save");
};

const emit = defineEmits("save");
</script>

<template>
  <v-sheet>
    <v-chip-group>
      <v-chip
        v-for="(tag, key) in advancedFiltersState"
        :key="key"
        class="my-0"
        :text="chipName(tag, key)"
        closable
        :value="tag"
        density="comfortable"
        @click:close="removeFilter(key)"
      />
    </v-chip-group>
  </v-sheet>
</template>
