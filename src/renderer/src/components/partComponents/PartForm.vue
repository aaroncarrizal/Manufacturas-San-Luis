<template>
    <div class="container-lg">
        <p class="h1 text-center my-3">Registrar parte</p>
        <form @submit.prevent="savePart()">
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
                    v-model="this.part.modelId"
                    :options="models"
                    :allow-empty="false"
                    placeholder=""
                    track-by="id"
                    label="digits"
                    required
                    @select="updateModelData"
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
                    :placeholder="partNumber"
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
                    :placeholder="reference"
                />
            </div>
            <div class="mb-3">
                <label for="tokenId" class="form-label">Ficha relacionada</label>
                <VueMultiselect
                    v-model="this.part.tokenId"
                    :options="tokens"
                    :allow-empty="false"
                    placeholder=""
                    required
                >
                </VueMultiselect>
            </div>
            <div class="d-grid gap-2 mb-3">
                <template v-if="hasNullProperties(this.part)">
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
import { getFreeTokens } from '../../../services/TokenService'
import { getModels } from '../../../services/ModelService'
import { createPart } from '../../../services/PartService'
import VueMultiselect from 'vue-multiselect'
import router from '../../router'

export default defineComponent({
    components: { VueMultiselect },
    data() {
        return {
            part: {
                qr: null,
                modelId: null,
                tokenId: null
            },
            tokens: [],
            message: null,
            models: [],
            partNumber: '',
            reference: ''
        }
    },
    async beforeMount() {
        await this.loadTokens()
        await this.loadModels()
    },
    methods: {
        async loadTokens() {
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
        async savePart() {
            try {
                // Get rid of unnecessary info
                this.part.modelId = this.part.modelId.id
                const res = await createPart(this.part)
                console.log(res)
                this.message = 'Parte registrada con éxito'
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
        registerNew() {
            window.location.reload()
        },
        updateModelData(model) {
            this.partNumber = model.partNumber
            this.reference = model.reference
        },
    }
})
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
