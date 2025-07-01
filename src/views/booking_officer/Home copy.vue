<script setup>
import { ref } from "vue";
import { GoogleMap, Marker } from "vue3-google-map";

const center = { lat: -11.46556, lng: 34.02071 };
const selectedPosition = ref(null);
const apiKey = "AIzaSyDxV_Rf3kJWEGi69trm9SYgRrQ-b8zTFSs";
// Function to handle map click
async function handleMapClick(event) {
  const lat = event.latLng.lat();
  const lng = event.latLng.lng();

  selectedPosition.value = { lat, lng };

  const location = await getPlaceFromLatLng(lat, lng);
  console.log("Customer selected:", selectedPosition.value);
  console.log("The location is:", location);
}

async function getPlaceFromLatLng(lat, lng) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );
  const data = await response.json();

  if (data.status === "OK" && data.results.length) {
    // Try to find the most meaningful address
    const meaningfulResult = data.results.find(
      (r) =>
        r.types.includes("street_address") ||
        r.types.includes("route") ||
        r.types.includes("locality") ||
        r.types.includes("sublocality")
    );

    const place = meaningfulResult
      ? meaningfulResult.formatted_address
      : data.results[0].formatted_address; // fallback to first

    console.log("Closest place:", place);
    return place;
  } else {
    console.error("No address found");
    return null;
  }
}
</script>

<template>
  <GoogleMap
    :api-key="apiKey"
    style="width: 100%; height: 500px"
    :center="center"
    :zoom="15"
    @click="handleMapClick"
  >
    <Marker v-if="selectedPosition" :options="{ position: selectedPosition }" />
  </GoogleMap>
</template>
