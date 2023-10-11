<template>
    <div class="container-lg">
        <p class="h1 text-center my-3">Modelos registrados</p>
        <div class="mb-3">
            <input
                type="text"
                class="form-control"
                id="search"
                v-model="searchQuery"
                placeholder="Buscar por dígitos o número de parte"
            />
        </div>
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>Dígitos</th>
                    <th>Número de parte</th>
                    <th>Referencia</th>
                    <th>Borrar</th>
                    <th>Editar</th>
                </tr>
            </thead>
            <tbody>
                <template v-if="filteredModels.length > 0">
                    <tr v-for="(model, index) in filteredModels" :key="index">
                        <td  class="text-center align-middle">{{ model.digits }}</td>
                        <td  class="text-center align-middle">{{ model.partNumber }}</td>
                        <td  class="text-center align-middle">{{ model.reference }}</td>
                        <td  class="text-center align-middle">
                            <button
                                @click="removeModel(model.id)"
                                class="btn btn-danger"
                                role="button"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                        <td  class="text-center align-middle">
                            <router-link :to="'/models/edit/' + model.id" class="btn btn-primary">
                                <i class="bi bi-pencil"></i>
                            </router-link>
                        </td>
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
                            <h2 class="text-wrap">
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
import { getModels, deleteModel } from '../../../services/ModelService'

export default defineComponent({
    data() {
        return {
            models: [],
            searchQuery: '',
            message: null
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
                this.message = 'No se puede borrar este modelo porque existen partes con este modelo registradas'
                console.log(error)
            }
        },
        goToList(){
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
