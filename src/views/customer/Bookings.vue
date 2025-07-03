<template>
  <v-app>
    <div class="mt-2">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex flex-column">
          <h2 class="text-overline font-weight-medium">Bookings</h2>
          <div class="text-caption">
            My Bookings
          </div>
        </div>

        <div class="px-2 text-center">
          <v-btn class="text-capitalize elevation-1" size='small' @click="createPayment">
            <v-icon>mdi-sort</v-icon>
          </v-btn>
          <v-dialog max-width="800" class="pb-8">
            <template v-slot:activator="{ props: activatorProps }">
              <!-- <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" @click="createUser"
                class="text-capitalize" v-bind="activatorProps">
                New Booking
              </v-btn> -->
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="Adding New Booking">
                <template v-slot:text>
                  <v-form>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Customer name"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Equipment set"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="District"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <div class="px-4 text-center">
                          <v-dialog class="pb-8">
                            <template v-slot:activator="{ props: activatorProps }">
                              <v-text-field label="Location" @click="createUser" v-bind="activatorProps"></v-text-field>
                            </template>

                            <template v-slot:default="{ isActive }">
                              <v-card title="Select Event Location">
                                <template v-slot:text>
                                  <Home></Home>
                                </template>
                                <v-card-actions class="pb-4">
                                  <v-spacer></v-spacer>

                                  <v-btn text="Close" variant="dense" class="text-capitalize bg-blue-grey-lighten-4"
                                    @click="isActive.value = false"></v-btn>

                                  <v-btn color="surface-variant" class="text-capitalize bg-primary"
                                    text="Select Location" variant="flat" @click="isActive.value = false"></v-btn>
                                </v-card-actions>
                              </v-card>
                              <v-spacer></v-spacer>
                            </template>
                          </v-dialog>
                        </div>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field label="Date"></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6">
                        <v-text-field label="Equipments"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Phone"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Payment "></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </template>
                <v-card-actions class="pb-4">
                  <v-spacer></v-spacer>

                  <v-btn text="Close" variant="dense" class="text-capitalize bg-blue-grey-lighten-4"
                    @click="isActive.value = false"></v-btn>

                  <v-btn color="surface-variant" class="text-capitalize bg-primary" text="Go to payment" variant="flat"
                    @click="isActive.value = false"></v-btn>
                </v-card-actions>
              </v-card>
              <v-spacer></v-spacer>
            </template>
          </v-dialog>
        </div>
      </div>

      <v-card class="elevation-1 mt-4 px-4">

        <v-text-field v-model="search" label="Search bookings" density="compact" prepend-inner-icon="mdi-magnify"
          clearable class="mt-4 text-caption" />

        <v-data-table-server class="text-caption" v-model:items-per-page="itemsPerPage" :headers="headers"
          :items="serverItems" :items-length="totalItems" :loading="loading" :search="search" item-value="customer_id"
          @update:options="loadItems">
          <template #item.location="{ item }">

            <v-btn icon variant="flat" @click="viewBooking(item)">
              <v-icon>mdi-unfold-more-vertical</v-icon>
            </v-btn>
          </template>
          <template #item.event_date="{ item }">
            {{ new Date(item.event_date).toLocaleDateString() }}
          </template>

          <template #item.total_amount="{ item }">
            ${{ item.total_amount.toFixed(2) }}
          </template>

          <template #item.equipment_ids="{ item }">
            {{ item.equipment_ids.length }} item(s)
            <v-btn icon variant="flat" @click="viewBooking(item)">
              <v-icon>mdi-unfold-more-vertical</v-icon>
            </v-btn>
          </template>

          <template #item.actions="{ item }">

            <v-btn icon variant="flat" @click="editBooking(item)">
              <v-icon>mdi-progress-wrench</v-icon>
            </v-btn>
            <v-btn icon variant="flat" @click="deleteBooking(item)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table-server>
      </v-card>
    </div>
    <v-snackbar v-model="snackbar">
      {{ text }}

      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
  import Home from "./Home";
  import { ref } from "vue";

  export default {
    components: { Home },
    data() {
      const bookings = [
        {
          location: "cust_001",
          event_date: "2025-05-01T18:00:00Z",
          district_id: "district_01",
          equipment_ids: ["eq_1", "eq_2"],
          phone: "99000001",
          name: "99000001",
          total_amount: 500.0,
        },
        {
          location: "cust_001",
          event_date: "2025-05-15T14:30:00Z",
          district_id: "district_02",
          equipment_ids: ["eq_3"],
          phone: "99000001",
          name: "99000001",
          total_amount: 250.5,
        },
        {
          location: "cust_001",
          event_date: "2025-06-01T09:00:00Z",
          district_id: "district_03",
          name: "99000001",
          equipment_ids: ["eq_4", "eq_5", "eq_6"],
          phone: "99000001",
          total_amount: 875.99,
        },
      ];

      const FakeAPI = {
        async fetch({ page, itemsPerPage, sortBy }) {
          return new Promise((resolve) => {
            setTimeout(() => {
              let items = bookings.slice();
              if (sortBy.length) {
                const { key, order } = sortBy[0];
                items.sort((a, b) =>
                  order === "desc"
                    ? String(b[key]).localeCompare(String(a[key]))
                    : String(a[key]).localeCompare(String(b[key]))
                );
              }
              const start = (page - 1) * itemsPerPage;
              const end = start + itemsPerPage;
              const paginated = items.slice(start, end === -1 ? undefined : end);
              resolve({ items: paginated, total: items.length });
            }, 300);
          });
        },
      };

      const headers = ref([
        // { title: "Customer ID", key: "customer_id", align: "start" },
        { title: "Customer Name ", key: "name", align: "start" },
        { title: "Phone ", key: "phone", align: "start" },
        { title: "Date", key: "event_date", align: "start" },
        { title: "District", key: "district_id", align: "start" },
        { title: "Location", key: "location", align: "start" },


        { title: "Equipments", key: "equipment_ids", align: "start" },
        { title: "Paid", key: "total_amount", align: "start" },
        { title: "Balance", key: "total_amount", align: "start" },


        { title: "Actions", key: "actions", sortable: false },
      ]);

      const itemsPerPage = ref(8);
      const search = ref("");
      const serverItems = ref([]);
      const loading = ref(true);
      const totalItems = ref(0);

      function loadItems({ page, itemsPerPage, sortBy }) {
        loading.value = true;
        FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
          serverItems.value = items;
          totalItems.value = total;
          loading.value = false;
        });
      }

      return {
        snackbar: false,
        text: `Hello, I'm a snackbar`,
        headers,
        bookings,
        loading,
        totalItems,
        serverItems,
        itemsPerPage,
        search,
        loadItems,
      };
    },
    methods: {
      createBooking() {
        console.log("Creating booking...");
      },
      viewBooking(item) {
        console.log("View", item);
      },
      editBooking(item) {
        console.log("Edit", item);
      },
      deleteBooking(item) {
        console.log("Delete", item);
      },
    },
  };
</script>

<style scoped>
  .v-data-table .v-btn {
    margin: 0 2px;
  }
</style>