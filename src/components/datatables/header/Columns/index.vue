<script setup>
import Sortable from "sortablejs";
import { useTableState } from "@/composables/useTableState";
import { useDatastate } from "@/composables/dataState";

const table_props = inject("table_props");
const datatablesPluginOptions = inject("datatablesPluginOptions");

const { tableState } = useTableState();
const { tableDataState } = useDatastate(table_props);

const componentKey = ref(0);
const list = ref(null);
const dialog = ref(false);
const sortedHeaders = ref([]);

const selectedList = ref([]);
const sortedList = ref([]);

const openDialog = () => {
  dialog.value = true;
};

onMounted(async () => {
  await nextTick();
  Sortable.create(list.value.$el, {
    onEnd: async (evt) => {
      const newSortedList = Array.from(evt.from.children).map(function (item) {
        return item.getAttribute("header-keys");
      });

      if (JSON.stringify(newSortedList) !== JSON.stringify(sortedList.value)) {
        sortedList.value = newSortedList;
      }
    },
  });

  selectedList.value = tableState.value.options.columns?.selected;
  sortedList.value = tableState.value.options.columns?.sorted;

  sortedHeaders.value = sortedList.value.map((sortedHeader) => {
    return table_props.headers.find((header) => header.key === sortedHeader);
  });
});

const save = () => {
  if (
    JSON.stringify(selectedList.value) !== JSON.stringify(tableState.value.options.columns?.selected) ||
    JSON.stringify(sortedList.value) !== JSON.stringify(tableState.value.options.columns?.sorted)
  ) {
    tableDataState.value.options.columns.selected = selectedList.value;
    tableDataState.value.options.columns.sorted = sortedList.value;
  }

  dialog.value = false;
};

defineExpose({ openDialog });
</script>

<template>
  <v-dialog v-model="dialog" max-width="500" eager :retain-focus="false">
    <template #default="{ isActive }">
      <v-card rounded="lg">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="text-medium-emphasis ps-2">
            {{ $t("$datatables.selectColumns") }}
          </div>

          <v-btn :icon="datatablesPluginOptions.header.icons.close" variant="text" @click="isActive.value = false" />
        </v-card-title>

        <v-divider />

        <v-card-text class="overflow-auto pt-8">
          <v-list ref="list">
            <v-list-item
              v-for="(header, i) in sortedHeaders"
              :key="`${componentKey}-${i}`"
              :title="header?.title"
              :header-keys="header?.key"
              @click="() => {}"
            >
              <template #prepend>
                <v-checkbox v-model="selectedList" :value="header?.key" hide-details />
              </template>

              <template #append>
                <v-icon :icon="datatablesPluginOptions.header.icons.drag" />
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider class="mt-2" />

        <v-card-actions class="my-2 d-flex justify-end">
          <v-btn class="text-none" :text="$t('$datatables.cancel')" @click="isActive.value = false" />

          <v-btn class="text-none" color="primary" :text="$t('$datatables.submit')" variant="flat" @click="save" />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
