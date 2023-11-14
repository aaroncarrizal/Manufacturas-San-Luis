<template>
    <div class="container-lg">
        <p class="h1 text-center my-3">Fichas registradas</p>
        <div class="mb-3">
            <input
                type="text"
                class="form-control"
                id="search"
                v-model="searchValue"
                placeholder="Buscar por número"
            />
        </div>
        <EasyDataTable
            :headers="headers"
            :items="tokens"
            :search-value="searchValue"
            alternating
            buttons-pagination
        >
            <template #loading>
                <div class="d-flex justify-content-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </template>

            <template #empty-message>
                <div class="mb-3 mt-3">
                    <h4 class="text-center">Sin registros</h4>
                </div>
            </template>

            <template #item-isOccupied="item">
                {{ item.isOccupied ? 'Ocupada' : 'Libre' }}
            </template>

            <template #item-updatedAt="item">
                {{ formatDate(item.updatedAt) }}
            </template>
        </EasyDataTable>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { getTokens } from '../../../services/TokenService'

export default defineComponent({
    data() {
        return {
            searchValue: '',
            tokens: [],
            headers: [
                { text: 'ID', value: 'id' },
                { text: 'Estado', value: 'isOccupied' },
                { text: 'Fecha de registro', value: 'updatedAt' }
            ]
        }
    },
    mounted() {
        this.loadTokens()
    },
    methods: {
        async loadTokens() {
            try {
                const res = await getTokens()
                this.tokens = res.data
            } catch (error) {
                console.log(error)
            }
        },
        formatDate(inputDate) {
            const date = new Date(inputDate)
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')

            return `${day}/${month}/${year} - ${hours}:${minutes}`
        }
    }
})
</script>
