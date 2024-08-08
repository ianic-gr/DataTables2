<script setup>
import Table from "@/components/datatables/Table.vue";
import TableServer from "@/components/datatables/TableServer.vue";

const model = defineModel();
const table_props = inject("table_props");

const tableRef = ref(null);
const downloadModal = ref(false);

const busEmits = defineEmits(["refreshTable"]);

provide("busEmits", busEmits);
provide("tableRef", tableRef);
provide("downloadModal", downloadModal);
</script>

<template>
  <v-card>
    <v-card-title>
      <Header />
    </v-card-title>
    <v-card-text class="pa-0">
      <component
        ref="tableRef"
        v-model="model"
        :is="table_props.api ? TableServer : Table"
      />
    </v-card-text>
  </v-card>

  <v-dialog v-model="downloadModal" max-width="350" persistent>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
      <v-list-item
        prepend-icon="mdi-file-download"
        :title="$t('$datatables.preparing_download_file')"
      >
        <template v-slot:prepend>
          <div class="pe-4">
            <v-icon color="primary" size="x-large"></v-icon>
          </div>
        </template>

        <template v-slot:append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          ></v-progress-circular>
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>
