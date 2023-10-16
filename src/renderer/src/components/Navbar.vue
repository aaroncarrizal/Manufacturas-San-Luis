<template>
    <header class="mb-3">
        <div class="wrapper">
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <router-link class="navbar-brand" to="/parts">
                        <img src="../assets/icon.jpeg" alt="Bootstrap" width="30" height="30">
                    </router-link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul class="navbar-nav">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Partes
                                </a>
                                <ul class="dropdown-menu">
                                    <li><router-link class="nav-link" to="/parts">Ver lista</router-link></li>
                                    <li><router-link class="nav-link" to="/parts/new">Registrar nueva</router-link></li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Fichas
                                </a>
                                <ul class="dropdown-menu">
                                    <li><router-link class="nav-link" to="/tokens">Ver lista</router-link></li>
                                    <li><router-link class="nav-link" to="/tokens/new">Registrar</router-link></li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Modelos
                                </a>
                                <ul class="dropdown-menu">
                                    <li><router-link class="nav-link" to="/models">Ver lista</router-link></li>
                                    <li><router-link class="nav-link" to="/models/new">Registrar</router-link></li>
                                </ul>
                            </li>
                            <li class="nav-item ">
                                <router-link class="nav-link" to="/printedLabels">Etiquetas impresas</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </header>
</template>
<script>
import { defineComponent } from "vue"
import router from '../router/index'

export default defineComponent({
    name: "Nav-bar",
});
</script>