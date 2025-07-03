<template>
  <v-app>

    <div class="mt-2 scroll-container">
      <div class="d-flex justify-space-between align-center">
        <!-- {{`${API_BASE_URL}/files/${i.pictures[0]}`}} -->
        {{countTransportNeeded}}
        <div class="d-flex">
          <v-btn class="border elevation-0" @click="sendMessage()"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
          <div class="font-weight-medium mx-2 text-overline">Selected Equipments</div>

        </div>
        <v-btn icon="mdi-unfold-more-horizontal" variant="dense">2/3</v-btn>
      </div>

      <v-row fill class="mt-2">
        <v-col :cols="4" v-for="(i, index) in selectedEquipments" :key="index" v-show="i?.selected">
          <v-card class="elevation-0 selected mx-auto">
            <v-img class="align-center pb-10" height="150px" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              :src="`${API_BASE_URL}/files/${i?.image}`" cover>
              <div class="mt-8">

                <div class=" d-flex justify-space-between text-body-2 font-weight-black mt-4">
                  <div class="px-4 text-uppercase ma-4 bg-white pa-1 rounded-lg font-weight-black text-overline ro">

                    {{i?.name}} <v-avatar color="black" size="20px">{{i?.quantity}}</v-avatar>
                  </div>
                </div>
              </div>
              <div class="d-flex pa-2">
                <v-btn stacked class="bg-green-darken-4 ml-4 ">
                  <v-badge color="transparent"> MWK </v-badge>
                  <div class="text-h4 font-weight-black">{{ i?.price }}</div>
                  <div class="text-overline">TOTAL</div>
                </v-btn>
              </div>
            </v-img>
          </v-card>
        </v-col>
        <v-col :cols="12 / selectedEquipments.length" v-for="(i, index) in [selectedEquipments[0]]" :key="index"
          v-show="i?.selected">
          <v-card class="elevation-0 selected mx-auto" height="150px">
            <div class="mx-2 mt-1 font-weight-medium text-overline">
              Cost calculator
            </div>
            <div class="d-flex justify-space-between pr-4">
              <div class="px-2">
                <div class="d-flex">
                  <div class="text-caption font-weight-medium">
                    Equipment Sets Cost:
                  </div>
                  <div class="ml-2 text-caption  rounded-lg">
                    {{calculateTotalPrice(equipments)*(form.numberOfDays?Number(form.numberOfDays):1)}} MWK
                  </div>
                </div>
                <div class="d-flex">
                  <div class="text-caption font-weight-medium">
                    Transport Cost:
                  </div>
                  <div class="ml-2 text-caption    rounded-lg">
                    {{countTransportNeeded * getTransportFee
                    *(form.transportNeeded=='Yes'?1:0)*(form.numberOfDays?Number(form.numberOfDays):1) }} MWK
                  </div>
                </div>
                <div class="d-flex">
                  <div class="text-caption  font-weight-medium">
                    Technician Allowance:
                  </div>
                  <div class="ml-2 text-caption rounded-lg">
                    {{calculateTechnicianAllowanceTotal(selectedEquipments)*(form.numberOfDays?Number(form.numberOfDays):1)}}
                    MWK
                  </div>
                </div>
                <div class="d-flex">
                  <div class="text-overline  font-weight-medium">
                    TOTAL
                    COST:{{totalCost}}
                    MWK
                  </div>
                </div>
              </div>

            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card class="elevation-0 mt-2 px-4 border" dense>
        <div>
          <div class=" text-h6 font-weight-medium mt-2 mb-2">Fill in the details and click <span class="text-green">next
              button</span>
            at
            the botton end to proceed to <span class="text-green">payment</span></div>
        </div>
        <v-form ref="form" v-model="formValid">
          <v-row dense>
            <v-col cols="12" sm="4">
              <v-text-field label="Contact person's name" v-model="form.name" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select label="District" v-model="form.district" :items="['Mzimba']" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select label="Area in a district" v-model="form.location" :items="locationNames" />
            </v-col>

            <v-col cols="12" sm="12">
              <v-textarea auto-grow label="Description of Location" v-model="form.description" rows="1" />
            </v-col>
            <v-col cols="12" sm="8">
              <v-select auto-grow label="Number of days for the event" v-model="form.numberOfDays" rows="1"
                :items="['1','2','3','4','5','6','7']" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select label="You need our transport vehicle?" v-model="form.transportNeeded" :items="['Yes','No']" />
            </v-col>
            <v-col cols="12" sm="4">
              <v-select label="Map" v-if="actualLocation && form.location" @click="mapVisible = !mapVisible" block
                class="p-4  text-lowercase   text-capitalize" prepend-inner-icon="mdi-check-circle">

              </v-select>
              <v-select label="Map" v-if="!(actualLocation &&form.location)" @click="mapVisible = !mapVisible" block
                class="p-4  text-black text-capitalize " prepend-inner-icon="mdi-map-marker">
              </v-select>
              <v-dialog v-model="mapVisible" width="1200" height="600">
                <v-card>
                  <v-card-title>Select Event Location</v-card-title>
                  <div class="px-4"><span span="text-h6">In </span> Mzuzu <span><v-icon>mdi-circle-small</v-icon></span>
                    {{form.location}}</div>
                  <v-card-text>
                    <Home :onCorrection="handleCorrection" :location="form.location" :onAction="getMapData" />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="mapVisible = false" class="text-capitalize">Close</v-btn>
                    <v-btn color="primary" class="text-capitalize" @click="mapVisible = false">Select</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field label="Date" v-model="form.date" type="date" :rules="[rules.required]" />
            </v-col>

            <v-col cols="12" sm="4">
              <v-text-field label="Phone" v-model="form.phone" />
            </v-col>
          </v-row>
        </v-form>

      </v-card>
      <v-col cols="12" sm="12" class="d-flex justify-space-between">
        <div></div>
        <!-- <v-btn text class="text-capitalize bg-green" prepend-icon="mdi-chevron-left" @click="back">Previous</v-btn> -->
        <v-btn style="text-transform: lowercase;" color="primary" class="elevation-1 " :disabled="disableNext"
          append-icon="mdi-chevron-right text-capitalize" @click="submit">
          <span class="text-capitalize">N</span>ext
        </v-btn>
      </v-col>

    </div>

    <div id="wrapper" style="min-height: 300px" />
  </v-app>
</template>
<script>
  import { useRoute } from 'vue-router';

  import { nextTick } from "vue";
  import Home from "../../components/Home";
  import makePayment from "../../services/payment.services.js";
  import { getAllData, postData, putData, deleteData } from "../../services/rest.services";

  export default {

    emits: ['update-message'],
    props: {
      equipments: {
        type: Array,
        required: true
      },
      back: {
        type: Function,
        required: true
      }
    },
    // components: { Home },

    data() {
      const route = useRoute();
      const id = route.params.id;

      return {
        API_BASE_URL: 'http://127.0.0.1:8000',
        disableNext: false,
        actualLocation: '',
        locationNames: [],
        mapData: {},
        locations: [],
        total: 0,
        route, id,
        mapVisible: false,
        formValid: false,
        form: {

        },
        rules: {
          required: (v) => !!v || "Field is required",
          phone: (v) =>
            /^\+?\d{7, 15}$/.test(v) || "Enter a valid phone number",
        },
        // equipments: [
        //   {
        //     id: 'outdoor',
        //     name: "Out door equipments set",
        //     category: "Outdoor",
        //     image: "/equips/outdoor set.jpg",
        //     price: "500,000.00 MWK",
        //     availability: "20 sets available",
        //   },
        //   {

        //     name: "In door equipments set",
        //     category: "Outdoor",
        //     image: "/equips/indoor set.jpg",
        //     price: "500,000.00 MWK",
        //     availability: "20 sets available",
        //   },
        // ],
      };
    },
    computed: {
      countTransportNeeded() {
        return this.selectedEquipments.filter(item => item.transportNeeded).length;
      },
      getTransportFee() {
        const location = this.locations.find(
          loc => loc.name === this.form.location
        );
        return location?.transportFee || 0;
      },

      totalCost() {
        const equipmentTotal = this.calculateTotals(this.selectedEquipments);
        const transportFee = this.countTransportNeeded * this.getTransportFee * (this.form.transportNeeded == 'Yes' ? 1 : 0)
        const technicianAllowance = this.calculateTechnicianAllowanceTotal(this.selectedEquipments);
        return (Number(equipmentTotal) + Number(transportFee) + Number(technicianAllowance)) * (this.form.numberOfDays ? Number(this.form.numberOfDays) : 1);
      },
      selectedEquipments() {
        return this.equipments.filter(e => e?.selected);
      },
      disableNext() {
        return !(this.mapData && this.mapData.lat && this.form.name && this.form.location && this.form.district && this.form.description && this.form.phone);
      }
    }
    ,
    async created() {

      this.locationNames = this.locations.filter(location => location.name).map(location => location.name);
      if (this.mapData && this.form.name && this.form.location && this.form.district && this.form.description) {
        this.disableNext = false
      }

      this.actualLocation = await localStorage.getItem('localAreaName') || ''
      await this.getLocations()
    },
    // async mounted() {
    //   this.equipments = this.equipments.filter(equipment => equipment.selected === true);

    //   if (this.mapData && this.form.name && this.form.location && this.form.district && this.form.description) {
    //     this.disableNext = false
    //   }
    //   this.actualLocation = await localStorage.getItem('localAreaName') || ''
    // },
    watch: {
      'form.location'(newVal) {
        this.actualLocation = localStorage.getItem('localAreaName') || '';
      }
    }
    ,
    methods: {
      calculateTotalPrice(items) {
        let total = 0;
        if (!Array.isArray(items)) {
          console.error("Expected an array but got:", typeof items, items);
          return 0;
        }
        this.selectedEquipments.forEach(item => {
          if (item.selected) {
            const subtotal = item.price;
            total += subtotal;
          }
        });

        return total;
      },
      sendMessage() {
        this.$emit('update-message', true)
      },
      calculateTransportFee(items) {
        const locationObj = this.locations.find(loc => loc.name === this.form.location);
        if (!locationObj) return 0;
        const transportFee = locationObj.transportFee;
        const allNeedTransport = items.every(item => item.transportNeeded === true);
        return allNeedTransport ? transportFee : 0;
      },

      calculateTechnicianAllowanceTotal(items) {
        return items.reduce((sum, item) => sum + item.numberOfTechnicians * item.technicianAllowance, 0);
      },

      calculateTotals(items) {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      async refresh() {
        await window.location.reload();

      },
      async getMapData(data) {
        this.mapData = data
        this.mapData.selectedAddress = data.selectedAddress;
        console.log('Map data received:', data);

      },
      async getLocations() {
        let locations = await getAllData('locations')
        this.locations = locations.locations
        console.log(locations.locations)
        this.locationNames = this.locations.filter(location => location.name).map(location => location.name);

      },
      handleCorrection(correctedData) {
        console.log('Received correction from child:', correctedData);
        // Update parent state or perform logic here
      },
      async submit(correctedData) {
        console.log('Received correction from child:', correctedData);
        const form = this.$refs.form;
        if (form && await form.validate()) {
          this.pay(); // Only proceed if valid
        }
      },
      async pay() {

        this.dialogVisible = true;
        await nextTick();


        const wrapper = document.getElementById("wrapper");
        if (wrapper) {
          this.form.equipmentSetId = this.id
          this.form.amount = this.totalCost
          this.form.lat = this.mapData.lat;
          this.form.lng = this.mapData.long;
          this.form.equipments = this.equipments
          this.form.selectedAddress = this.mapData.selectedAddress;
          this.form.location = this.form.location || this.actualLocation;
          this.form.district = this.form.district || 'Mzimba';
          this.form.description = this.form.description || '';
          this.form.phone = this.form.phone;
          const result = await makePayment(this.form); // Payment initialization
          console.log("Payment result:", result.data.checkout_url);

          window.location.href = result.data.checkout_url;
        } else {
          console.warn("Wrapper not found.");
        }

      },
    },
  };
</script>
<style scoped>
  .scroll-container {
    height: 520px;
    overflow: auto;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
  }

  .selected {
    border: 2px solid green;
  }
</style>