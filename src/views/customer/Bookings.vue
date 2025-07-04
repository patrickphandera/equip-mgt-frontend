<template>
  <v-app>
    <div class="mt-4 px-4">

      <!-- Title -->
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <h2 class="text-h5 font-weight-medium">Bookings</h2>
          <div class="text-caption">My bookings</div>
        </div>
        <!-- <v-btn color="green" variant="elevated" prepend-icon="mdi-plus" class="text-capitalize text-caption"
          @click="newBooking">
          New Booking
        </v-btn> -->
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
        <template #item.location="{ item }">
          {{ item.location }}
          <v-btn icon variant="flat" @click="changeMpVisible(item.lat, item.lng)">
            <v-icon>mdi-unfold-more-vertical</v-icon>
          </v-btn>
          <v-dialog v-model="mapVisible" width="1200" height="600">
            <v-card>
              <v-card-title>Select Event Location</v-card-title>
              <div class="px-4"><span span="text-h6"> </span> Mzuzu at {{ item.location
                }}<span><v-icon>mdi-circle-small</v-icon></span>
              </div>

              <!-- <div class="px-4"><span span="text-h6"> </span> {{ item
                }}
              </div> -->




              <v-card-text>
                <MapPath :destinationLat="item.lat" :destinationLng="item.lng" />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="mapVisible = false" class="text-capitalize">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>

        <!-- Equipment count and view -->
        <template #item.equipments="{ item }">
          {{ item.equipments?.length || 0 }} set(s)
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
<script>
  import MapPath from '../../components/DestinationLocation.vue'
  import { getAllData, deleteData } from '@/services/rest.services'

  export default {
    components: {
      MapPath,
    },

    data() {
      return {
        item: { lat: -11.46556, lng: 34.02071 },
        search: '',
        itemsPerPage: 5,
        serverItems: [],
        totalItems: 0,
        loading: false,
        snackbars: [],
        mapVisible: false,

        headers: [
          { title: 'Contact Person', key: 'name' },
          { title: 'Phone', key: 'phone' },
          { title: 'District', key: 'district' },
          { title: 'Location', key: 'location' },
          { title: 'Date', key: 'date' },
          { title: 'Equipments', key: 'equipments' },
        ],
      }
    },

    methods: {
      changeMpVisible(la, long) {
        this.item.lat = la
        this.item.lng = long
        this.mapVisible = !this.mapVisible
      },

      async loadItems({ page, itemsPerPage }) {
        this.loading = true
        try {
          const res = await getAllData('bookings/only-mine')
          let items = res.bookings || []

          if (this.search.trim()) {
            const term = this.search.toLowerCase()
            items = items.filter((item) =>
              [item.name, item.phone, item.district, item.location]
                .some((field) => field?.toLowerCase().includes(term))
            )
          }

          this.totalItems = items.length
          const start = (page - 1) * itemsPerPage
          this.serverItems = items.slice(start, start + itemsPerPage)

          this.showSnack('Bookings loaded', 'success')
        } catch (e) {
          console.error(e)
          this.showSnack('Failed to load bookings', 'error')
        } finally {
          this.loading = false
        }
      },

      viewBooking(item) {
        console.log('Viewing booking:', item)
        this.showSnack(`Viewing ${item.name}'s booking`, 'info')
      },

      editBooking(item) {
        console.log('Editing booking:', item)
        this.showSnack(`Editing ${item.name}`, 'info')
      },

      async deleteBooking(item) {
        try {
          await deleteData(`bookings/${item.id}`)
          this.showSnack('Booking deleted', 'success')
          this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage })
        } catch (e) {
          this.showSnack('Failed to delete booking', 'error')
        }
      },

      newBooking() {
        console.log('Open new booking form')
        this.showSnack('Opening new booking form', 'info')
      },

      showSnack(text, color) {
        this.snackbars.push({ text, color })
      },
    },

    mounted() {
      this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage })
    },

    watch: {
      search() {
        this.loadItems({ page: 1, itemsPerPage: this.itemsPerPage })
      }
    }
  }
</script>


<style scoped>
  .v-data-table .v-btn {
    margin: 0 2px;
  }
</style>