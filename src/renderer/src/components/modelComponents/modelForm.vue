<template>
    <div class="container-lg">
        <p class="h1 text-center my-3">Registrar modelo</p>
        <form @submit.prevent="saveModel()">
            <div class="mb-3">
                <label for="digits" class="form-label">3 dígitos</label>
                <input
                    type="text"
                    class="form-control"
                    id="digits"
                    aria-describedby="digits"
                    v-model="model.digits"
                    @input="trimToThreeDigits"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="modelNumber" class="form-label">Número de parte completo</label>
                <input
                    type="string"
                    class="form-control"
                    id="modelNumber"
                    aria-describedby="modelNumber"
                    v-model="model.partNumber"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="reference" class="form-label">Referencia</label>
                <input
                    type="string"
                    class="form-control"
                    id="reference"
                    aria-describedby="reference"
                    v-model="model.reference"
                    required
                />
            </div>
            <div class="d-grid gap-2 mb-3">
                <template v-if="hasNullProperties(this.model)">
                    <button type="submit" class="btn btn-secondary" disabled>Registrar</button>
                </template>
                <template v-else>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                    >
                        Registrar
                    </button>
                </template>
            </div>
        </form>

        <!-- Modal -->
        <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            data-bs-backdrop="static"
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
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-bs-dismiss="modal"
                                @click="registerNew()"
                            >
                                Registrar nueva(s)
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
import { createModel } from '../../../services/ModelService'
import router from '../../router'

export default defineComponent({
    data() {
        return {
            model: {
                digits: null,
                partNumber: null,
                reference: null
            },
            message: null
        }
    },
    methods: {
        async saveModel() {
            try {
                const res = await createModel(this.model)
                console.log(res)
                this.message = 'Modelo registrada con éxito'
            } catch (error) {
                console.log(error)
                this.message = error
            }
        },
        hasNullProperties(model) {
            for (const key in model) {
                if (model[key] === null || model[key] == '') {
                    return true // Return true if any property is null
                }
            }
            return false // Return false if none of the properties are null
        },
        goToList() {
            router.push('/models')
        },
        registerNew() {
            window.location.reload()
        },
        trimToThreeDigits() {
            if (this.model.digits !== null && this.model.digits.toString().length > 3) {
                this.model.digits = parseInt(this.model.digits.toString().slice(0, 3), 10)
            }
        }
    }
})
</script>
