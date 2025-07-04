<template>
    <GoogleMap :api-key="apiKey" :center="center" :zoom="14" style="height: 430px; width: 100%" ref="mapRef"
        @idle="onMapReady">
        <Marker v-if="userPosition" :options="{ position: userPosition, label: 'You' }" />
        <Marker :options="{ position: destination, label: '📍' }" />
    </GoogleMap>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { GoogleMap, Marker } from 'vue3-google-map'

    const props = defineProps({
        destinationLat: { type: Number, required: true },
        destinationLng: { type: Number, required: true },
    })

    const apiKey = 'AIzaSyDxV_Rf3kJWEGi69trm9SYgRrQ-b8zTFSs' // Use env in production
    const userPosition = ref(null)
    const destination = ref({ lat: props.destinationLat, lng: props.destinationLng })
    const center = ref(destination.value)
    const mapRef = ref(null)
    const mapReady = ref(false)

    let directionsRenderer = null
    let directionsService = null

    const fetchRoute = () => {
        if (!userPosition.value || !window.google || !mapReady.value) return

        if (!directionsService) directionsService = new google.maps.DirectionsService()
        if (!directionsRenderer) {
            directionsRenderer = new google.maps.DirectionsRenderer()
            directionsRenderer.setMap(mapRef.value.map) // raw map instance
        }

        directionsService.route(
            {
                origin: userPosition.value,
                destination: destination.value,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(result)
                } else {
                    console.error('Directions request failed due to: ' + status)
                }
            }
        )
    }

    const onMapReady = () => {
        mapReady.value = true
        fetchRoute()
    }

    onMounted(() => {


        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userPosition.value = {
                    lat: -11.4655,
                    lng: 34.0207,
                }
                center.value = userPosition.value
                fetchRoute()
            },
            (err) => {
                console.error('Geolocation error:', err.message)
            },
            {
                enableHighAccuracy: true, // <-- critical for precision
                timeout: 10000,
                maximumAge: 0,
            }
        )
    })
</script>