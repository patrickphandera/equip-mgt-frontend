<template>
    <v-app>
        <div class="mt-2" v-show="showSelect">
            <div class="d-flex justify-space-between">
                <div>
                    <div class="text-h5 font-weight-medium text-overline">Dashboard</div>

                </div>
                <div>
                    <v-btn prepend-icon="mdi-chart-box-multiple" class="bg-green text-overline">Generate
                        report</v-btn>
                </div>

            </div>

            <div>
                <div class="mt-4 h-full">
                    <v-row>

                        <v-col cols="4" height="5">
                            <v-card height="100" hover class=" mx-auto  d-flex flex-column justify-center align-center">
                                <div class="text-overline">Bookings</div>
                                <div class="text-caption text-capitalize">View previous bookings</div>
                                <v-icon>mdi-arrow-top-right</v-icon>
                            </v-card>
                        </v-col>
                        <v-col cols="4" height="5">
                            <v-card height="100" hover class="   d-flex flex-column justify-center align-center">
                                <div class="text-overline">Payments</div>
                                <div class="text-caption text-capitalize">View previous payments</div>
                                <v-icon>mdi-arrow-top-right</v-icon>
                            </v-card>
                        </v-col>
                        <v-col cols="4" height="5">
                            <v-card height="100" hover class="   d-flex flex-column justify-center align-center">
                                <div class="text-overline">My Account</div>
                                <div class="text-caption text-capitalize">Manage account</div>
                                <v-icon>mdi-arrow-top-right</v-icon>
                            </v-card>
                        </v-col>


                        <v-col cols="6" height="5">
                            <v-card height="100" hover class="   d-flex flex-column justify-center align-center">

                            </v-card>
                        </v-col> <v-col cols="6" height="5">
                            <v-card height="100" hover class="   d-flex flex-column justify-center align-center">

                            </v-card>
                        </v-col> <v-col cols="6" height="5">
                            <v-card height="200" hover class="   d-flex flex-column justify-center align-center">

                            </v-card>
                        </v-col> <v-col cols="6" height="5">
                            <v-card height="200" hover class="   d-flex flex-column justify-center align-center">

                            </v-card>
                        </v-col>







                    </v-row>

                </div>

            </div>

        </div>
    </v-app>
</template>

<script>
    import Inputs from './Equipment.vue'

    export default {
        components: { Inputs },
        data() {
            return {
                showSelect: true,
                equipments: [
                    {
                        id: 'outdoor',
                        selected: false,
                        quantity: 1,
                        name: 'Out door set',
                        category: 'Outdoor',
                        image: '/equips/outdoor set.jpg',
                        price: '500,000.00 MWK',
                        availability: '20 sets available',
                    },
                    {
                        id: 'indoor',
                        selected: false,
                        quantity: 1,
                        name: 'In door set',
                        category: 'Outdoor',
                        image: '/equips/indoor set.jpg',
                        price: '500,000.00 MWK',
                        availability: '20 sets available',
                    },
                    {
                        id: 'projector',
                        selected: false,
                        quantity: 1,
                        name: 'Projector',
                        category: 'Outdoor',
                        image: '/equips/projector .jpg',
                        price: '500,000.00 MWK',
                        availability: '20 sets available',
                    },
                    {
                        id: 'genset',
                        selected: false,
                        quantity: 1,
                        name: 'Genset',
                        category: 'Outdoor',
                        image: '/equips/WhatsApp Image 2025-04-29 at 22.22.55_b0b165a0.jpg',
                        price: '500,000.00 MWK',
                        availability: '20 sets available',
                    },
                ],
            }
        },
        methods: {
            toggleSelection(equipment) {
                equipment.selected = !equipment.selected
                if (!equipment.selected) {
                    equipment.quantity = null
                }
            },
            next() {
                let equipments = []
                this.equipments.forEach(equipment => {
                    if (equipment.selected == true) {
                        equipments.push({ id: equipment.id, quantity: equipment.quantity, })
                    }

                });

                localStorage.setItem('equipments', JSON.stringify(equipments));
            },
            goBackToSelection() {
                this.showSelect = true
            },
        },
    }
</script>

<style scoped>
    .selected {
        border: 2px solid green;
    }
</style>