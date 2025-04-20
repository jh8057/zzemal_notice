<script setup lang="ts">
import { ref } from "vue";

const title = ref("");
const content = ref("");
const author = ref("");
const password = ref("");
</script>

<template>
  <input type="text" v-model="title" placeholder="제목" />
  <input type="text" v-model="content" placeholder="내용" />
  <input type="text" v-model="author" placeholder="작성자" />
  <input type="password" v-model="password" placeholder="비밀번호" />

  <slot
    :title="title"
    :content="content"
    :author="author"
    :password="password"
  ></slot>
</template>
