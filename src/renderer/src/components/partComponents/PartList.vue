<template>
    <div class="container-lg">
        <p class="h1 text-center my-3">Partes registradas</p>
        <div class="mb-3">
            <input
                type="text"
                class="form-control"
                id="qr"
                aria-describedby="qrHelp"
                v-model="searchQuery"
                placeholder="Buscar por QR o Ficha asociada"
            />
        </div>
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <!-- <th>ID</th> -->
                    <th>SKU</th>
                    <th>QR</th>
                    <th>Ficha asociada</th>
                    <th>Fecha de registro</th>
                    <th>Imprimir etiqueta</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="filteredParts.length > 0">
                    <tr v-for="(part, index) in filteredParts" :key="index">
                        <td class="text-center align-middle">{{ part.sku }}</td>
                        <td>
                            <img
                                :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${part.qr}`"
                                :alt="part.qr"
                                :title="part.qr"
                            />
                        </td>
                        <td class="text-center align-middle">{{ part.tokenId }}</td>
                        <td class="text-center align-middle">{{ formatDate(part.updatedAt) }}</td>
                        <td class="text-center align-middle">
                            <a
                                @click="goToPrintPage(part.id)"
                                class="btn btn-primary"
                                role="button"
                            >
                                <i class="bi bi-printer"></i>
                            </a>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <td colspan="5">
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
import { getParts } from '../../../services/PartService'
import router from '../../router'

export default defineComponent({
    data() {
        return {
            parts: [],
            searchQuery: ''
        }
    },
    mounted() {
        this.loadParts()
    },
    methods: {
        async loadParts() {
            try {
                const res = await getParts()
                this.parts = res.data
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
        },
        goToPrintPage(partId) {
            // router.push(`/parts/print/${partId}`);
            window.location.href = `http://localhost:3000/api/parts/print/${partId}`
            setTimeout(() => {
                this.parts = this.parts.filter((part) => part.id !== partId)
            }, 500) // 0.5 seconds
        }
    },
    computed: {
        filteredParts() {
            const query = this.searchQuery.toLowerCase()
            return this.parts.filter((part) => {
                return (
                    part.qr.toLowerCase().includes(query) || part.tokenId.toString().includes(query)
                )
            })
        }
    }
})
</script>
