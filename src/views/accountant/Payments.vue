<template>
  <v-app>
    <div class="mt-2">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex flex-column">
          <h2 class="text-h5 font-weight-medium text-overline">Payments</h2>
          <div class="text-caption text-capitalize">
            Payments management
          </div>
        </div>
        {/* <v-btn color="primary" class="text-capitalize text-overline" prepend-icon="mdi-plus" @click="createPayment">
          New Payment
        </v-btn> */}
      </div>

      <v-card class="elevation-1 mt-4">
        <v-card-text>
          <v-text-field density="compact" v-model="search" label="Search payments" prepend-inner-icon="mdi-magnify"
             clearable class="text-caption text-capitalize" />
        </v-card-text>

        <v-data-table-server class="text-caption" v-model:items-per-page="itemsPerPage" :headers="headers"
          :items="serverItems" :items-length="totalItems" :loading="loading" item-value="booking_id"
          @update:options="loadItems">
          <template #item.actions="{ item }">
            <v-btn icon variant="text" @click="viewPayment(item)">
              <v-icon size="20">mdi-eye</v-icon>
            </v-btn>
            <v-btn icon variant="text" @click="editPayment(item)">
              <v-icon size="20">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon variant="text" @click="deletePayment(item)">
              <v-icon color="red" size="20">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table-server>
      </v-card>
    </div>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  const payments = [
    {
      booking_id: 'BKG-001',
      customer_id: 'CUS-101',
      amount: 150.0,
      payment_method: 'Cash',
      paid_for: 'Admin1',
    },
    {
      booking_id: 'BKG-002',
      customer_id: 'CUS-102',
      amount: 250.5,
      payment_method: 'Mobile Money',
      paid_for: 'Admin2',
    },
    {
      booking_id: 'BKG-003',
      customer_id: 'CUS-103',
      amount: 300.0,
      payment_method: 'Bank Transfer',
      paid_for: null,
    },
  ]

  const headers = ref([
    { title: 'Booking ID', key: 'booking_id' },
    { title: 'Customer ID', key: 'customer_id' },
    { title: 'Amount', key: 'amount' },
    { title: 'Payment Method', key: 'payment_method' },

    { title: 'Actions', key: 'actions', sortable: false },
  ])

  const itemsPerPage = ref(5)
  const search = ref('')
  const serverItems = ref([])
  const loading = ref(false)
  const totalItems = ref(0)

  function loadItems({ page, itemsPerPage, sortBy }) {
    loading.value = true
    FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
      serverItems.value = items
      totalItems.value = total
      loading.value = false
    })
  }

  const FakeAPI = {
    async fetch({ page, itemsPerPage, sortBy }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let items = [...payments]
          if (sortBy?.length) {
            const { key, order } = sortBy[0]
            items.sort((a, b) =>
              order === 'desc'
                ? String(b[key] || '').localeCompare(String(a[key] || ''))
                : String(a[key] || '').localeCompare(String(b[key] || ''))
            )
          }
          const start = (page - 1) * itemsPerPage
          const paginated = items.slice(start, start + itemsPerPage)
          resolve({ items: paginated, total: items.length })
        }, 300)
      })
    },
  }

  function createPayment() {
    console.log('Create new payment')
  }

  function viewPayment(item) {
    console.log('View payment:', item)
  }

  function editPayment(item) {
    console.log('Edit payment:', item)
  }

  function deletePayment(item) {
    console.log('Delete payment:', item)
  }
</script>

<style scoped>
  .v-data-table .v-btn {
    margin: 0 2px;
  }
</style>