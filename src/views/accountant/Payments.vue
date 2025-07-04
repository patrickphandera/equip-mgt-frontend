<template>
  <v-app>
    <!-- Header -->
    <div class="d-flex justify-space-between align-start mt-2">
      <div class="d-flex flex-column">
        <h2 class="text-h5 font-weight-medium text-overline">Payments</h2>
        <div class="text-caption">Payment Management</div>
      </div>

      <!-- Add Payment -->
      <div class="px-4 text-center">
        <v-dialog v-model="createDialog" max-width="800">
          <template v-slot:activator="{ props }">
            <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" class="text-capitalize text-caption"
              v-bind="props" @click="resetForm">
              New Payment
            </v-btn>
          </template>
          <v-card title="Add New Payment">
            <v-form class="px-4">
              <v-row>
                <v-col cols="12" sm="6"><v-text-field label="Transaction Ref" v-model="form.tx_ref" required /></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Booking ID" v-model="form.bookingId" required /></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Customer ID" v-model="form.customerId" required /></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Method" v-model="form.method" required /></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Amount" v-model="form.amount" type="number"
                    required /></v-col>
                <v-col cols="12" sm="6">
                  <v-select label="Status" v-model="form.status" :items="['pending', 'paid']" required />
                </v-col>
              </v-row>
            </v-form>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="createDialog = false" class="bg-grey text-capitalize">Close</v-btn>
              <v-btn color="white" @click="createPayment" class="bg-green text-capitalize">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>

    <!-- Payment Table -->
    <v-card class="elevation-1 mt-4">
      <v-card-text>
        <v-text-field density="compact" v-model="search" label="Search payments" prepend-inner-icon="mdi-magnify"
          clearable />
      </v-card-text>

      <v-data-table-server class="text-caption" v-model:items-per-page="itemsPerPage" :headers="headers"
        :items="serverItems" :items-length="totalItems" :loading="loading" item-value="_id" @update:options="loadItems">
        <template #item.actions="{ item }">
          <div class="d-flex">
            <!-- Edit -->
            <v-dialog v-model="editDialog" max-width="800">
              <template v-slot:activator="{ props }">
                <v-btn icon size="small" variant="flat" v-bind="props" @click="editPayment(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <v-card title="Update Payment">
                <v-form class="px-4">
                  <v-row>
                    <v-col cols="12" sm="6"><v-text-field label="Transaction Ref" v-model="form.tx_ref"
                        required /></v-col>
                    <v-col cols="12" sm="6"><v-text-field label="Booking ID" v-model="form.bookingId"
                        required /></v-col>
                    <v-col cols="12" sm="6"><v-text-field label="Customer ID" v-model="form.customerId"
                        required /></v-col>
                    <v-col cols="12" sm="6"><v-text-field label="Method" v-model="form.method" required /></v-col>
                    <v-col cols="12" sm="6"><v-text-field label="Amount" v-model="form.amount" type="number"
                        required /></v-col>
                    <v-col cols="12" sm="6">
                      <v-select label="Status" v-model="form.status" :items="['pending', 'paid']" required />
                    </v-col>
                  </v-row>
                </v-form>
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="editDialog = false" class="text-capitalize bg-grey">Cancel</v-btn>
                  <v-btn color="white" @click="updatePayment" class="text-capitalize bg-green">Update</v-btn>
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
        <v-card-text>Are you sure you want to delete <strong>{{ selectedItem?.tx_ref }}</strong>?</v-card-text>
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
  import { ref, onMounted, watch } from 'vue';
  import { getAllData, postData, putData, deleteData } from '../../services/rest.services';

  const headers = [
    { title: 'Transaction Ref', key: 'tx_ref' },
    { title: 'Booking ID', key: 'booking_id' },
    { title: 'Customer ID', key: 'user_id' },
    { title: 'Method', key: 'method' },
    { title: 'Amount', key: 'amount' },
    { title: 'Status', key: 'status' },
    { title: 'Created At', key: 'created' }
  ];

  const itemsPerPage = ref(5);
  const search = ref('');
  const serverItems = ref([]);
  const totalItems = ref(0);
  const loading = ref(false);
  const snackbars = ref([]);

  const form = ref({
    _id: null,
    tx_ref: '',
    bookingId: '',
    customerId: '',
    method: '',
    amount: 0,
    status: 'pending'
  });

  const createDialog = ref(false);
  const editDialog = ref(false);
  const confirmDialog = ref(false);
  const selectedItem = ref(null);

  const loadItems = async ({ page, itemsPerPage }) => {
    loading.value = true;
    try {
      const res = await getAllData('payments');
      let allItems = res.payments || [];

      if (search.value.trim()) {
        const term = search.value.toLowerCase();
        allItems = allItems.filter(item =>
          item.tx_ref?.toLowerCase().includes(term) ||
          item.customerId?.toLowerCase().includes(term) ||
          item.status?.toLowerCase().includes(term)
        );
      }

      const start = (page - 1) * itemsPerPage;
      serverItems.value = allItems.slice(start, start + itemsPerPage);
      totalItems.value = allItems.length;

      showSnack('Payments loaded', 'success');
    } catch (e) {
      console.error(e);
      showSnack('Failed to load payments', 'error');
    } finally {
      loading.value = false;
    }
  };

  const resetForm = () => {
    form.value = {
      _id: null,
      tx_ref: '',
      bookingId: '',
      customerId: '',
      method: '',
      amount: 0,
      status: 'pending'
    };
  };

  const createPayment = async () => {
    try {
      await postData(form.value, 'payments');
      createDialog.value = false;
      showSnack('Payment created', 'success');
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack('Failed to create payment', 'error');
    }
  };

  const updatePayment = async () => {
    try {
      await putData(form.value, `payments/${form.value._id}`);
      editDialog.value = false;
      showSnack('Payment updated', 'success');
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack('Failed to update payment', 'error');
    }
  };

  const confirmDelete = (item) => {
    selectedItem.value = item;
    confirmDialog.value = true;
  };

  const deleteConfirmed = async () => {
    try {
      await deleteData(`payments/${selectedItem.value._id}`);
      confirmDialog.value = false;
      showSnack('Payment deleted', 'success');
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    } catch (e) {
      showSnack('Failed to delete payment', 'error');
    }
  };

  const editPayment = (item) => {
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