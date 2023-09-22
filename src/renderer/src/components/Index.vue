<template>
    <div class="container-lg">
        <div class="row">
            <h1 class="text-center">Inicio</h1>
        </div>
        <div class="row">
            <div class="col-sm-12 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <Doughnut :data="chartData" />
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h1>Número total de fichas: {{ this.tokens.length }}</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { getFreeTokens, getTokens } from '../../services/TokenService'
import { getParts } from '../../services/PartService'
import { defineComponent } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

export default defineComponent({
    components: { Doughnut },
    data() {
        return{
            parts: [],
            tokens: [],
            freeTokens: [],
        }
    },
    computed:{
            chartData(){
                return {
                    labels: ['Fichas disponibles', 'Fichas ocupadas'],
                    datasets: [
                        {
                            backgroundColor: ['#41B883', '#E46651'],
                            data: [this.freeTokens.length, this.tokens.length - this.freeTokens.length]
                        }
                    ]
                }
            },
    },
    async beforeMount(){
        await this.loadTokens()
        await this.loadFreeTokens()
        await this.loadParts()
    },
    methods:{
        async loadTokens() {
            try {
                const res = await getTokens()
                this.tokens = res.data
            } catch (error) {
                console.log(error)
            }
        },
        async loadParts() {
            try {
                const res = await getParts()
                this.parts = res.data
            } catch (error) {
                console.log(error)
            }
        },
        async loadFreeTokens() {
            try {
                const res = await getFreeTokens()
                this.freeTokens = res.data
            } catch (error) {
                console.log(error)
            }
        },
    }
})
</script>
