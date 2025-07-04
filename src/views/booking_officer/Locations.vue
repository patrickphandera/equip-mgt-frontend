<template>
  <v-app>
    <div class="mt-2">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex flex-column">
          <h2 class="text-overline font-weight-medium">Locations</h2>
          <div class="text-caption">
            Locations management
          </div>
        </div>
        <div class="px-4 text-center">
          <!-- Create Dialog -->
          <v-dialog v-model="createDialog" max-width="800">
            <template v-slot:activator="{ props }">
              <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" class="text-capitalize" v-bind="props"
                @click="resetForm">
                New Location
              </v-btn>
            </template>
            <v-card title="Adding New Location">
              <v-form class="px-4">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-select label="District" :items="['Mzimba']" v-model="form.districtId" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Location Name" v-model="form.name" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field type="number" label="Transport Fee" v-model="form.transportFee" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Technician Allowance Fee" type="number" v-model="form.technicianAllowance" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Latitude" v-model="form.latitude" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Longitude" v-model="form.longitude" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field label="Radius" type="number" v-model="form.radius" />
                  </v-col>
                </v-row>
              </v-form>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="createDialog = false" class="bg-grey text-capitalize">Close</v-btn>
                <v-btn color="white" @click="createLocation" class="bg-green text-capitalize">Add</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>

      <!-- Data Table -->
      <v-card class="elevation-1 mt-4">
        <v-card-text>
          <v-text-field density="compact" v-model="search" label="Search locations" prepend-inner-icon="mdi-magnify"
             clearable />
        </v-card-text>

        <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
          :items-length="totalItems" :loading="loading" item-value="name" @update:options="loadItems">
          <template #item.actions="{ item }">
            <div class="d-flex">


              <!-- Edit Dialog -->
              <v-dialog v-model="editDialog" max-width="800">
                <template v-slot:activator="{ props }">
                  <v-btn icon size="small" variant="flat" v-bind="props" @click="editLocation(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <v-card title="Update Location">
                  <v-form class="px-4">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-select label="District" :items="['Mzimba']" v-model="form.districtId" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Location Name" v-model="form.name" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Transport Fee" type="number" v-model="form.transportFee" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Technician Allowance" type="number" v-model="form.technicianAllowance" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Latitude" v-model="form.latitude" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Longitude" v-model="form.longitude" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Radius" type="number" v-model="form.radius" />
                      </v-col>
                    </v-row>
                  </v-form>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn @click="editDialog = false" class="text-capitalize bg-grey">Cancel</v-btn>
                    <v-btn color="white" @click="updateLocation" class="text-capitalize bg-green">Update</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- Delete Button -->
              <v-btn icon size="small" variant="flat" @click="confirmDelete(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-card>

      <!-- Confirm Delete Dialog -->
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
    </div>
  </v-app>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { getAllData, postData, putData, deleteData } from '../../services/rest.services'

  const headers = [
    { title: 'Name', key: 'name' },
    { title: 'District', key: 'districtId' },
    { title: 'Transport Fee', key: 'transportFee' },
    { title: 'Technician Allowance', key: 'technicianAllowance' },
    { title: 'Latitude', key: 'latitude' },
    { title: 'Longitude', key: 'longitude' },
    { title: 'Radius', key: 'radius' },
    { title: 'Actions', key: 'actions', sortable: false },
  ]

  const itemsPerPage = ref(5)
  const search = ref('')
  const serverItems = ref([])
  const totalItems = ref(0)
  const loading = ref(false)
  const snackbars = ref([])

  const form = ref({})
  const selectedItem = ref(null)

  const createDialog = ref(false)
  const editDialog = ref(false)
  const confirmDialog = ref(false)

  const loadItems = async ({ page, itemsPerPage }) => {
    loading.value = true
    try {
      const res = await getAllData('locations')
      let allItems = res.locations || []

      // Filter by search term
      if (search.value.trim()) {
        const term = search.value.toLowerCase()
        allItems = allItems.filter(
          (item) =>
            item.name?.toLowerCase().includes(term) ||
            item.districtId?.toLowerCase().includes(term) ||
            String(item.transportFee).includes(term) ||
            String(item.technicianAllowance).includes(term) ||
            String(item.latitude).includes(term) ||
            String(item.longitude).includes(term) ||
            String(item.radius).includes(term)
        )
      }

      const start = (page - 1) * itemsPerPage
      const paginated = allItems.slice(start, start + itemsPerPage)
      serverItems.value = paginated
      totalItems.value = allItems.length
      showSnack('Locations loaded', 'success')
    } catch (e) {
      showSnack('Failed to load', 'error')
    } finally {
      loading.value = false
    }
  }

  const resetForm = () => {
    form.value = {
      name: '',
      districtId: '',
      transportFee: '',
      technicianAllowance: '',
      latitude: '',
      longitude: '',
      radius: '',
    }
  }

  const createLocation = async () => {
    try {
      await postData(form.value, 'locations')
      createDialog.value = false
      showSnack('Location created', 'success')
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
    } catch (e) {
      showSnack('Failed to create', 'error')
    }
  }

  const updateLocation = async () => {
    try {
      await putData(form.value, `locations/${form.value.id}`)
      editDialog.value = false
      showSnack('Location updated', 'success')
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
    } catch (e) {
      showSnack('Update failed', 'error')
    }
  }

  const confirmDelete = (item) => {
    selectedItem.value = item
    confirmDialog.value = true
  }

  const deleteConfirmed = async () => {
    try {
      await deleteData(`locations/${selectedItem.value.id}`)
      confirmDialog.value = false
      showSnack('Deleted successfully', 'success')
      await loadItems({ page: 1, itemsPerPage: itemsPerPage.value })
    } catch (e) {
      showSnack('Delete failed', 'error')
    }
  }

  const editLocation = (item) => {
    form.value = { ...item }
    editDialog.value = true
  }

  const viewLocation = (item) => {
    console.log('View location', item)
  }

  const showSnack = (text, color) => {
    snackbars.value.push({ text, color, timeout: 2000 })
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