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
  get: () => {
    const format = props.returnFormat;
    const isMultiple = Array.isArray(model.value);
    let returnValue;

    if (!model.value) return;

    if (isMultiple && model.value.length) {
      returnValue = model.value.map(
        (val) => new Date(moment(val, format).format())
      );
    } else {
      returnValue = new Date(moment(model.value, format).format());
    }

    return returnValue;
  },
  set: (value) => {
    const format = props.returnFormat;
    const isMultiple = Array.isArray(value);

    if (isMultiple && value.length) {
      model.value = value.map((val) => moment(val).format(format));
    } else {
      model.value = moment(value).format(format);
    }
  },
});
</script>

<template>
  <VDateInput v-model="dateInputVal" />
</template>
