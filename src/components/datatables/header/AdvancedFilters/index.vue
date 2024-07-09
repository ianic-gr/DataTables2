<script setup>
import { useDatatablesStore } from "@/stores/DatatablesStore";

const datatablesStore = useDatatablesStore();
const { setData } = datatablesStore;

const dialog = ref(false);
const advancedFiltersData = ref({});

const table_props = inject("table_props");

const save = () => {
  setData({
    table_id: table_props.props.id,
    name: "advancedFilters",
    value: { query: advancedFiltersData.value },
  });

  dialog.value = false;
};
</script>

<template>
  <v-sheet class="py-4 px-1">
    <v-chip-group selected-class="text-primary" multiple>
      <v-chip
        v-for="(tag, key) in advancedFiltersData"
        :key="key"
        :text="`${table_props.props.headers[key]}: ${tag}`"
      ></v-chip>
    </v-chip-group>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="text"
        icon="mdi-filter-outline"
        density="comfortable"
      >
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-medium-emphasis ps-2">Advanced Filters</div>

          <v-btn
            icon="mdi-close"
            variant="text"
            @click="isActive.value = false"
          ></v-btn>
        </v-card-title>

        <v-divider class="mb-4"></v-divider>

        <v-card-text>
          <v-text-field
            v-model="advancedFiltersData[header.key]"
            v-for="(header, i) in table_props.props.headers"
            :key="i"
            :label="header.title"
            variant="underlined"
            clearable
          ></v-text-field>
        </v-card-text>

        <v-divider class="mt-2"></v-divider>

        <v-card-actions class="my-2 d-flex justify-end">
          <v-btn
            class="text-none"
            text="Cancel"
            @click="isActive.value = false"
          ></v-btn>

          <v-btn
            class="text-none"
            color="primary"
            text="Send"
            variant="flat"
            @click="save"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
