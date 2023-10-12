<template>
    <div class="container-lg">
        <p class="h1 text-center my-3">Editar parte</p>
        <form @submit.prevent="editPart()">
            <div class="mb-3">
                <label for="qr" class="form-label">QR</label>
                <input
                    type="text"
                    class="form-control"
                    id="qr"
                    aria-describedby="qrHelp"
                    v-model="part.qr"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="tokenId" class="form-label">Dígitos</label>
                <VueMultiselect
                    v-model="this.selectedModel"
                    :options="models"
                    :allow-empty="false"
                    track-by="id"
                    label="digits"
                    required
                >
                </VueMultiselect>
            </div>
            <div class="mb-3">
                <label for="partNumber" class="form-label">Número de parte</label>
                <input
                    type="text"
                    class="form-control"
                    id="partNumber"
                    aria-describedby="partNumberHelp"
                    disabled
                    :placeholder="this.selectedModel.partNumber"
                />
            </div>
            <div class="mb-3">
                <label for="reference" class="form-label">Referencia</label>
                <input
                    type="text"
                    class="form-control"
                    id="reference"
                    aria-describedby="referenceHelp"
                    disabled
                    :placeholder="this.selectedModel.reference"
                />
            </div>
            <div class="mb-3">
                <label for="tokenId" class="form-label">Ficha relacionada</label>
                <VueMultiselect
                    v-model="this.part.tokenId"
                    :options="tokens"
                    :allow-empty="false"
                    required
                >
                </VueMultiselect>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="d-grid gap-2 mb-3">
                        <button
                            @click="removePart()"
                            type="button"
                            class="btn btn-danger"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                        >
                            Borrar
                        </button>
                    </div>
                </div>
                <div class="col-6">
                    <div class="d-grid gap-2 mb-3">
                        <template v-if="hasNullProperties(this.part)">
                            <button type="submit" class="btn btn-secondary" disabled>Editar</button>
                        </template>
                        <template v-else>
                            <button
                                type="submit"
                                class="btn btn-warning"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                            >
                                Editar
                            </button>
                        </template>
                    </div>
                </div>
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
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { getFreeTokens } from '../../../services/TokenService'
import { getModels } from '../../../services/ModelService'
import { getPart, updatePart, deletePart } from '../../../services/PartService'
import VueMultiselect from 'vue-multiselect'
import router from '../../router'

export default defineComponent({
    components: { VueMultiselect },
    data() {
        return {
            partId: '',
            part: {},
            tokens: [],
            message: null,
            models: [],
            selectedModel: {}
        }
    },
    async beforeMount() {
        this.partId = this.$route.params.id.toString()
        await this.loadPart()
        await this.loadFreeTokens()
        await this.loadModels()
    },
    methods: {
        async loadFreeTokens() {
            try {
                const res = await getFreeTokens()
                // Get only the IDS
                this.tokens = res.data.map((token) => token.id)
            } catch (error) {
                console.log(error)
            }
        },
        async loadModels() {
            try {
                const res = await getModels()
                this.models = res.data
            } catch (error) {
                console.log(error)
            }
        },
        async loadPart() {
            try {
                const res = await getPart(this.partId)
                // Save part data
                this.part = res.data
                // Save model data in a separate object
                this.selectedModel.id = res.data.modelId
                this.selectedModel.digits = res.data.digits
                this.selectedModel.partNumber = res.data.partNumber
                this.selectedModel.reference = res.data.reference
                console.log(this.part)
            } catch (error) {
                console.log(error)
            }
        },
        async editPart() {
            try {
                // Construct part object
                this.part.modelId = this.selectedModel.id
                delete this.part.digits
                delete this.part.partNumber
                delete this.part.reference
                const res = await updatePart(this.partId, this.part)
                console.log(res)
                this.message = 'Parte editada con éxito'
            } catch (error) {
                console.log(error)
                this.message = error
            }
        },
        hasNullProperties(part) {
            for (const key in part) {
                if (part[key] === null || part[key] == '') {
                    return true // Return true if any property is null
                }
            }
            return false // Return false if none of the properties are null
        },
        goToList() {
            router.push('/parts')
        },
        async removePart() {
            try {
                const res = await deletePart(this.partId)
                console.log(res)
                this.message = 'Parte borrada con éxito'
            } catch (error) {
                console.log(error)
                this.message = error
            }
        }
    }
})
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
