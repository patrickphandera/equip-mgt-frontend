<template>
  <div>
    <GoogleMap
      :api-key="apiKey"
      :center="center"
      :zoom="14"
      style="height: 300px"
      @click="handleMapClick"
    >
      <Marker v-if="selectedPosition" :options="{ position: selectedPosition }" />
    </GoogleMap>

    <v-dialog v-model="dialog" max-width="500">
      <v-card class="pa-4">
        <div class="font-weight-bold pb-4 text-h6">Location details</div>
        
          <div><strong>Address:</strong> {{ selectedAddress }}</div>
          <div><strong>It is found in:</strong> {{ localAreaName }}</div>
        
        <v-card-actions>
          <v-spacer />
          <v-btn class="bg-grey-lighten-1 text-capitalize" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div id="wrapper"></div>
    <v-btn @click='makePayment()' text='click me'/>
  </div>
</template>

<script setup>

import { ref } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";
import { VContainer, VDialog, VCard, VCardTitle, VCardText, VCardActions, VSpacer, VBtn } from 'vuetify/components';

const apiKey = "AIzaSyDxV_Rf3kJWEGi69trm9SYgRrQ-b8zTFSs";
const center = { lat: -11.46556, lng: 34.02071 };

const dialog = ref(false);
const selectedPosition = ref(null);
const selectedAddress = ref(null);
const localAreaName = ref("");
const snackbar= ref(false)
      const text= ref("Hello, I'm a snackbar")
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
      text.value=area.name
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
