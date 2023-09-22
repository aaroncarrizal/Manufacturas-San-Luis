<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <header class="mb-3">
        <div class="wrapper">
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">
                        <img src="./assets/icon.jpeg" alt="Bootstrap" width="30" height="30">
                    </a>
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
                                    <li><RouterLink class="nav-link" to="/parts">Ver lista</RouterLink></li>
                                    <li><RouterLink class="nav-link" to="/parts/new">Registrar nueva</RouterLink></li>
                                </ul>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Fichas
                                </a>
                                <ul class="dropdown-menu">
                                    <li><RouterLink class="nav-link" to="/tokens">Ver lista</RouterLink></li>
                                    <li><RouterLink class="nav-link" to="/tokens/new">Registrar</RouterLink></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </header>

    <RouterView />
</template>

<style>
.icon{
    width: 25%;
}
</style>