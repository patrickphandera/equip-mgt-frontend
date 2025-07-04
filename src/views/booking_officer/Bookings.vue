<template>
  <v-app>
    <div class="mt-4 px-4">

      <!-- Title -->
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <h2 class="text-h5 font-weight-medium">Bookings</h2>
          <div class="text-caption">Manage all bookings</div>
        </div>
        <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" class="text-capitalize text-caption"
          @click="newBooking">
          New Booking
        </v-btn>
      </div>

      <!-- Search -->
      <v-text-field class="mb-4 text-caption" v-model="search" label="Search bookings" prepend-inner-icon="mdi-magnify"
        clearable density="compact" />

      <!-- Booking Table -->
      <v-data-table-server class="text-caption" v-model:items-per-page="itemsPerPage" :headers="headers"
        :items="serverItems" :items-length="totalItems" :loading="loading" :search="search" item-value="user_id"
        @update:options="loadItems">
        <!-- Format Date -->
        <template #item.date="{ item }">
          {{ new Date(item.date).toLocaleDateString() }}
        </template>

        <!-- Format Amount -->
        <template #item.amount="{ item }">
          MWK {{ item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
        </template>

        <!-- Equipment count and view -->
        <template #item.equipments="{ item }">
          {{ item.equipments?.length || 0 }} item(s)
          <v-btn icon variant="flat" @click="viewBooking(item)">
            <v-icon>mdi-unfold-more-vertical</v-icon>
          </v-btn>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-btn icon variant="flat" @click="editBooking(item)">
            <v-icon>mdi-progress-wrench</v-icon>
          </v-btn>
          <v-btn icon variant="flat" @click="deleteBooking(item)">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table-server>
    </div>

    <!-- Snackbar -->
    <v-snackbar-queue v-model="snackbars" :timeout="2500" />
  </v-app>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { getAllData, deleteData } from '@/services/rest.services'

  const search = ref('')
  const itemsPerPage = ref(5)
  const serverItems = ref([])
  const totalItems = ref(0)
  const loading = ref(false)
  const snackbars = ref([])

  const headers = [
    { title: 'Contact Person', key: 'name' },
    { title: 'Phone', key: 'phone' },
    { title: 'District', key: 'district' },
    { title: 'Location', key: 'location' },
    { title: 'Date', key: 'date' },

    { title: 'Equipments', key: 'equipments' },

  ]

  const loadItems = async ({ page, itemsPerPage }) => {
    loading.value = true
    try {
      const res = await getAllData('bookings') // Adjust endpoint if needed
      let items = res.bookings || []

      // Filter by search
      if (search.value.trim()) {
        const term = search.value.toLowerCase()
        items = items.filter((item) =>
          [item.name, item.phone, item.district, item.location]
            .some((field) => field?.toLowerCase().includes(term))
        )
      }

      totalItems.value = items.length
      const start = (page - 1) * itemsPerPage
      serverItems.value = items.slice(start, start + itemsPerPage)

      showSnack('Bookings loaded', 'success')
    } catch (e) {
      console.error(e)
      showSnack('Failed to load bookings', 'error')
    } finally {
      loading.value = false
    }
  }

  const viewBooking = (item) => {
    console.log('Viewing booking:', item)
    showSnack(`Viewing ${item.name}'s booking`, 'info')
  }

  const editBooking = (item) => {
    console.log('Editing booking:', item)
    showSnack(`Editing ${item.name}`, 'info')
  }

  const deleteBooking = async (item) => {
    try {
      await deleteData(`bookings/${item.id}`)
      showSnack('Booking deleted', 'success')
      loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
    } catch (e) {
      showSnack('Failed to delete booking', 'error')
    }
  }

  const newBooking = () => {
    console.log('Open new booking form')
    showSnack('Opening new booking form', 'info')
  }

  const showSnack = (text, color) => {
    snackbars.value.push({ text, color })
  }

  onMounted(() => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
  })

  watch(search, () => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
  })
</script>

<style scoped>
  .v-data-table .v-btn {
    margin: 0 2px;
  }
</style>