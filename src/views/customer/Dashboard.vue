<template>
    <v-app>
        <MapPath :destinationLat="item.lat" :destinationLng="item.lng" />
    </v-app>
</template>

<script>
    import MapPath from '../../components/DestinationLocation.vue'

    export default {
        components: { MapPath },
        data() {
            return {
                item:
                    { lat: -11.46556, lng: 34.02071 }
            }

        }
    }
</script>

<style scoped>
    .selected {
        border: 2px solid green;
    }
</style>