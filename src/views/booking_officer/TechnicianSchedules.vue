<template>
    <div class="text-left pa-4 d-flex justify-start">
        <v-btn @click="dialog = !dialog" class="elevation-0 border rounded-lg">
            <v-icon>mdi-unfold-more-horizontal</v-icon>
        </v-btn>

        <v-dialog v-model="dialog" width="auto">
            <v-card max-width="1200" class="pa-4">
                <ManageSchedules :technician="technician" />

                <v-card-actions>
                    <v-btn class="ms-auto text-capitalize bg-grey" text @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import ManageSchedules from './ManageTechnicianSchedules.vue'

    defineProps({
        technician: Object
    })

    const dialog = ref(false)
</script>