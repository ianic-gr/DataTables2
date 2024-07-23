<script setup>
import { useDatatablesStore } from "@/stores/DatatablesStore";
import { useTableState } from "@/composables/useTableState";

const datatablesStore = useDatatablesStore();
const { advancedFiltersState } = useTableState();
const { setData } = datatablesStore;

const dialog = ref(false);
const advancedFiltersData = ref({});

const table_props = inject("table_props");

const save = () => {
  advancedFiltersData.value = Object.entries(advancedFiltersData.value)
    .filter(([key, value]) => value)
    .reduce((result, [key, value]) => {
      result[key] = value;
      return result;
    }, {});

  setData({
    table_id: table_props.id,
    name: "advancedFilters",
    value: { query: advancedFiltersData.value },
  });

  dialog.value = false;
};

const advancedFilterHeaders = computed(() => {
  return table_props.headers.filter((header) => {
    return header.advancedFilter !== false && !header.hidden;
  });
});

onMounted(() => {
  advancedFiltersData.value = { ...advancedFiltersState.value };
});
</script>

<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="text"
        icon="mdi-filter-outline"
        density="comfortable"
      />

      <Selected v-model="advancedFiltersData" @save="save" />
    </template>

    <template v-slot:default="{ isActive }">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-medium-emphasis ps-2">
            {{ $t("$datatables.advancedFilters") }}
          </div>

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
            v-for="(header, i) in advancedFilterHeaders"
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
            :text="$t('$datatables.cancel')"
            @click="isActive.value = false"
          ></v-btn>

          <v-btn
            class="text-none"
            color="primary"
            :text="$t('$datatables.submit')"
            variant="flat"
            @click="save"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
