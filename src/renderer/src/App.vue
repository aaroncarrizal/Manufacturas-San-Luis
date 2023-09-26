<script setup>
import Navbar from './components/Navbar.vue';
</script>
<template>
    <div>
        <Navbar></Navbar>
        <router-view></router-view>

    </div>
</template>

<style>
.icon{
    width: 25%;
}
</style>