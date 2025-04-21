<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const content = ref("");
</script>

<template>
  <p>
    댓글
    <input type="text" v-model="content" placeholder="내용" />
    <input type="text" v-model="author" placeholder="작성자" />
    <slot :commentContent="content" :commentAuthor="author"></slot>
  </p>
</template>
