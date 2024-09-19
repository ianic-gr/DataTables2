import { ref, watch, computed, nextTick, onBeforeMount } from "vue";
import { useDatatablesStore } from "../stores/DatatablesStore";
import { storeToRefs } from "pinia";

export function useDatastate(props) {
  const datatablesStore = useDatatablesStore();
  const { getCurrentTable, setTableHash, hashString } = datatablesStore;
  const { tables } = storeToRefs(datatablesStore);

  const saving = ref(false);
  const version = 3;

  const tableDataState = computed(() => getCurrentTable(props.id));

  watch(
    tableDataState,
    async (data) => {
      if (!data.options.hash) return;

      await dataStateSave(data);
    },
    {
      deep: true,
    }
  );

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

  const checkTableState = async () => {
    const storageVersion = localStorage.getItem("datatables-state-v");

    if (parseInt(storageVersion) !== parseInt(version)) {
      localStorage.removeItem("datatables-state");
      localStorage.setItem("datatables-state-v", version);
    }

    const currentTableState = dataStateGet();
    const currentTableStateHash = currentTableState?.options.hash;

    if (currentTableStateHash) {
      const currentHash = await hashString(JSON.stringify(props.headers ?? []));

      if (currentTableStateHash !== currentHash) {
        localStorage.removeItem("datatables-state");
      }
    }

    setTableHash({ table_id: props.id, headers: props.headers });
  };

  const deleteDataStorage = () => {
    localStorage.removeItem("datatables-state");
    localStorage.removeItem("datatables-state-v");
  };

  return {
    saving,
    dataStateGet,
    tableDataState,
    checkTableState,
    deleteDataStorage,
  };
}
