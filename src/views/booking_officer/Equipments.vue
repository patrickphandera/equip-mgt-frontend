<template>
  <v-app>
    <!-- Top Actions & Title -->
    <div class="mt-2">
      <div class="d-flex justify-space-between align-end mt-2">
        <div class="d-flex flex-column">
          <h2 class="font-weight-medium  text-overline">Equipments</h2>
          <div class="text-caption">
            Equipments management
          </div>
        </div>

        <div class="px-4 text-center">

          <v-dialog v-model="createDialog" max-width="800">
            <template v-slot:activator="{ props }">
              <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" class="text-capitalize text-caption"
                v-bind="props" @click="resetForm">
                New Equipment
              </v-btn>
            </template>

            <v-card title="Adding New Equipment">
              <v-form class="px-4">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Equipment Name" v-model="form.name" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select label="Category" v-model="form.category_id" :items="categoryItems" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Serial Number" v-model="form.serial_number" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select label="Condition" v-model="form.condition" :items="conditionItems" chips />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select label="Availability" v-model="form.availability" :items="availabilityItems" chips />
                  </v-col>
                </v-row>
              </v-form>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="createDialog = false" class="bg-grey text-capitalize">Close</v-btn>
                <v-btn color="white" @click="createEquipment" class="bg-green text-capitalize">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>

      <!-- Links -->

      <div class="d-flex mt-2">
        <v-btn
          class="font-weight-medium text-primary underline cursor-pointer elevation-1 px-2 mx-1 text-lowercase text-caption"
          to="/booking-officer/equipments-sets">Equipment sets</v-btn>
        <v-btn
          class="font-weight-medium text-primary underline cursor-pointer elevation-1 pa-1 ml-4 text-lowercase text-caption"
          to="/booking-officer/equipments-categories">Equipment categories</v-btn>
        <v-btn
          class="font-weight-medium text-primary px-2 cursor-pointer elevation-1 pa-1 mx-4 text-lowercase text-caption"
          to="/booking-officer/equipments-conditions">Equipment conditions</v-btn>
        <v-btn class="font-weight-medium text-primary px-2 cursor-pointer elevation-1 pa-1 text-lowercase text-caption"
          to="/booking-officer/equipments-availabilities">Equipment availability</v-btn>
      </div>
    </div>

    <!-- Equipment Data Table -->
    <v-card class="elevation-1 mt-4">
      <v-card-text>
        <v-text-field class="text-caption" density="compact" v-model="search" label="Search equipments"
          prepend-inner-icon="mdi-magnify" clearable />
      </v-card-text>

      <v-data-table-server class="text-caption" v-model:items-per-page="itemsPerPage" :headers="headers"
        :items="serverItems" :items-length="totalItems" :loading="loading" item-value="name"
        @update:options="loadItems">
        <template #item.actions="{ item }">

          <div class="d-flex">
            <!-- Edit Dialog -->
            <v-dialog v-model="editDialog" max-width="800">
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="flat" v-bind="props" @click="editEquipment(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <v-card title="Update Equipment">
                <v-form class="px-4">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Equipment Name" v-model="form.name" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select label="Category" v-model="form.category_id" :items="categoryItems" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Serial Number" v-model="form.serial_number" />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select label="Condition" v-model="form.condition" :items="conditionItems" chips />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select label="Availability" v-model="form.availability" :items="availabilityItems" chips />
                    </v-col>
                  </v-row>
                </v-form>
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="editDialog = false" class="text-capitalize bg-grey">Cancel</v-btn>
                  <v-btn color="white" @click="updateEquipment" class="text-capitalize bg-green">Update</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete -->
            <v-btn icon size="small" variant="flat" @click="confirmDelete(item)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Confirm Delete -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete <strong class="text-capitalize">{{ selectedItem?.name
            }}</strong>?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="confirmDialog = false" class="text-capitalize bg-grey">Close</v-btn>
          <v-btn @click="deleteConfirmed" class="text-capitalize bg-red text-white">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar-queue v-model="snackbars" :timeout="2000" />
  </v-app>
</template>

<script setup>
  import { ref, onMounted, watch } from "vue";
  import { getAllData, postData, putData, deleteData } from "../../services/rest.services";

  const headers = [
    { title: "Name", key: "name" },
    { title: "Category", key: "category_id" },
    { title: "Serial Number", key: "serial_number" },
    { title: "Condition", key: "condition" },
    { title: "Availability", key: "availability" },
    { title: "Actions", key: "actions", sortable: false },
  ];

  const itemsPerPage = ref(5);
  const search = ref("");
  const serverItems = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const snackbars = ref([]);

  const form = ref({});
  const selectedItem = ref(null);

  const createDialog = ref(false);
  const editDialog = ref(false);
  const confirmDialog = ref(false);

  const categories = ref([]);
  const conditions = ref([]);
  const availability = ref([]);

  const categoryItems = ref([]);
  const conditionItems = ref([]);
  const availabilityItems = ref([]);

  const loadItems = async ({ page, itemsPerPage }) => {
    loading.value = true;
    try {
      const res = await getAllData("equipments");
      let allItems = res.equipments || [];

      const res1 = await getAllData("equipment_categories");
      categories.value = res1.equipment_categories || [];
      categoryItems.value = categories.value.map(cat => cat.name);

      const res2 = await getAllData("equipment_conditions");
      conditions.value = res2.equipment_conditions || [];
      conditionItems.value = conditions.value.map(cond => cond.name);

      const res3 = await getAllData("equipment_availabilities");
      availability.value = res3.equipment_availabilities || [];
      availabilityItems.value = availability.value.map(avail => avail.name);

      allItems = allItems.map(item => {
        const category = categories.value.find(c => c.id === item.category_id);
        const condition = conditions.value.find(c => c.id === item.condition);
        const avail = availability.value.find(a => a.id === item.availability);

        return {
          ...item,
          category_id: category?.name || item.category_id,
          condition: condition?.name || item.condition,
          availability: avail?.name || item.availability,
        };
      });

      if (search.value.trim()) {
        const term = search.value.toLowerCase();
        allItems = allItems.filter(
          item =>
            item.name?.toLowerCase().includes(term) ||
            item.category_id?.toLowerCase().includes(term) ||
            item.serial_number?.toLowerCase().includes(term) ||
            item.condition?.toLowerCase().includes(term) ||
            item.availability?.toLowerCase().includes(term)
        );
      }

      const start = (page - 1) * itemsPerPage;
      serverItems.value = allItems.slice(start, start + itemsPerPage);
      totalItems.value = allItems.length;

      showSnack("Equipments loaded", "success");
    } catch (e) {
      console.error(e);
      showSnack("Failed to load", "error");
    } finally {
      loading.value = false;
    }
  };

  const resetForm = () => {
    form.value = {
      name: "",
      category_id: "",
      serial_number: "",
      condition: "Good",
      availability: "Available",
    };
  };

  const createEquipment = async () => {
    try {
      form.value.category_id = categories.value.find(c => c.name === form.value.category_id)?.id;
      form.value.condition = conditions.value.find(c => c.name === form.value.condition)?.id;
      form.value.availability = availability.value.find(a => a.name === form.value.availability)?.id;
      await postData(form.value, "equipments");
      createDialog.value = false;
      showSnack("Equipment created", "success");
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Failed to create", "error");
    }
  };

  const updateEquipment = async () => {
    try {
      form.value.category_id = categories.value.find(c => c.name === form.value.category_id)?.id;
      form.value.condition = conditions.value.find(c => c.name === form.value.condition)?.id;
      form.value.availability = availability.value.find(a => a.name === form.value.availability)?.id;
      await putData(form.value, `equipments/${form.value.id}`);
      editDialog.value = false;
      showSnack("Equipment updated", "success");
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Update failed", "error");
    }
  };

  const confirmDelete = (item) => {
    selectedItem.value = item;
    confirmDialog.value = true;
  };

  const deleteConfirmed = async () => {
    try {
      await deleteData(`equipments/${selectedItem.value.id}`);
      confirmDialog.value = false;
      showSnack("Deleted successfully", "success");
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Delete failed", "error");
    }
  };

  const editEquipment = (item) => {
    form.value = { ...item };
    editDialog.value = true;
  };

  const showSnack = (text, color) => {
    snackbars.value.push({ text, color, timeout: 2000 });
  };

  onMounted(() => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
  });

  watch(search, () => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
  });
</script>

<style scoped>
  .v-data-table .v-btn {
    margin: 0 2px;
  }
</style>