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
                placeholder="Buscar por QR, número de parte o ficha asociada"
            />
        </div>
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <!-- <th>ID</th> -->
                    <th>QR</th>
                    <th>SKU</th>
                    <th>3 dígitos</th>
                    <th>Número de parte</th>
                    <th>Referencia</th>
                    <th>Ficha asociada</th>
                    <th>Fecha de registro</th>
                    <th>Imprimir etiqueta</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="filteredParts.length > 0">
                    <tr v-for="(part, index) in filteredParts" :key="index">
                        <td>
                            <img
                            :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${part.qr}`"
                            :title="part.qr"
                            />
                        </td>
                        <td class="text-center align-middle">{{ part.qr }}</td>
                        <td class="text-center align-middle">{{ part.digits }}</td>
                        <td class="text-center align-middle">{{ part.partNumber }}</td>
                        <td class="text-center align-middle">{{ part.reference }}</td>
                        <td class="text-center align-middle">{{ part.tokenId }}</td>
                        <td class="text-center align-middle">{{ formatDate(part.updatedAt) }}</td>
                        <td class="text-center align-middle">
                            <button
                                @click="goToPrintPage(part.id)"
                                class="btn btn-primary"
                                role="button"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                <i class="bi bi-printer"></i>
                        </button>
                        </td>
                    </tr>
                </template>
                <template v-else>
                    <td colspan="8">
                        <div class="mb-3 mt-3">
                            <h4 class="text-center">Sin registros</h4>
                        </div>
                    </td>
                </template>
            </tbody>
        </table>

        <!-- Modal -->
        <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            data-bs-backdrop="static"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body">
                        <template v-if="this.message">
                            <h2>
                                {{ this.message }}
                            </h2>
                        </template>
                        <template v-else>
                            <div class="d-flex justify-content-center">
                                <div class="spinner-border m-4" role="status">
                                    <span class="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        </template>
                    </div>
                    <template v-if="this.message">
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-primary"
                                data-bs-dismiss="modal"
                                @click="goToList()"
                            >
                                Ir a lista
                            </button>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { getParts, printPart } from '../../../services/PartService'
import router from '../../router'

export default defineComponent({
    data() {
        return {
            parts: [],
            searchQuery: '',
            message: null,
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
        async goToPrintPage(partId) {
            try {
                const res = await printPart(partId)
                console.log(res)
                this.message = res.data.message
                await this.loadParts()
            } catch (error) {
                this.message = error.response.data
                console.log(error)
            }
        },
        goToList(){
            this.message = null
        }
    },
    computed: {
        filteredParts() {
            const query = this.searchQuery.toLowerCase()
            return this.parts.filter((part) => {
                return (
                    part.qr.toLowerCase().includes(query) || part.tokenId.toString().includes(query) || part.partNumber.toString().includes(query) || part.digits.toString().includes(query)
                )
            })
        }
    }
})
</script>
