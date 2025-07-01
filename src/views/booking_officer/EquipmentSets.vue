<template>
  <v-app>
    <div class="mt-4">
      <h2 class="text-h5 font-weight-medium  text-overline">Equipments Management</h2>

      <!-- Header Controls -->
      <div class="d-flex justify-space-between align-center">
        <div class="text-h6 font-weight-medium d-flex align-center">
          <div>
            <div class="text-overline">
              Important Links
            </div>
            <div class="d-flex">
              <v-btn to="/chief-technician/equipments" prepend-icon="mdi-keyboard-backspace"
                class="mr-4 mt-1 elevation-1 text-caption" size="small" variant="text"></v-btn>

              <div class="text-caption">
                Equipment Sets
              </div>
            </div>
          </div>
        </div>



        <!-- New Set Dialog -->
        <div class="px-4 text-center">
          <v-dialog v-model="createDialog" max-width="500">
            <template v-slot:activator="{ props }">
              <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" v-bind="props" @click="resetForm"
                class="text-capitalize text-caption">
                New Set
              </v-btn>
            </template>

            <v-card title="Add Equipment Set">
              <v-form class="px-4">
                <v-text-field label="Set Name" v-model="form.name" />
                <v-text-field type="number" label="Cost (MWK)" v-model="form.bookingCost" />
                <v-select :items="[0,1, 2,3,4,4,6]" type="number" label="Number Of Technicians"
                  v-model="form.numberOfTechnicians" />
                <v-text-field type="number" label="Technician Allowance (MWK)" v-model="form.technicianAllowance" />
                <v-select label="Transport Needed" :items="['Yes', 'No']" v-model="form.transportNeeded" />

                <v-select label="Status" :items="['Available', 'Booked','Maintainance','Fauty']"
                  v-model="form.status" />
                <v-file-input label="Background Pictures" v-model="form.pictures" multiple @change="handleFileUpload" />
              </v-form>
              <v-row>
                <v-col v-for="(file, index) in pictures" :key="index" cols="4">
                  <v-img :src="URL.createObjectURL(file)" height="100" />
                </v-col>
              </v-row>

              <v-card-actions>
                <v-spacer />
                <v-btn @click="createDialog = false" class="bg-grey">Close</v-btn>
                <v-btn color="green" @click="createSet">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>

      <!-- Data Table -->
      <v-card class="elevation-1 mt-4">
        <v-card-text>
          <v-text-field density="compact" v-model="search" label="Search equipment sets"
            prepend-inner-icon="mdi-magnify" clearable class="text-caption" />
        </v-card-text>

        <v-data-table-server class="text-caption" v-model:items-per-page="itemsPerPage" :headers="headers"
          :items="serverItems" :items-length="totalItems" :loading="loading" item-value="name"
          @update:options="loadItems">
          <template #item.actions="{ item }">
            <!-- Edit Dialog -->
            <v-dialog v-model="editDialog" max-width="500">
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="flat" v-bind="props" @click="editSet(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <v-card title="Edit Equipment Set">
                <v-form class="px-4">
                  <v-text-field label="Set Name" v-model="form.name" />
                </v-form>
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="editDialog = false" class="bg-grey">Cancel</v-btn>
                  <v-btn color="green" @click="updateSet">Update</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete Button -->
            <v-btn icon size="small" variant="flat" @click="confirmDelete(item)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>

          <!-- Add Equipment Set Items -->
          <template #item.items="{ item }">
            <AddEquipmentSetItems :id="item.id" />
          </template>
        </v-data-table-server>
      </v-card>

      <!-- Confirm Delete Dialog -->
      <v-dialog v-model="confirmDialog" max-width="400">
        <v-card>
          <v-card-title>Confirm Delete</v-card-title>
          <v-card-text>
            Delete set <strong>{{ selectedItem?.name }}</strong>?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="confirmDialog = false" class="bg-grey">Close</v-btn>
            <v-btn @click="deleteConfirmed" class="bg-red text-white">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar -->
      <v-snackbar-queue v-model="snackbars" :timeout="2000" />
    </div>
  </v-app>
</template>
<script>
  import { ref, onMounted, watch } from "vue";
  import AddEquipmentSetItems from "../../components/AddEquipmentSetItems.vue";
  import { getAllData, postData, putData, deleteData, postFormData } from "../../services/rest.services";

  export default {
    components: {
      AddEquipmentSetItems,
    },
    data() {
      return {
        headers: [
          { title: "Name", key: "name" },
          { title: "Cost", key: "bookingCost" },
          { title: "Technicians", key: "numberOfTechnicians" },
          { title: "Allowance", key: "technicianAllowance" },
          { title: "Transport", key: "transportNeeded" },
          { title: "Status", key: "status" },
          { title: "Manage set items", key: "items", sortable: false, align: "end" },
          { title: "Actions", key: "actions", sortable: false, align: "end" },
        ],
        itemsPerPage: 5,
        search: "",
        selectedFiles: [],
        serverItems: [],
        totalItems: 0,
        loading: false,
        snackbars: [],
        form: {
          id: null,
          name: "",
          bookingCost: "",
          numberOfTechnicians: "",
          technicianAllowance: "",
          transportNeeded: "Yes",
          status: "Active",
          pictures: null,
        },
        selectedItem: null,
        createDialog: false,
        editDialog: false,
        confirmDialog: false,
      };
    },
    methods: {
      resetForm() {
        this.form = {
          id: null,
          name: "",
          bookingCost: 0.0,
          numberOfTechnicians: 1,
          technicianAllowance: 0.0,
          transportNeeded: "Yes",
          status: "available",
          pictures: null,
        };
        this.selectedFiles = [];
      },
      async loadItems({ page, itemsPerPage }) {
        this.loading = true;
        try {
          const res = await getAllData("equipment_sets");
          let allItems = res.equipment_sets || [];

          if (this.search.trim()) {
            const term = this.search.toLowerCase();
            allItems = allItems.filter((item) =>
              item.name?.toLowerCase().includes(term)
            );
          }

          const start = (page - 1) * itemsPerPage;
          const paginated = allItems.slice(start, start + itemsPerPage);
          this.serverItems = paginated;
          this.totalItems = allItems.length;
          this.showSnack("Sets loaded", "success");
        } catch (e) {
          this.showSnack("Failed to load sets", "error");
        } finally {
          this.loading = false;
        }
      },
      handleFileUpload(event) {
        this.selectedFiles = Array.from(event.target.files);
      },
      async createSet() {
        try {
          const formData = new FormData();
          this.form.status = this.form.status.toLowerCase();
          this.form.transportNeeded = this.form.transportNeeded === "Yes";

          this.selectedFiles.forEach((file) => {
            formData.append("pictures", file);
          });

          formData.append("name", this.form.name);
          formData.append("status", this.form.status);
          formData.append("bookingCost", this.form.bookingCost);
          formData.append("numberOfTechnicians", this.form.numberOfTechnicians);
          formData.append("technicianAllowance", this.form.technicianAllowance);
          formData.append("transportNeeded", this.form.transportNeeded);

          await postFormData(formData, "equipment_sets");

          this.createDialog = false;
          this.showSnack("Set added", "success");
          await this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
        } catch (e) {
          this.showSnack("Failed to create set", "error");
        }
      },
      async updateSet() {
        try {
          await putData(this.form, `equipment_sets/${this.form.id}`);
          this.editDialog = false;
          this.showSnack("Set updated", "success");
          await this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
        } catch (e) {
          this.showSnack("Update failed", "error");
        }
      },
      editSet(item) {
        this.form = { ...item };
        this.editDialog = true;
      },
      confirmDelete(item) {
        this.selectedItem = item;
        this.confirmDialog = true;
      },
      async deleteConfirmed() {
        try {
          await deleteData(`equipment_sets/${this.selectedItem.id}`);
          this.confirmDialog = false;
          this.showSnack("Deleted successfully", "success");
          await this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
        } catch (e) {
          this.showSnack("Delete failed", "error");
        }
      },
      showSnack(text, color) {
        this.snackbars.push({ text, color });
      },
    },
    mounted() {
      this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
    },
    watch: {
      search() {
        this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage });
      },
    },
  };
</script>