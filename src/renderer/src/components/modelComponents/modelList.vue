<template>
    <div class="container-lg">
        <h1 class="text-center my-3">Modelos registrados</h1>
        <input
                type="text"
                class="form-control my-3"
                id="search"
                v-model="searchValue"
                placeholder="Buscar por dígitos o número de parte"
            />
        <EasyDataTable
            :headers="headers"
            :items="models"
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

export default defineComponent({
    data() {
        return {
            searchField: '',
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
    },
    computed: {
        filteredModels() {
            const query = this.searchQuery.toLowerCase()
            return this.models.filter((model) => {
                return (
                    model.digits.toString().includes(query) ||
                    model.partNumber.toString().includes(query)
                )
            })
        }
    }
})
</script>
