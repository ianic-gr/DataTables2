<script setup>
import { VTextField, VSelect } from "vuetify/components";
import { VNumberInput } from "vuetify/labs/VNumberInput";
import Datepicker from "@/components/datatables/header/AdvancedFilters/fields/components/Datepicker.vue";

const table_props = inject("table_props");

const advancedFiltersData = defineModel();
const emit = defineEmits(["closeDialog", "save"]);

const defaultFilterComponents = {
  textfield: VTextField,
  select: VSelect,
  number: VNumberInput,
  datepicker: Datepicker,
};

const advancedFilterHeaders = computed(() => {
  return table_props.headers.filter((header) => {
    return header.advancedFilter !== false && !header.hidden;
  });
});

const getComponent = (comp) => {
  if (!comp) return defaultFilterComponents["textfield"];

  return typeof comp === "string" ? defaultFilterComponents[comp] : comp;
};

onMounted(async () => {
  await table_props.options.advancedFilters?.onMounted();
});
</script>

<template>
  <v-card rounded="lg">
    <v-card-title class="d-flex justify-space-between align-center">
      <div class="text-medium-emphasis ps-2">
        {{ $t("$datatables.advancedFilters") }}
      </div>

      <v-btn
        icon="mdi-close"
        variant="text"
        @click="emit('closeDialog')"
      ></v-btn>
    </v-card-title>

    <v-divider class="mb-4"></v-divider>

    <v-card-text>
      <div
        :id="`advanced-filter-${header.key}`"
        :class="`advanced-filter advanced-filter--${header.key}`"
        v-for="(header, i) in advancedFilterHeaders"
        :key="i"
      >
        <component
          :is="getComponent(header.advancedFilter?.component)"
          v-model="advancedFiltersData[header.key]"
          v-bind="header.advancedFilter?.options"
          :label="header.title"
          variant="underlined"
          clearable
        />
      </div>
    </v-card-text>

    <v-divider class="mt-2"></v-divider>

    <v-card-actions class="my-2 d-flex justify-end">
      <v-btn
        class="text-none"
        :text="$t('$datatables.cancel')"
        @click="emit('closeDialog')"
      ></v-btn>

      <v-btn
        class="text-none"
        color="primary"
        :text="$t('$datatables.submit')"
        variant="flat"
        @click="emit('save')"
      ></v-btn>
    </v-card-actions>
  </v-card>
</template>
