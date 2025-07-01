<template>
  <v-app>
    <div class="mt-4">
      <h2 class="text-overline font-weight-medium ">Equipments Management</h2>
      <div class="d-flex justify-space-between align-center">
        <h2 class="text-h6 font-weight-medium d-flex">

          <div>
            <div class="text-overline">
              Important Links
            </div>
            <div class="d-flex text-caption">
              <v-btn to="/chief-technician/equipments" prepend-icon="mdi-keyboard-backspace" class="mr-4"
                size="small"></v-btn> Equipments Avilabilities
            </div>
          </div>
        </h2>
        <div class="px-4 text-center">
          <!-- Create Dialog -->
          <v-dialog v-model="createDialog" max-width="500">
            <template v-slot:activator="{ props }">
              <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" v-bind="props" class="text-capitalize"
                @click="resetForm">
                New Category
              </v-btn>
            </template>
            <v-card title="Add Equipment Category">
              <v-form class="px-4">
                <v-text-field label="Category Name" v-model="form.name" />
              </v-form>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="createDialog = false" class="bg-grey">Close</v-btn>
                <v-btn color="green" @click="createCategory">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>

      <!-- Data Table -->
      <v-card class="elevation-1 mt-4">
        <v-card-text>
          <v-text-field class="text-caption" density="compact" v-model="search" label="Search availability"
            prepend-inner-icon="mdi-magnify" clearable />
        </v-card-text>

        <v-data-table-server class="text-caption" v-model:items-per-page="itemsPerPage" :headers="headers"
          :items="serverItems" :items-length="totalItems" :loading="loading" item-value="name"
          @update:options="loadItems">
          <template #item.actions="{ item }">
            <v-dialog v-model="editDialog" max-width="500">
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="flat" v-bind="props" @click="editCategory(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <v-card title="Edit Category">
                <v-form class="px-4">
                  <v-text-field label="Category Name" v-model="form.name" />
                </v-form>
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="editDialog = false" class="bg-grey">Cancel</v-btn>
                  <v-btn color="green" @click="updateCategory">Update</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

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
          <v-card-text>Delete category <strong>{{ selectedItem?.name }}</strong>?</v-card-text>
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
  import {
    getAllData,
    postData,
    putData,
    deleteData,
  } from "../../services/rest.services";

  const headers = [
    { title: "Name", key: "name" },
    { title: "Actions", key: "actions", sortable: false, align: 'end' },
  ];

  const itemsPerPage = ref(5);
  const search = ref("");
  const serverItems = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const snackbars = ref([]);

  const form = ref({ name: "" });
  const selectedItem = ref(null);

  const createDialog = ref(false);
  const editDialog = ref(false);
  const confirmDialog = ref(false);

  const resetForm = () => {
    form.value = { name: "" };
  };

  const loadItems = async ({ page, itemsPerPage }) => {
    loading.value = true;
    try {
      const res = await getAllData("equipment_availabilities");
      let allItems = res.equipment_availabilities || [];

      if (search.value.trim()) {
        const term = search.value.toLowerCase();
        allItems = allItems.filter((item) =>
          item.name?.toLowerCase().includes(term)
        );
      }

      const start = (page - 1) * itemsPerPage;
      const paginated = allItems.slice(start, start + itemsPerPage);
      serverItems.value = paginated;
      totalItems.value = allItems.length;
      showSnack("Avilabilities loaded", "success");
    } catch (e) {
      showSnack("Failed to load", "error");
    } finally {
      loading.value = false;
    }
  };

  const createCategory = async () => {
    try {
      await postData(form.value, "equipment_availabilities");
      createDialog.value = false;
      showSnack("Category added", "success");
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Create failed", "error");
    }
  };

  const updateCategory = async () => {
    try {
      await putData(form.value, `equipment_availabilities/${form.value.id}`);
      editDialog.value = false;
      showSnack("Category updated", "success");
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Update failed", "error");
    }
  };

  const editCategory = (item) => {
    form.value = { ...item };
    editDialog.value = true;
  };

  const confirmDelete = (item) => {
    selectedItem.value = item;
    confirmDialog.value = true;
  };

  const deleteConfirmed = async () => {
    try {
      await deleteData(`equipment_availabilities/${selectedItem.value.id}`);
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