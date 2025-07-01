<template>
  <v-app>
    <!-- Top Actions & Title -->
    <div class="">
      <div class="d-flex justify-space-between align-start mt-2">
        <div class="d-flex flex-column">
          <h2 class="text-h5 font-weight-medium text-overline">Users</h2>
          <div class=" text-caption">
            User Management
          </div>
        </div>
        <div class="px-4 text-center">
          <v-dialog v-model="createDialog" max-width="800">
            <template v-slot:activator="{ props }">
              <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" class="text-capitalize text-caption"
                v-bind="props" @click="resetForm">
                New User
              </v-btn>
            </template>

            <v-card title="Adding New User">
              <v-form class="px-4">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field label="First Name" v-model="form.firstname" required />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Last Name" v-model="form.lastname" required />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Phone" v-model="form.phone" required />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select label="Gender" v-model="form.gender" :items="['male', 'female', 'other']" required />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select label="Role" v-model="form.role" :items="['user', 'admin']" required />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Email" v-model="form.email" type="email" required />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select label="District" v-model="form.district" :items="['Mzimba']" required />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-select label="Location" v-model="form.locationId" :items="locationItems" item-title="name"
                      item-value="id" required />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Password" v-model="form.password" type="password" required />
                  </v-col>
                </v-row>
              </v-form>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="createDialog = false" class="bg-grey text-capitalize">Close</v-btn>
                <v-btn color="white" @click="createUser" class="bg-green text-capitalize">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </div>

    <!-- User Data Table -->
    <v-card class="elevation-1 mt-4">
      <v-card-text>
        <v-text-field density="compact" v-model="search" label="Search users" prepend-inner-icon="mdi-magnify"
          clearable />
      </v-card-text>

      <v-data-table-server class="text-caption" v-model:items-per-page="itemsPerPage" :headers="headers"
        :items="serverItems" :items-length="totalItems" :loading="loading" item-value="name"
        @update:options="loadItems">
        <template #item.locationId="{ item }">{{
          locations.filter(location=>location.id==item.locationId)[0]?.name

          }}</template>
        <template #item.actions="{ item }">
          <div class="d-flex">
            <!-- Edit Dialog -->
            <v-dialog v-model="editDialog" max-width="800">
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="flat" v-bind="props" @click="editUser(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <v-card title="Update User">
                <v-form class="px-4">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field label="First Name" v-model="form.firstname" required />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Last Name" v-model="form.lastname" required />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Phone" v-model="form.phone" required />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select label="Gender" v-model="form.gender" :items="['male', 'female', 'other']" required />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select label="Role" v-model="form.role" :items="['user', 'admin']" required />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Email" v-model="form.email" type="email" required />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select label="District" v-model="form.district" :items="['Mzimba']" item-title="name"
                        class="text-capitalize" item-value="id" required />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select label="Location" v-model="form.locationId" :items="locationItems" item-title="name"
                        class="text-capitalize" item-value="id" required />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field label="Password" v-model="form.password" type="password" required />
                    </v-col>
                  </v-row>
                </v-form>
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="editDialog = false" class="text-capitalize bg-grey">Cancel</v-btn>
                  <v-btn color="white" @click="updateUser" class="text-capitalize bg-green">Update</v-btn>
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
  import { ref, onMounted, watch, computed } from 'vue';
  import { getAllData, postData, putData, deleteData } from '../../services/rest.services';

  const headers = [

    { title: 'First Name', key: 'firstname' },
    { title: 'Last Name', key: 'lastname' },
    { title: 'Email', key: 'email' },
    { title: 'Phone', key: 'phone' },
    { title: 'Gender', key: 'gender' },
    { title: 'Role', key: 'role' },
    { title: 'District', key: 'district' },
    { title: 'Location', key: 'locationId' },
    { title: 'Actions', key: 'actions', sortable: false }
  ];


  const itemsPerPage = ref(5);
  const search = ref('');
  const serverItems = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const snackbars = ref([]);

  const form = ref({
    id: null, // internal identifier
    userID: "",
    recentSchedule: "",
    busyDays: [],
    phone: "",
    email: "",
    activeStatus: "active" // assuming ActiveStatus is an enum
  });


  const selectedItem = ref(null);
  const createDialog = ref(false);
  const editDialog = ref(false);
  const confirmDialog = ref(false);
  const locations = ref([]);

  const locationItems = computed(() =>
    locations.value.filter(location => location.name)
  );

  const loadItems = async ({ page, itemsPerPage }) => {
    loading.value = true;
    try {
      const res = await getAllData('users');
      let allItems = res.users || [];

      const res1 = await getAllData('locations');
      locations.value = res1.locations || [];

      if (search.value.trim()) {
        const term = search.value.toLowerCase();
        allItems = allItems.filter(
          item =>
            item.email?.toLowerCase().includes(term) ||
            item.role?.toLowerCase().includes(term)
        );
      }

      const start = (page - 1) * itemsPerPage;
      serverItems.value = allItems.slice(start, start + itemsPerPage);
      totalItems.value = allItems.length;

      showSnack('Users loaded', 'success');
    } catch (e) {
      console.error(e);
      showSnack('Failed to load users', 'error');
    } finally {
      loading.value = false;
    }
  };

  const resetForm = () => {
    form.value = {
      id: null,
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      role: "user",
      gender: "other",
      district: "Mzimba",
      locationId: "",
      password: ""
    };
  };

  const createUser = async () => {
    try {
      await postData(form.value, 'users/register');
      createDialog.value = false;
      showSnack('User created', 'success');
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack(e.response.data, 'error');
    }
  };

  const updateUser = async () => {
    try {
      await putData(form.value, `users/${form.value.id}`);
      editDialog.value = false;
      showSnack('User updated', 'success');
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack('Failed to update user', 'error');
    }
  };

  const confirmDelete = (item) => {
    selectedItem.value = item;
    confirmDialog.value = true;
  };

  const deleteConfirmed = async () => {
    try {
      await deleteData(`users/${selectedItem.value.id}`);
      confirmDialog.value = false;
      showSnack('User deleted', 'success');
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack('Failed to delete user', 'error');
    }
  };

  const editUser = (item) => {
    form.value = { ...item };
    editDialog.value = true;
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

<style scoped>
  .v-data-table .v-btn {
    margin: 0 2px;
  }
</style>