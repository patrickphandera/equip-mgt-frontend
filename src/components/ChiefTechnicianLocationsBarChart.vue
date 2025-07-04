<template>
    <div>


        <apexchart width="100%" height="100%" type="bar" :options="chartOptions" :series="series" />
    </div>
</template>

<script setup>
    import { ref } from 'vue'

    const series = ref([
        {
            name: 'Inflation',
            data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
        },
    ])

    const chartOptions = ref({
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true, // or false to remove the whole toolbar
                tools: {
                    download: false  // 👈 disables the download image (SVG/PNG) icon
                }
            }
        },
        colors: ['#4CAF50'],
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val}%`,
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ['#304758'],
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            position: 'top',
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            tooltip: {
                enabled: true,
            },
        },
        yaxis: {
            labels: {
                formatter: (val) => `${val}%`,
            },
        },
        title: {

            align: 'center',
            style: {
                color: '#444',
            },
        },
    })
</script>