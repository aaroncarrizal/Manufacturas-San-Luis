<template>
    <div class="container-lg">
        <p class="h1 text-center my-3">Fichas registradas</p>
        <div class="mb-3">
            <input
                type="text"
                class="form-control"
                id="search"
                v-model="searchQuery"
                placeholder="Buscar por número"
            />
        </div>
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Estado</th>
                    <th>Fecha de registro</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="filteredTokens.length > 0">
                    <tr v-for="(token, index) in filteredTokens" :key="index">
                        <td>{{ token.id }}</td>
                        <td>{{ token.isOccupied ? 'Ocupada' : 'Libre' }}</td>
                        <td>{{ formatDate(token.updatedAt) }}</td>
                    </tr>
                </template>
                <template v-else>
                    <td colspan="3">
                        <div class="mb-3 mt-3">
                            <h4 class="text-center">Sin registros</h4>
                        </div>
                    </td>
                </template>
            </tbody>
        </table>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { getTokens } from '../../../services/TokenService'

export default defineComponent({
    data() {
        return {
            tokens: [],
            searchQuery: ''
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

            return `${day}/${month}/${year}`
        }
    },
    computed: {
        filteredTokens() {
            const query = this.searchQuery.toLowerCase()
            return this.tokens.filter((token) => {
                return (
                    token.id.toString().includes(query)
                )
            })
        }
    }
})
</script>
