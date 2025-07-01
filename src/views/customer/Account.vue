<template>
  <v-app>
    <div class="mt-2" v-show="showSelect">
      <div class="d-flex">
        <div class="d-flex flex-column">
          <div class="text-h5 font-weight-medium text-overline">Account</div>
          <div class="text-caption">
            My Account
          </div>

        </div>
        <div>

        </div>

      </div>


      <v-row class="mt-2">

        <v-col cols="12">
          <v-card class="mx-auto px-4" hover height="400px">
            <div class="d-flex justify-space-between border-b mb-2">
              <div class="mb-2  py-2 text-overline">
                User Details
              </div>
              <v-btn size="small" variant="flat" icon="mdi-pencil"></v-btn>
            </div>

            <div class="d-flex mb-2">
              <div class="text-capitalize font-weight-medium text-overline text-uppercase">
                name:
              </div>
              <div class="mx-2 text-overline">
                Gift kawonga
              </div>
            </div>
            <div class="d-flex mb-2">
              <div class="text-capitalize font-weight-medium text-overline text-uppercase">
                Role:
              </div>
              <div class="mx-2 text-overline">
                Client
              </div>
            </div>
            <div class="d-flex mb-2">
              <div class="text-uppercase font-weight-medium text-overline ">
                District:
              </div>
              <div class="mx-2 text-overline">
                Mzimba
              </div>
            </div>
            <div class="d-flex mb-2">
              <div class="font-weight-medium text-uppercase text-overline">
                Location:
              </div>
              <div class="mx-2 text-uppercase text-overline">
                Luwinga
              </div>
            </div>
          </v-card>

        </v-col>
        <v-col cols="2">


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