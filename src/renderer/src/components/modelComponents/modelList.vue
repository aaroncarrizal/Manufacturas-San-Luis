<template>
    <div class="container-lg">
        <h1 class="text-center my-3">Modelos registrados</h1>
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
                    :options="headers.slice(0, 3)"
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
            :items="models"
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
                <div
                    class="spinner-border m-5 text-primary"
                    style="width: 3rem; height: 3rem"
                    role="status"
                ></div>
            </template>

            <template #item-delete="item">
                <div class="operation-wrapper">
                    <button
                        @click="removeModel(item.id)"
                        class="btn btn-danger"
                        role="button"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </template>
            <template #item-edit="item">
                <div class="operation-wrapper">
                    <router-link :to="'/models/edit/' + item.id" class="btn btn-primary">
                        <i class="bi bi-pencil"></i>
                    </router-link>
                </div>
            </template>
        </EasyDataTable>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { getModels, deleteModel } from '../../../services/ModelService'
import VueMultiselect from 'vue-multiselect'

export default defineComponent({
    components: { VueMultiselect },
    data() {
        return {
            hasRequested: false,
            searchField: {},
            searchValue: '',
            models: [],
            message: null,
            headers: [
                { text: 'Dígitos', value: 'digits' },
                { text: 'Número de parte', value: 'partNumber' },
                { text: 'Referencia', value: 'reference' },
                { text: 'Editar', value: 'edit' },
                { text: 'Borrar', value: 'delete' }
            ]
        }
    },
    mounted() {
        this.loadModels()
    },
    methods: {
        async loadModels() {
            try {
                const res = await getModels()
                this.models = res.data
                this.hasRequested = true
            } catch (error) {
                console.log(error)
            }
        },
        async removeModel(modelId) {
            try {
                const res = await deleteModel(modelId)
                console.log(res)
                this.message = res.data.message
                await this.loadModels()
            } catch (error) {
                this.message =
                    'No se puede borrar este modelo porque existen partes con este modelo registradas'
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
