import { ref, watch, computed, nextTick, onBeforeMount } from "vue";
import { useDatatablesStore } from "../stores/DatatablesStore";
import { storeToRefs } from "pinia";

export function useDatastate(props) {
  const datatablesStore = useDatatablesStore();
  const { getCurrentTable } = datatablesStore;
  const { tables } = storeToRefs(datatablesStore);

  const saving = ref(false);
  const dataState = ref(null);
  const version = 1;

  const tableDataState = computed(() => getCurrentTable(props.id));

  watch(tableDataState, async (data) => await dataStateSave(data), {
    deep: true,
  });

  const dataStateSave = async (data) => {
    if (saving.value) return;
    saving.value = true;

    await nextTick();

    const storage = dataStateFetch();
    const currentTableStorageIndex = storage.findIndex(
      (table) => table.id === props.id
    );

    if (currentTableStorageIndex > -1) {
      storage[currentTableStorageIndex] = data;
    } else {
      storage.push(data);
    }

    localStorage.setItem("datatables-state", JSON.stringify(storage));
    saving.value = false;
  };

  const dataStateFetch = () => {
    const storage = localStorage.getItem("datatables-state");
    const data = JSON.parse(storage ?? "[]");

    return data;
  };

  const dataStateGet = () => {
    const fetchedData = dataStateFetch();
    let storageData = fetchedData.find((table) => table.id === props.id);

    return storageData;
  };

  onBeforeMount(() => {
    dataState.value = dataStateFetch();

    const storageVersion = localStorage.getItem("datatables-state-v");

    if (parseInt(storageVersion) !== parseInt(version)) {
      localStorage.removeItem("datatables-state");
      localStorage.setItem("datatables-state-v", version);
    }
  });

  return {
    saving,
    dataState,
    dataStateGet,
    tableDataState,
  };
}
