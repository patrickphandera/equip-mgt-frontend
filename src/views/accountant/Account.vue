<template>
  <v-app>
    <div class="mt-2" v-show="showSelect">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex flex-column">
          <div class="text-h5 font-weight-medium">Account</div>
          <div class="">
            My Bookings
          </div>

        </div>

      </div>


      <v-row class="mt-2">
        <v-col cols="4">
          <v-card height="200px" hover class="d-flex justify-center pa-8">
            <v-img class="align-end " hover height="150px" width="150px"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" src="/download.png" cover>
            </v-img>
          </v-card>

        </v-col>
        <v-col cols="8">
          <v-card class="mx-auto pa-4" hover height="200px">
            <div class="d-flex justify-space-between border-b mb-2">
              <div class="mb-2  py-2">
                User Details
              </div>
              <v-btn size="small" variant="flat" icon="mdi-pencil"></v-btn>
            </div>

            <div class="d-flex mb-2">
              <div class="text-capitalize font-weight-medium">
                name:
              </div>
              <div class="mx-2">
                Gift kawonga
              </div>
            </div>
            <div class="d-flex mb-2">
              <div class="text-capitalize font-weight-medium">
                Role:
              </div>
              <div class="mx-2">
                Client
              </div>
            </div>
            <div class="d-flex mb-2">
              <div class="text-capitalize font-weight-medium">
                District:
              </div>
              <div class="mx-2">
                Mzimba
              </div>
            </div>
            <div class="d-flex mb-2">
              <div class="text-capitalize font-weight-medium">
                Location:
              </div>
              <div class="mx-2">
                Luwinga
              </div>
            </div>
          </v-card>

        </v-col>
      </v-row>
    </div>


  </v-app>
</template>

<script>


  export default {

    data() {
      return {
        showSelect: true,
        equipments: [
          {
            id: 'outdoor',
            selected: false,
            quantity: 1,
            name: 'Out door set',
            category: 'Outdoor',
            image: '/equips/outdoor set.jpg',
            price: '500,000.00',
            availability: '20 sets available',
          },
          {
            id: 'indoor',
            selected: false,
            quantity: 1,
            name: 'In door set',
            category: 'Outdoor',
            image: '/equips/indoor set.jpg',
            price: '500,000.00',
            availability: '20 sets available',
          },
          {
            id: 'projector',
            selected: false,
            quantity: 1,
            name: 'Projector',
            category: 'Outdoor',
            image: '/equips/projector .jpg',
            price: '500,000.00',
            availability: '20 sets available',
          },
          {
            id: 'genset',
            selected: false,
            quantity: 1,
            name: 'Genset',
            category: 'Outdoor',
            image: '/equips/WhatsApp Image 2025-04-29 at 22.22.55_b0b165a0.jpg',
            price: '500,000.00',
            availability: '20 sets available',
          },
        ],
      }
    },
    methods: {
      toggleSelection(equipment) {
        equipment.selected = !equipment.selected
        if (!equipment.selected) {
          equipment.quantity = null
        }
      },
      next() {
        let equipments = []
        this.equipments.forEach(equipment => {
          if (equipment.selected == true) {
            equipments.push({ id: equipment.id, quantity: equipment.quantity, })
          }

        });

        localStorage.setItem('equipments', JSON.stringify(equipments));
      },
      goBackToSelection() {
        this.showSelect = true
      },
    },
  }
</script>

<style scoped>
  .selected {
    border: 2px solid green;
  }
</style>