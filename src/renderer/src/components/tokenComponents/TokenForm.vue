<template>
    <div class="container-lg">
        <p class="h1 text-center my-3">Registrar fichas</p>
        <form @submit.prevent="saveTokens()">
            <div class="mb-3">
                <label for="quantity" class="form-label">Cantidad</label>
                <input
                    type="number"
                    class="form-control"
                    id="quantity"
                    aria-describedby="quantityHelp"
                    v-model="count"
                    required
                />
            </div>
            <div class="d-grid gap-2">
                <button
                    type="submit"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                >
                    Registrar
                </button>
            </div>
        </form>
        <!-- Modal -->
        <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <!-- <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div> -->
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
import { createMultipleTokens } from '../../../services/TokenService'
import router from '../../router'

export default defineComponent({
    data() {
        return {
            count: 1,
            message: null
        }
    },
    methods: {
        async saveTokens() {
            try {
                if (this.count <= 0) {
                    throw new Error('Count must be greater than 0')
                }
                const res = await createMultipleTokens({ isOccupied: false }, this.count)
                console.log(res)

                this.message = 'Fichas guardadas con éxito'
            } catch (error) {
                console.log(error)
                this.message = error
            }
        },
        goToList() {
            router.push('/tokens')
        },
        registerNew() {
            window.location.reload()
        }
    }
})
</script>
