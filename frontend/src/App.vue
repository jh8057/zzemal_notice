<script setup lang="ts"></script>

<template>
  <nav>
    <router-link to="/">게시판</router-link>
  </nav>

  <router-view />
</template>

<style scoped>
nav {
  display: flex;
  gap: 10px;
}
nav a {
  text-decoration: none;
  color: #42b983;
}

nav a.router-link-active {
  font-weight: bold;
  color: #42b983;
}
</style>
