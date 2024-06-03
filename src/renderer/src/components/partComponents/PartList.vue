<template>
    <div class="container-lg">
        <p class="h1 text-center my-3">Partes registradas</p>
        <div class="row mb-3">
            <div class="col-9">
                <input
                    type="text"
                    class="form-control"
                    id="qr"
                    aria-describedby="qrHelp"
                    v-model="searchValue"
                    placeholder="Buscar por:"
                />
            </div>
            <div class="col-3">
                <VueMultiselect
                    v-model="searchField"
                    :options="fields"
                    label="text"
                    :allow-empty="false"
                    required
                    :preselectFirst="true"
                >
                </VueMultiselect>
            </div>
        </div>
        <EasyDataTable
            :headers="headers"
            :items="parts"
            :search-value="searchValue"
            :search-field="searchField.value"
            alternating
            buttons-pagination
        >
            <template #empty-message v-if="hasRequested">
                <div class="mb-3 mt-3">
                    <h4 class="text-center">Sin registros</h4>
                </div>
            </template>
            <template #empty-message v-else>
                <div class="spinner-border m-5 text-primary" style="width: 3rem; height: 3rem;" role="status">
                </div>
            </template>

            <template #item-qr="item">
                <img
                    :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${item.qr}`"
                    :title="item.qr"
                />
            </template>

            <template #item-sku="item">
                {{ item.qr }}
            </template>

            <template #item-updatedAt="item">
                {{ formatDate(item.updatedAt) }}
            </template>

            <template #item-date="item">
                {{ item.date + ' - ' + item.time }}
            </template>

            <template #item-edit="item">
                <div class="operation-wrapper">
                    <router-link :to="'/parts/edit/' + item.id" class="btn btn-warning">
                        <i class="bi bi-pencil"></i>
                    </router-link>
                </div>
            </template>

            <template #item-print="item">
                <div class="operation-wrapper">
                    <button
                        @click="goToPrintPage(item.id)"
                        class="btn btn-primary"
                        role="button"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        <i class="bi bi-printer"></i>
                    </button>
                </div>
            </template>
        </EasyDataTable>

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
import VueMultiselect from 'vue-multiselect'

export default defineComponent({
    components: { VueMultiselect },
    data() {
        return {
            hasRequested: false,
            searchField: {},
            parts: [],
            searchValue: '',
            message: null,
            headers: [
                { text: 'QR', value: 'qr' },
                { text: 'SKU', value: 'sku' },
                { text: 'Dígitos', value: 'digits' },
                { text: 'Número de parte', value: 'partNumber' },
                { text: 'Fecha y hora de la etiqueta', value: 'date' },
                { text: 'Ficha asociada', value: 'tokenId' },
                { text: 'Fecha de registro', value: 'updatedAt' },
                { text: 'Imprimir etiqueta', value: 'print' },
                { text: 'Editar', value: 'edit' }
            ],
            fields: [
                { text: 'QR o SKU', value: 'qr' },
                { text: 'Dígitos', value: 'digits' },
                { text: 'Número de parte', value: 'partNumber' },
                { text: 'Ficha asociada', value: 'tokenId' },
            ],
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
                this.hasRequested = true
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
        goToList() {
            this.message = null
        }
    }
})
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

