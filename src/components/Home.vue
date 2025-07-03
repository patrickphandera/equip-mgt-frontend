<template>
  <div>
    <GoogleMap :api-key="apiKey" :center="center" :zoom="14" style="height: 430px; width: 1200" @click="handleMapClick">
      <Marker v-if="selectedPosition" :options="{ position: selectedPosition }" />
    </GoogleMap>

    <!-- <v-dialog v-model="dialog" max-width="300">
      <v-card class="pa-2">
        <div class="font-weight-bold  text-h6">Location details</div>

        <div><strong>Address:</strong> {{ selectedAddress }}</div>
        <div><strong>It is found in:</strong> {{ localAreaName }}</div>

        <v-card-actions>
          <v-spacer />
          <v-btn class="bg-grey-lighten-1 text-capitalize" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

  </div>
</template>
<script>
  import { getAllData, postData, putData, deleteData } from "../services/rest.services";

  import { ref } from "vue";
  import { GoogleMap, Marker } from "vue3-google-map";
  import {
    VContainer,
    VDialog,
    VCard,
    VCardTitle,
    VCardText,
    VCardActions,
    VSpacer,
    VBtn
  } from 'vuetify/components';

  export default {
    components: {
      GoogleMap,
      Marker,
      VContainer,
      VDialog,
      VCard,
      VCardTitle,
      VCardText,
      VCardActions,
      VSpacer,
      VBtn
    },
    props: [
      'location',
      'onAction'],


    data() {
      return {
        locations: [],
        apiKey: "AIzaSyDxV_Rf3kJWEGi69trm9SYgRrQ-b8zTFSs",
        center: { lat: -11.46556, lng: 34.02071 },
        dialog: false,
        selectedPosition: null,
        selectedAddress: null,
        localAreaName: "",
        snackbar: false,
        text: "Hello, I'm a snackbar",
        localAreas: []
      };
    },
    methods: {
      async getLocations() {
        let locations = await getAllData('locations')
        this.locations = locations.locations
        this.locations = this.locations.filter(location => location.name == this.location)
        let location = this.locations[0]
        this.localAreas = this.locations
        this.center = { lat: parseFloat(location.latitude), lng: parseFloat(location.longitude) }
      },
      getNearestLocalArea(lat, lng) {
        lat = parseFloat(lat)
        lng = parseFloat(lng)
        for (const area of this.localAreas) {
          const distance = Math.sqrt(
            Math.pow(lat - parseFloat(area.lat), 2) + Math.pow(lng - parseFloat(area.lng), 2)
          );
          if (distance <= parseFloat(area.radius)) {
            this.snackbar = true;
            this.text = area.name;
            return area.name;
          }
        }
        return "Unknown area";
      },
      async handleMapClick(event) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        this.selectedPosition = { lat, lng };
        this.selectedAddress = await this.getPlaceFromLatLng(lat, lng);
        this.localAreaName = this.getNearestLocalArea(lat, lng);

        localStorage.setItem('lat', lat);
        localStorage.setItem('long', lng);
        localStorage.setItem('localAreaName', this.localAreaName);
        localStorage.setItem('selectedAddress', this.selectedAddress);
        this.onAction({
          'lat': lat, 'long': lng, 'localAreaName': this.localAreaName, 'selectedAddress': this.selectedAddress
        })
        this.dialog = true;
      },
      async getPlaceFromLatLng(lat, lng) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`
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
    },
    async created() {
      await this.getLocations()

    }
  };
</script>