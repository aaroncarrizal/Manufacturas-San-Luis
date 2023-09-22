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
                <label for="sku" class="form-label">SKU</label>
                <input
                    type="text"
                    class="form-control"
                    id="sku"
                    aria-describedby="skuHelp"
                    v-model="part.sku"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="tokenId" class="form-label">Ficha relacionada</label>
                <select
                    class="form-select"
                    aria-label="Default select example"
                    id="tokenId"
                    v-model="part.tokenId"
                    required
                >
                    <option v-for="(token, index) in tokens" :key="index" :value="token.id">
                        {{ token.id }}
                    </option>
                </select>
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
                        <h2>
                            {{ this.message }}
                        </h2>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-primary"
                            data-bs-dismiss="modal"
                            @click="registerNew()"
                        >
                            Registrar nueva
                        </button>
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                            @click="goToList()"
                        >
                            Ir a lista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from 'vue'
import { getFreeTokens } from '../../../services/TokenService'
import { createPart } from '../../../services/PartService'
import router from '../../router'

export default defineComponent({
    data() {
        return {
            part: {
                qr: '',
                sku: '',
                tokenId: null
            },
            tokens: [],
            message: ''
        }
    },
    async beforeMount() {
        await this.loadTokens()
    },
    methods: {
        async loadTokens() {
            try {
                const res = await getFreeTokens()
                this.tokens = res.data
            } catch (error) {
                console.log(error)
            }
        },
        async savePart() {
            try {
                const res = await createPart(this.part)
                console.log(res)
                this.message = 'Parte registrada con éxito'
            } catch (error) {
                console.log(error)
                this.message = error
            }
        },
        goToList() {
            router.push('/parts')
        },
        registerNew() {
            window.location.reload()
        }
    },
    watch: {
        'part.qr': function (newQR) {
            // Automatically set SKU to the first 5 characters of QR
            if (this.part.qr && this.part.qr.length > 0) {
                this.part.sku = newQR.slice(0, 5)
            }
        }
    }
})
</script>
