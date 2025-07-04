<template>
    <div class="w-full h-full max-w-md mx-auto">

        <v-sparkline :fill="fill" :gradient="selectedGradient" :line-width="lineWidth" :model-value="value"
            :padding="padding" :smooth="smooth" auto-draw></v-sparkline>
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    const gradients = [


        ['purple', 'violet'],
        ['#00c6ff', '#000', '#4CAF50'],

    ]
    const fill = ref(false)
    const selectedGradient = ref(gradients[1])
    const padding = ref(4)
    const smooth = ref(true)
    const value = ref([0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0])
    const lineWidth = ref(2)

</script>