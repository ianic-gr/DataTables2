<script setup>
import { storeToRefs } from "pinia";
import { useSideMenuStore } from "@/stores/sideMenuStore";

const sideMenuStore = useSideMenuStore();
const { menu } = storeToRefs(sideMenuStore);

const links = [
  { title: "Docs", to: "/" },
  { title: "Examples", to: "/examples" },
  { title: "Diagrams", to: "/diagrams" },
];

onMounted(() => {
  menu.value = [
    {
      title: "Types",
    },
  ];
});
</script>

<template>
  <v-app id="inspire">
    <v-app-bar flat>
      <v-container class="mx-auto d-flex align-center justify-center">
        <h2 class="me-5">📃 Datatables 2</h2>

        <v-btn
          v-for="link in links"
          :key="link.title"
          :to="link.to"
          :text="link.title"
          variant="text"
        />

        <v-spacer />

        <v-responsive max-width="160">
          <v-text-field
            density="compact"
            label="Search"
            rounded="lg"
            variant="solo-filled"
            flat
            hide-details
            single-line
          />
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list rounded="lg">
                <template v-for="(item, i) in menu" :key="i">
                  <v-list-item
                    v-if="item.to"
                    :title="item.title"
                    :to="item.to"
                    link
                  />

                  <p v-else class="px-4 font-weight-bold mt-2">
                    {{ item.title }}
                  </p>
                </template>

                <v-divider v-if="$route.path !== '/'" class="my-2" />

                <v-list-item
                  v-if="$route.path !== '/'"
                  to="/"
                  color="grey-lighten-4"
                  title="← Back"
                  link
                />
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <v-container>
                <router-view />
              </v-container>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
