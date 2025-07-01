<template>

  <div class="mt-4">
    <div class="pb-2 text-h6  border-b mb-4">Technician Schedules</div>
    <!-- New Schedule Button -->
    <div class="d-flex justify-end">
      <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" @click="openCreateDialog"
        class="text-capitalize mb-4">
        New Schedule
      </v-btn>
    </div>
    <!-- Create Schedule Dialog -->
    <v-dialog v-model="createDialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">Add Technician Schedule</span>
          <v-btn icon @click="createDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-form class="px-4">
            <v-text-field label="Start Date" v-model="form.startDate" type="date" />
            <v-text-field label="Number of Days" v-model="form.numberOfDays" type="number" />
            <v-textarea label="Description" v-model="form.description" />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="createDialog = false" variant="tonal">Cancel</v-btn>
          <v-btn color="green" @click="createSchedule">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Data Table -->
    <v-card class="elevation-1 bg">
      <v-card-text>
        <v-text-field density="compact" v-model="search" label="Search by Technician ID"
          prepend-inner-icon="mdi-magnify"  clearable />
      </v-card-text>

      <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
        :items-length="totalItems" :loading="loading" item-value="technicianId" @update:options="loadItems">

        <template #item.actions="{ item }">
          <v-dialog v-model="editDialog" max-width="500">
            <template v-slot:activator="{ props }">
              <v-btn icon size="small" variant="flat" v-bind="props" @click="editSchedule(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <v-card title="Edit Schedule">
              <v-form class="px-4">
                <v-text-field label="Technician ID" v-model="form.technicianId" />
                <v-text-field label="Start Date" v-model="form.startDate" type="date" />
                <v-text-field label="Number of Days" v-model="form.numberOfDays" type="number" />
                <v-textarea label="Description" v-model="form.description" />
              </v-form>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="editDialog = false" variant="tonal">Cancel</v-btn>
                <v-btn color="green" @click="updateSchedule">Update</v-btn>
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
        <v-card-text>Delete schedule for technician <strong>{{ selectedItem?.technicianId }}</strong>?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="confirmDialog = false" variant="tonal">Close</v-btn>
          <v-btn @click="deleteConfirmed" class="bg-red text-white">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar-queue v-model="snackbars" :timeout="2000" />
  </div>

</template>

<script setup>
  import { ref, onMounted, watch } from "vue";
  import { getAllData, postData, putData, deleteData } from "../../services/rest.services";

  const props = defineProps({ technician: Object });

  const headers = [
    { title: "Technician ID", key: "technicianId" },
    { title: "Start Date", key: "startDate" },
    { title: "Days", key: "numberOfDays" },
    { title: "Description", key: "description" },
    { title: "Actions", key: "actions", sortable: false, align: 'end' },
  ];

  const itemsPerPage = ref(5);
  const currentPage = ref(1);
  const search = ref("");
  const serverItems = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const snackbars = ref([]);

  const form = ref({
    technicianId: props.technician?.userId || "",
    startDate: "",
    numberOfDays: 1,
    description: "",
  });

  const selectedItem = ref(null);
  const createDialog = ref(false);
  const editDialog = ref(false);
  const confirmDialog = ref(false);

  const resetForm = () => {
    form.value = {
      technicianId: props.technician?.userId || "",
      startDate: "",
      numberOfDays: 1,
      description: "",
    };
  };

  const openCreateDialog = () => {
    resetForm();
    createDialog.value = true;
  };

  const loadItems = async ({ page, itemsPerPage }) => {
    currentPage.value = page;
    loading.value = true;
    try {
      const res = await getAllData("technician_schedules");
      let allItems = res.technician_schedules || [];

      if (search.value.trim()) {
        const term = search.value.toLowerCase();
        allItems = allItems.filter((item) =>
          item.technicianId?.toLowerCase().includes(term)
        );
      }

      const start = (page - 1) * itemsPerPage;
      const paginated = allItems.slice(start, start + itemsPerPage);
      serverItems.value = paginated;
      totalItems.value = allItems.length;
      showSnack("Schedules loaded", "success");
    } catch (e) {
      showSnack("Failed to load schedules", "error");
    } finally {
      loading.value = false;
    }
  };

  const createSchedule = async () => {
    try {
      await postData(form.value, "technician_schedules");
      createDialog.value = false;
      showSnack("Schedule added", "success");
      await loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Create failed", "error");
    }
  };

  const updateSchedule = async () => {
    try {
      await putData(form.value, `technician_schedules/${form.value.id}`);
      editDialog.value = false;
      showSnack("Schedule updated", "success");
      await loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Update failed", "error");
    }
  };

  const editSchedule = (item) => {
    form.value = { ...item };
    editDialog.value = true;
  };

  const confirmDelete = (item) => {
    selectedItem.value = item;
    confirmDialog.value = true;
  };

  const deleteConfirmed = async () => {
    try {
      await deleteData(`technician_schedules/${selectedItem.value.id}`);
      confirmDialog.value = false;
      showSnack("Deleted successfully", "success");
      await loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack("Delete failed", "error");
    }
  };

  const showSnack = (text, color) => {
    snackbars.value.push({ text, color });
  };

  onMounted(() => {
    loadItems({ page: currentPage.value, itemsPerPage: itemsPerPage.value });
  });

  watch(search, () => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
  });

  watch(
    () => props.technician,
    (newVal) => {
      if (newVal?.userId) {
        form.value.technicianId = newVal.userId;
      }
    },
    { immediate: true }
  );
</script>