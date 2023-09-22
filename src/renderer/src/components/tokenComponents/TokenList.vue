<template>
    <div class="container-lg">
        <p class="h1 text-center my-3">Fichas registradas</p>
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Estado</th>
                    <th>Fecha de registro</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(token, index) in tokens" :key="index">
                    <td>{{ token.id }}</td>
                    <td>{{ token.isOccupied ? 'Ocupada' : 'Libre' }}</td>
                    <td>{{ formatDate(token.updatedAt) }}</td>
                    <!-- <td class="text-center"> Commented to avoid deleting of tokens
                        <a @click="" class="btn btn-danger" role="button">
                            <i class="bi bi-trash-fill"></i>
                        </a>
                    </td> -->
                </tr>
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
            tokens: []
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
    }
})
</script>
