
<script setup>

</script>

<template>
  <nav>
    <router-link to="/">Home</router-link>
    |
    <router-link to="/acteurs">Acteurs</router-link>
    |
    <router-link to="/movies">Movies</router-link>
    |
    <router-link to="/categorie">Categorie</router-link>
    |
    <router-link to="/login">Login</router-link>
  </nav>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
