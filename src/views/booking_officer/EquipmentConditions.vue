<template>
  <v-app>
    <div class="mt-4">
      <h2 class="text-h5 font-weight-medium mb-2 text-overline">Equipments Management</h2>
      <div class="d-flex justify-space-between align-center">
        <h2 class="text-h6 font-weight-medium d-flex">
          <div>
            <div>
              Important Links
            </div>
            <div class="d-flex text-caption">
              <v-btn to="/chief-technician/equipments" prepend-icon="mdi-keyboard-backspace" class="mr-4 mt-1"
                size="small" />
              Equipments Conditions
            </div>
          </div>
        </h2>

        <!-- Create Dialog -->
        <div class="px-4 text-center">
          <v-dialog v-model="createDialog" max-width="500">
            <template v-slot:activator="{ props }">
              <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" v-bind="props" @click="resetForm"
                class="text-capitalize text-caption">
                New Condition
              </v-btn>
            </template>
            <v-card title="Add Equipment Condition">
              <v-form class="px-4">
                <v-text-field label="Condition Name" v-model="form.name" />
                <v-textarea label="Description" v-model="form.description" />
              </v-form>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="createDialog = false" class="bg-grey">Close</v-btn>
                <v-btn color="green" @click="createCondition">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>

      <!-- Data Table -->
      <v-card class="elevation-1 mt-4">
        <v-card-text>
          <v-text-field class="text-caption" density="compact" v-model="search" label="Search conditions"
            prepend-inner-icon="mdi-magnify" clearable />
        </v-card-text>

        <v-data-table-server class="text-caption" v-model:items-per-page="itemsPerPage" :headers="headers"
          :items="serverItems" :items-length="totalItems" :loading="loading" item-value="name"
          @update:options="loadItems">
          <template #item.actions="{ item }">
            <!-- Edit Dialog -->
            <v-dialog v-model="editDialog" max-width="500">
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="flat" v-bind="props" @click="editCondition(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <v-card title="Edit Condition">
                <v-form class="px-4">
                  <v-text-field label="Condition Name" v-model="form.name" />
                  <v-textarea label="Description" v-model="form.description" />
                </v-form>
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="editDialog = false" class="bg-grey">Cancel</v-btn>
                  <v-btn color="green" @click="updateCondition">Update</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete -->
            <v-btn icon size="small" variant="flat" @click="confirmDelete(item)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table-server>
      </v-card>

      <!-- Confirm Delete Dialog -->
      <v-dialog v-model="confirmDialog" max-width="400">
        <v-card>
          <v-card-title>Confirm Delete</v-card-title>
          <v-card-text>
            Delete condition <strong>{{ selectedItem?.name }}</strong>?
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="confirmDialog = false" class="bg-grey">Close</v-btn>
            <v-btn @click="deleteConfirmed" class="bg-red text-white">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar-queue v-model="snackbars" :timeout="2000" />
    </div>
  </v-app>
</template>

<script setup>
  import { ref, onMounted, watch } from "vue";
  import { getAllData, postData, putData, deleteData } from "../../services/rest.services";

  const headers = [
    { title: "Name", key: "name" },
    { title: "Description", key: "description" }, // ✅ New
    { title: "Actions", key: "actions", sortable: false, align: 'end' },
  ];


  const itemsPerPage = ref(5);
  const search = ref("");
  const serverItems = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const snackbars = ref([]);

  const form = ref({ name: "", description: "" }); // ✅ Include description

  const selectedItem = ref(null);

  const createDialog = ref(false);
  const editDialog = ref(false);
  const confirmDialog = ref(false);
  const resetForm = () => {
    form.value = { name: "", description: "" };
  };


  const loadItems = async ({ page, itemsPerPage }) => {
    loading.value = true;
    try {
      const res = await getAllData("equipment_conditions");
      let allItems = res.equipment_conditions || [];

      if (search.value.trim()) {
        const term = search.value.toLowerCase();
        allItems = allItems.filter((item) =>
          item.name?.toLowerCase().includes(term)
        );
      }

      const start = (page - 1) * itemsPerPage;
      serverItems.value = allItems.slice(start, start + itemsPerPage);
      totalItems.value = allItems.length;
      showSnack("Conditions loaded", "success");
    } catch (e) {
      showSnack("Failed to load", "error");
    } finally {
      loading.value = false;
    }
  };

  const createCondition = async () => {
    try {
      await postData(form.value, "equipment_conditions");
      createDialog.value = false;
      showSnack("Condition added", "success");
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Create failed", "error");
    }
  };

  const updateCondition = async () => {
    try {
      await putData(form.value, `equipment_conditions/${form.value.id}`);
      editDialog.value = false;
      showSnack("Condition updated", "success");
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Update failed", "error");
    }
  };

  const editCondition = (item) => {
    form.value = { ...item };
    editDialog.value = true;
  };

  const confirmDelete = (item) => {
    selectedItem.value = item;
    confirmDialog.value = true;
  };

  const deleteConfirmed = async () => {
    try {
      await deleteData(`equipment_conditions/${selectedItem.value.id}`);
      confirmDialog.value = false;
      showSnack("Deleted successfully", "success");
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Delete failed", "error");
    }
  };

  const showSnack = (text, color) => {
    snackbars.value.push({ text, color });
  };

  onMounted(() => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
  });

  watch(search, () => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
  });
</script>