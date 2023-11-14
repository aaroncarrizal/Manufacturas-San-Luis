<template>
    <div class="container-lg">
        <div class="row">
            <h1 class="text-center my-3">Etiquetas impresas</h1>
        </div>
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
                    :options="headers.slice(0, 6)"
                    label="text"
                    :allow-empty="false"
                    required
                    :preselectFirst="true"
                >
                </VueMultiselect>
            </div>
        </div>
        <div class="row">
            <div class="mb-3 d-flex align-items-center">
                <h3 class="me-3">Exportar:</h3>
                <div class="btn-group">
                    <a
                        href="http://localhost:3000/api/export/printedLabels/today"
                        class="btn btn-primary"
                        >Hoy</a
                    >
                    <a
                        href="http://localhost:3000/api/export/printedLabels/week"
                        class="btn btn-primary"
                        >Semana</a
                    >
                    <a
                        href="http://localhost:3000/api/export/printedLabels/month"
                        class="btn btn-primary"
                        >Mes</a
                    >
                    <a
                        href="http://localhost:3000/api/export/printedLabels/all"
                        class="btn btn-primary"
                        >Todos</a
                    >
                </div>
            </div>
        </div>
        <EasyDataTable
            :headers="headers"
            :items="printedLabels"
            :search-value="searchValue"
            :search-field="searchField.value"
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

            <template #item-qr="item">
                <img
                    :src="`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${item.qr}`"
                    :title="item.qr"
                />
            </template>
            <template #item-sku="item">
                {{ item.qr }}
            </template>
            <template #item-createdAt="item">
                {{ formatDate(item.createdAt) }}
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
import { getPrintedLabels, reprintPrintedLabel } from '../../../services/PrintedLabelService'
import VueMultiselect from 'vue-multiselect'

export default defineComponent({
    components: { VueMultiselect },
    data() {
        return {
            searchField: {},
            printedLabels: [],
            searchValue: '',
            message: null,
            headers: [
                { text: 'QR', value: 'qr' },
                { text: 'SKU', value: 'sku' },
                { text: 'Dígitos', value: 'digits' },
                { text: 'Número de parte', value: 'partNumber' },
                { text: 'Referencia', value: 'reference' },
                { text: 'Ficha que se usó', value: 'tokenId' },
                { text: 'Fecha de impresión', value: 'createdAt' },
                { text: 'Reimprimir etiqueta', value: 'print' }
            ]
        }
    },
    async mounted() {
        await this.loadPrintedLabels()
        console.log(this.printedLabels)
    },
    methods: {
        async loadPrintedLabels() {
            try {
                const res = await getPrintedLabels()
                this.printedLabels = res.data
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
        async goToPrintPage(printedLabelId) {
            try {
                const res = await reprintPrintedLabel(printedLabelId)
                console.log(res)
                this.message = res.data.message
                await this.loadPrintedLabels()
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
