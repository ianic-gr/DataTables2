<script setup>
import moment from "moment";
import { VDateInput } from "vuetify/labs/VDateInput";

const model = defineModel();
const props = defineProps({
  returnFormat: {
    type: String,
    default: "DD-MM-YYYY",
  },
});

const dateInputVal = computed({
  get() {
    return model.value
      ? new Date(moment(model.value, props.returnFormat).format())
      : null;
  },
  set(v) {
    model.value = moment(v).format(props.returnFormat);
  },
});
</script>

<template>
  <VDateInput v-model="dateInputVal" />
</template>
