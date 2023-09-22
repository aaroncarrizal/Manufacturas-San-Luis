<template>
    <div class="container-lg">
        <div class="row mt-3">
            <div class="col-6">
                <img
                    :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${part.qr}`"
                    :alt="part.qr"
                    :title="part.qr"
                />
            </div>
            <div class="col-6 text-wrap">
                <h1>SKU: {{ part.sku }}</h1>
                <h1>Ficha relacionada: {{ part.tokenId }}</h1>
                <h1>Fecha de registro: {{ formatDate(part.updatedAt) }}</h1>
            </div>
        </div>
        <div class="row mt-3">
            <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">Imprimir</button>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { getPart } from '../../../services/PartService'
import router from '../../router'

export default defineComponent({
    data() {
        return {
            part: {}
        }
    },
    mounted() {
        this.loadPart()
    },
    async beforeMount() {
        this.part.id = this.$route.params.id
    },
    methods: {
        async loadPart() {
            try {
                const res = await getPart(this.part.id)
                this.part = res.data
            } catch (error) {
                console.log(error)
            }
            console.log(this.part)
        },
        formatDate(inputDate) {
            const date = new Date(inputDate)
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()

            return `${day}/${month}/${year}`
        }
    }
})
</script>
