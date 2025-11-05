<script setup>
import { useDatastate } from "@/composables/dataState";
import { useI18n } from "vue-i18n";

const busEmits = inject("busEmits");
const table_props = inject("table_props");
const pluginOptions = inject("pluginOptions");

const { deleteDataStorage } = useDatastate(table_props);
const { t } = useI18n();

const loading = ref(false);

const onClick = () => {
  deleteDataStorage();
  busEmits("refetchData");
};
</script>

<template>
  <v-btn
    :disabled="loading"
    :prepend-icon="pluginOptions.header.icons.refresh"
    :text="t('$datatables.refresh')"
    variant="text"
    density="comfortable"
    color="dark"
    stacked
    class="text-capitalize"
    @click="onClick"
  />
</template>
