<script setup lang="ts">
import { useI18n } from "vue-i18n";

const datatablesPluginOptions = inject<any>("datatablesPluginOptions");
const { t } = useI18n();
const menu = ref(false);
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="bottom center">
    <template #activator="{ props }">
      <v-btn
        id="header-download"
        :prepend-icon="datatablesPluginOptions.header.icons.download"
        :text="t('$datatables.download')"
        variant="text"
        density="comfortable"
        color="dark"
        stacked
        class="text-capitalize"
        v-bind="props"
      />
    </template>

    <DatatablesHeaderDownloadList />
  </v-menu>
</template>
