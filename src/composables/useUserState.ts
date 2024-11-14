import { createSharedComposable } from "@vueuse/core";

interface Column {
  selected?: string[];
  sorted?: string[];
}

interface State {
  page?: number;
  itemsPerPage?: number;
  sortBy?: string[];
  groupBy?: string[];
  search?: string;
}

interface StoreOptions {
  state: Ref<State>;
  columns: Ref<Column>;
}

interface SetUserOptionsParams {
  state?: State | null;
  columns?: Column | null;
}

interface Shell {
  storeOptions: StoreOptions;
  setUserOptions: (params: SetUserOptionsParams) => void;
}

export const useUserState = createSharedComposable(() => {
  const storeState = shallowRef<State>({});

  const storeColumns = shallowRef<Column>({});

  const setUserOptions = ({
    state = null,
    columns = null,
  }: SetUserOptionsParams) => {
    if (state) {
      storeState.value = state;
    }

    if (columns) {
      storeColumns.value = columns;
    }
  };

  const shell: Shell = {
    storeOptions: {
      state: storeState,
      columns: storeColumns,
    },
    setUserOptions,
  };

  return shell;
});
