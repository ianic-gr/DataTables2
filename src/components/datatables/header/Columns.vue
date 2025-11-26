<script setup>
import { useI18n } from "vue-i18n";

const datatablesPluginOptions = inject("datatablesPluginOptions");

const { t } = useI18n();

defineProps({
  componentRefs: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>

<template>
  <v-btn
    :prepend-icon="datatablesPluginOptions.header.icons.columns"
    :text="t('$datatables.columns')"
    variant="text"
    density="comfortable"
    color="dark"
    stacked
    class="text-capitalize"
    @click="componentRefs.columns?.openDialog"
  />
</template>
