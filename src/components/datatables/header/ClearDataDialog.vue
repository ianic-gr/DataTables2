<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useDatatablesStore } from "@/stores/DatatablesStore";

const dialog = defineModel<boolean>("dialog", { default: false });

const table_props = inject<any>("table_props");
const datatablesPluginOptions = inject<any>("datatablesPluginOptions");
const busEmits = inject<any>("busEmits");

const { setData } = useDatatablesStore();
const { t } = useI18n();

const selected = ref(["advancedFilters", "search"]);

const clearOptions = [
  {
    label: t("$datatables.search"),
    value: "search",
  },
  {
    label: t("$datatables.advancedFilters"),
    value: "advancedFilters",
  },
  {
    label: "Hard Filters",
    value: "hardFilters",
  },
  {
    label: t("$datatables.options"),
    value: "options",
  },
];

const submit = () => {
  if (selected.value.includes("search")) {
    setData({
      table_id: table_props.id,
      name: "search",
      value: { query: "" },
    });
  }

  if (selected.value.includes("advancedFilters")) {
    setData({
      table_id: table_props.id,
      name: "advancedFilters",
      value: { query: {} },
    });
  }

  if (selected.value.includes("hardFilters")) {
    setData({
      table_id: table_props.id,
      name: "hardFilters",
      value: { query: {} },
    });
  }

  if (selected.value.includes("options")) {
    setData({
      table_id: table_props.id,
      name: "options",
      value: { state: {}, columns: { selected: [], sorted: [] } },
    });
  }

  dialog.value = false;
  busEmits("refreshTable");
};
</script>

<template>
  <v-dialog v-model="dialog" max-width="500" eager :retain-focus="false">
    <template #default="{ isActive }">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-medium-emphasis ps-2">
            {{ $t("$datatables.clearData.dialog.title") }}
          </div>

          <v-btn :icon="datatablesPluginOptions.header.icons.close" variant="text" @click="isActive.value = false" />
        </v-card-title>

        <v-divider />

        <v-card-text class="overflow-auto pt-8">
          <p>{{ $t("$datatables.clearData.dialog.description") }}</p>

          <v-checkbox
            v-for="option in clearOptions"
            :key="option.value"
            v-model="selected"
            color="primary"
            v-bind="option"
            hide-details
          />
        </v-card-text>
        <v-divider class="mt-2" />

        <v-card-actions class="my-2 d-flex justify-end">
          <v-btn class="text-none" :text="$t('$datatables.cancel')" @click="isActive.value = false" />
          <v-btn class="text-none" color="error" :text="$t('$datatables.clearData.button')" variant="flat" @click="submit" />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
