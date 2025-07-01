<template>
  <v-app>
    <div class="mt-2">
      <div class="d-flex justify-space-between align-center">
        <h2 class="text-h5 font-weight-medium">
          <v-btn icon="mdi-keyboard-backspace" class="mr-2" size="small"></v-btn
          >Equipments/gdgdg
        </h2>
      </div>
      <v-row class="mt-4">
        <v-col cols="6 " v-for="i in equipments" v-bind:key="i">
          <v-card class="elevation-1 mx-auto">
            <v-img
              class="align-end"
              height="150px"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              :src="i.image"
              cover
            >
            </v-img>
          </v-card>
        </v-col>
      </v-row>
      <v-card class="elevation-1 mt-4">
        <template v-slot:text>
          <v-form>
            <v-row class="" dense>
              <v-col cols="12" sm="4">
                <v-text-field label="Customer name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field label="Equipment set"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field label="District"></v-text-field>
              </v-col>

              <v-col cols="12" sm="4">
                <div class="text-center">
                  <v-dialog class="pb-8">
                    <template v-slot:activator="{ props: activatorProps }">
                      <Home />
                    </template>

                    <template v-slot:default="{ isActive }">
                      <v-card title="Select Event Location">
                        <template v-slot:text>
                          <v-btn @click="mapVisible = !mapVisible"></v-btn>
                          <v-dialog v-model="mapVisible">
                            <Home></Home>
                          </v-dialog>
                        </template>
                        <v-card-actions class="pb-4">
                          <v-spacer></v-spacer>

                          <v-btn
                            text="Close"
                            variant="dense"
                            class="text-capitalize bg-blue-grey-lighten-4"
                            @click="isActive.value = false"
                          ></v-btn>

                          <v-btn
                            color="surface-variant"
                            class="text-capitalize bg-primary"
                            text="Select Location"
                            variant="flat"
                            @click="isActive.value = false"
                          ></v-btn>
                        </v-card-actions>
                      </v-card>
                      <v-spacer></v-spacer>
                    </template>
                  </v-dialog>
                </div>
              </v-col>

              <v-col cols="12" sm="4">
                <v-text-field label="Date"></v-text-field>
              </v-col>

              <v-col cols="12" sm="4">
                <v-text-field label="Equipments"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field label="Phone"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field label="Payment "></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" class="d-flex justify-end">
                <v-btn
                  v-ripple
                  color="surface-variant"
                  class="text-capitalize bg-primary elevation-1"
                  text="Pay"
                  prepend-icon="mdi-cart"
                  variant="flat"
                  size="large"
                  @click="pay()"
                ></v-btn>
              </v-col>
            </v-row>
          </v-form>
        </template>
      </v-card>
    </div>

    <div id="wrapper" style="min-height: 300px"></div>
  </v-app>
</template>
<script>
import { nextTick } from "vue";
import Home from "../../components/Home";
import makePayment from "../../services/payment.services.js";
export default {
  components: { Home },
  data() {
    return {
      mapVisible: false,
      dialogVisible: false,
      equipments: [
        {
          name: "Out door equipments set",
          category: "Outdoor",
          image: "/public/equips/outdoor set.jpg",
          price: "500,000.00 MWK",
          availability: "20 sets available",
          condition: null,
          serial_number: null,
          procurement_date: null,
        },
        {
          name: "In door equipments set",
          category: "Outdoor",
          image: "/public/equips/indoor set.jpg",
          price: "500,000.00 MWK",
          availability: "20 sets available",
          condition: null,
          serial_number: null,
          procurement_date: null,
        },
      ],
    };
  },
  methods: {
    async pay() {
      this.dialogVisible = true;

      // Wait until DOM updates and #wrapper is available
      await nextTick();

      // Optionally wait a few ms more if the SDK loads async
      setTimeout(() => {
        const wrapper = document.getElementById("wrapper");
        if (wrapper) {
          makePayment(); // now it's safe
        } else {
          console.warn("Wrapper not found.");
        }
      }, 100);
    },
  },
};
</script>
<style scoped>
.v-data-table .v-btn {
  margin: 0 2px;
}
#wrapper {
  position: relative;
  z-index: 3000; /* Higher than typical dialogs/drawers */
  min-height: 400px; /* Optional, to give space for iframe */
}

#wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3001; /* Ensure iframe is on top */
  border: none;
}
</style>
