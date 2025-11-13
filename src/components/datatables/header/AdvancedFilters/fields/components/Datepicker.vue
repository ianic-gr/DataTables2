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

    if (isMultiple) {
      returnValue = model.value
        .filter((val) => moment(val, format).isValid())
        .map((val) => new Date(moment(val, format).format()));
    } else if (moment(model.value, format).isValid()) {
      returnValue = new Date(moment(model.value, format).format());
    }

    return returnValue;
  },
  set: (value) => {
    const format = props.returnFormat;
    const isMultiple = Array.isArray(value);

    if (isMultiple) {
      model.value = value
        .filter((val) => moment(val).isValid())
        .map((val) => moment(val).format(format));
    } else {
      model.value = moment(value).isValid()
        ? moment(value).format(format)
        : undefined;
    }
  },
});
</script>

<template>
  <VDateInput v-model="dateInputVal" />
</template>
