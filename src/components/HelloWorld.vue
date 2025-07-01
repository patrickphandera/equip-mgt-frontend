<template>
  <v-container class="fill-height" max-width="900">
    <div>
      <v-img
        class="mb-4"
        height="150"
        src="@/assets/logo.png"
      />

      <div class="mb-8 text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>
        <h1 class="text-h2 font-weight-bold">Vuetify</h1>
      </div>

      <v-row>
        <v-col cols="12">
          <v-card
            class="py-4"
            color="surface-variant"
            image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
            prepend-icon="mdi-rocket-launch-outline"
            rounded="lg"
            variant="tonal"
          >
            <template #image>
              <v-img position="top right" />
            </template>

            <template #title>
              <h2 class="text-h5 font-weight-bold">
                Get started
              </h2>
            </template>

            <template #subtitle>
              <div class="text-subtitle-1">
                Change this page by updating <v-kbd>{{ `<HelloWorld />` }}</v-kbd> in <v-kbd>components/HelloWorld.vue</v-kbd>.
              </div>
            </template>
          </v-card>
        </v-col>

        <v-col v-for="link in links" :key="link.href" cols="6">
          <v-card
            append-icon="mdi-open-in-new"
            class="py-4"
            color="surface-variant"
            :href="link.href"
            :prepend-icon="link.icon"
            rel="noopener noreferrer"
            rounded="lg"
            :subtitle="link.subtitle"
            target="_blank"
            :title="link.title"
            variant="tonal"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script setup>
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
    VBtn,
  } from "vuetify/components";
  
  // Props
  const { onCorrection } = defineProps({
    onCorrection: {
      type: Function,
      required: true,
    },
  });
  
  // Constants and reactive state
  const apiKey = "AIzaSyDxV_Rf3kJWEGi69trm9SYgRrQ-b8zTFSs";
  const center = { lat: -11.46556, lng: 34.02071 };
  
  const dialog = ref(false);
  const selectedPosition = ref(null);
  const selectedAddress = ref(null);
  const localAreaName = ref("");
  const snackbar = ref(false);
  const text = ref("Hello, I'm a snackbar");
  
  const localAreas = [
    { name: "Chibavi", lat: -11.4415, lng: 34.0082, radius: 0.01 },
    { name: "Mchengautuba", lat: -11.4553, lng: 34.0055, radius: 0.012 },
    { name: "Luwinga", lat: -11.4538, lng: 34.0233, radius: 0.01 },
    { name: "Zolozolo", lat: -11.4382, lng: 34.0141, radius: 0.009 },
    { name: "Katoto", lat: -11.4461, lng: 34.0254, radius: 0.009 },
    { name: "Masasa", lat: -11.4665, lng: 34.0103, radius: 0.009 },
    { name: "Mzuzu City Centre", lat: -11.4655, lng: 34.0207, radius: 0.007 },
  ];
  
  // Utility to find nearest local area
  function getNearestLocalArea(lat, lng) {
    for (const area of localAreas) {
      const distance = Math.sqrt(
        Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2)
      );
      if (distance <= area.radius) {
        snackbar.value = true;
        text.value = area.name;
        return area.name;
      }
    }
    return "Unknown area";
  }
  
  // Google Maps click handler
  async function handleMapClick(event) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
  
    selectedPosition.value = { lat, lng };
    selectedAddress.value = await getPlaceFromLatLng(lat, lng);
    localAreaName.value = getNearestLocalArea(lat, lng);
  
    // Persist data
    localStorage.setItem("lat", lat);
    localStorage.setItem("long", lng);
    localStorage.setItem("localAreaName", localAreaName.value);
    localStorage.setItem("selectedAddress", selectedAddress.value);
  
    dialog.value = true;
  
    // Inform parent
    const correctedData = {
      localAreaName: localAreaName.value,
      lat,
      lng,
    };
    onCorrection(correctedData); // ✅ works because of destructuring
  }
  
  // Optional manual correction trigger
  function sendCorrection() {
    const correctedData = { name: "Fixed Name" };
    onCorrection(correctedData);
  }
  
  // Reverse geocoding
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
  
      return meaningfulResult
        ? meaningfulResult.formatted_address
        : data.results[0].formatted_address;
    } else {
      console.error("No address found");
      return null;
    }
  }
  </script>
  