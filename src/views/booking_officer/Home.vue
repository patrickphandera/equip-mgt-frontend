<template>
  <div>
    <div class="d-flex flex-column">
      <h2 class="text-overline font-weight-medium">Locations</h2>
      <div class="text-caption">
        Graphical Sammaries
      </div>
    </div>
    <div class="mt-4 h-full">
      <div class="mt-4 h-full">
        <!-- <v-row>
          <v-col cols="3" height="10">
            <v-card height="60" hover to='/customer/equipments'
              class=" mx-auto bg-grey-lighten-5  d-flex flex-column justify-center align-center">

              <div class="text-caption text-capitalize">View, Book equipments</div>
              <v-icon size="md">mdi-arrow-top-right</v-icon>
            </v-card>
          </v-col>
          <v-col cols="3" height="60">
            <v-card height="60" hover to='/customer/bookings'
              class=" mx-auto bg-grey-lighten-5  d-flex flex-column justify-center align-center">

              <div class="text-caption text-capitalize">View previous bookings</div>
              <v-icon size="md">mdi-arrow-top-right</v-icon>
            </v-card>
          </v-col>
          <v-col cols="3" height="10">
            <v-card height="60" hover to='/customer/payments'
              class=" bg-grey-lighten-5  d-flex flex-column justify-center align-center">

              <div class="text-caption text-capitalize">View previous payments</div>
              <v-icon size="md">mdi-arrow-top-right</v-icon>
            </v-card>
          </v-col>
          <v-col cols="3" height="10">
            <v-card height="60" hover to='/customer/account'
              class=" bg-grey-lighten-5  d-flex flex-column justify-center align-center">

              <div class="text-caption text-capitalize">Manage account</div>
              <v-icon size="md">mdi-arrow-top-right</v-icon>
            </v-card>
          </v-col>
        </v-row> -->

      </div>
      <v-row>
        <v-col cols="6" height="10">
          <v-card hover to='/customer/equipments' height="200" class="bg-grey-lighten-5">
            <div class="text-caption mx-4 ">
              Yearly Bookings
            </div>
            <Chart></Chart>
          </v-card>
        </v-col>
        <v-col cols="6" height="10">
          <v-card hover to='/customer/equipments' height="200" class="bg-grey-lighten-5">
            <div class="text-caption  mx-6">
              Locations Bookings
            </div>
            <Chart1></Chart1>
          </v-card>
        </v-col>
        <v-col cols="6" height="10">
          <v-card hover to='/customer/equipments' height="200" class="bg-grey-lighten-5">
            <div class="text-caption  mx-6">
              Total Yearly Bookings
            </div>
            <div class="d-flex text-h5 mx-6 font-weight-black "> 300

            </div>

            <div class="mx-4">
              <Chart2></Chart2>
            </div>

          </v-card>
        </v-col>
        <v-col cols="6" height="10">
          <v-card hover to='/customer/equipments' height="200" class="bg-grey-lighten-5">
            <div class="text-caption  mx-6">
              Equipment conditions
            </div>
            <div class="d-flex text-overline mx-6">

            </div>

            <div class="mx-4">
              <Chart3></Chart3>
            </div>

          </v-card>
        </v-col>
      </v-row>

    </div>

  </div>
</template>

<script setup>
  import Chart from '../../components/ChiefTechnicianYearlyBarChart.vue';
  import Chart1 from '../../components/ChiefTechnicianLocationsBarChart.vue';
  import Chart2 from '../../components/YearlyTotalBookings.vue';
  import Chart3 from '../../components/ChiefTechnicianEquipmentsBarChart.vue';


  import { ref } from "vue";
  import { GoogleMap, Marker } from "vue3-google-map";
  import { VContainer, VDialog, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VBtn } from 'vuetify/components';

  const apiKey = "AIzaSyDxV_Rf3kJWEGi69trm9SYgRrQ-b8zTFSs";
  const center = { lat: -11.46556, lng: 34.02071 };

  const dialog = ref(false);
  const selectedPosition = ref(null);
  const selectedAddress = ref(null);
  const localAreaName = ref("");
  const snackbar = ref(false)
  const text = ref("Hello, I'm a snackbar")
  const localAreas = [
    { name: "Chibavi", lat: -11.4415, lng: 34.0082, radius: 0.01 },
    { name: "Mchengautuba", lat: -11.4553, lng: 34.0055, radius: 0.012 },
    { name: "Luwinga", lat: -11.4538, lng: 34.0233, radius: 0.01 },
    { name: "Zolozolo", lat: -11.4382, lng: 34.0141, radius: 0.009 },
    { name: "Katoto", lat: -11.4461, lng: 34.0254, radius: 0.009 },
    { name: "Masasa", lat: -11.4665, lng: 34.0103, radius: 0.009 },
    { name: "Mzuzu City Centre", lat: -11.4655, lng: 34.0207, radius: 0.007 },
  ];

  function getNearestLocalArea(lat, lng) {
    for (const area of localAreas) {
      const distance = Math.sqrt(
        Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2)
      );
      if (distance <= area.radius) {
        snackbar.value = true
        text.value = area.name
        return area.name;
      }
    }
    return "Unknown area";
  }

  async function handleMapClick(event) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    selectedPosition.value = { lat, lng };
    selectedAddress.value = await getPlaceFromLatLng(lat, lng);
    localAreaName.value = getNearestLocalArea(lat, lng);
    dialog.value = true;
  }

  async function getPlaceFromLatLng(lat, lng) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "OK" && data.results.length) {
      const meaningfulResult = data.results.find((r) =>
        r.types.includes("street_address") ||
        r.types.includes("route") ||
        r.types.includes("locality") ||
        r.types.includes("sublocality")
      );

      const place = meaningfulResult
        ? meaningfulResult.formatted_address
        : data.results[0].formatted_address;

      return place;
    } else {
      console.error("No address found");
      return null;
    }
  }


</script>