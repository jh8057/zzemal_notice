<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import InputBar from "../components/inputBar.vue";

const title = ref("");
const content = ref("");
const author = ref("");
const password = ref("");

type noticeItem = {
  title?: string;
  content?: string;
  author?: string;
  password?: string;
};

const submit = async (item: noticeItem) => {
  const $axios = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await $axios.post("/posts", item);

  console.log("result", result);
};

const noticeList = ref([]) as any;
const noticeTotal = ref(0) as any;
const getList = async () => {
  const $axios = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await $axios.get("/posts");
  noticeList.value = result.data.data;
  noticeTotal.value = result.data.total;

  console.log("result", result);
};

const updateNotice = async (id: any, item: noticeItem) => {
  const $axios = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await $axios.patch(`/posts/update/${id}`, {
    title: item.title,
    content: item.content,
    author: item.author,
    password: item.password,
  });

  console.log("result", result);
};

const deleteNotice = async (id: any, password: any) => {
  const $axios = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("pass", password);
  const result = await $axios.delete(`/posts/delete/${id}`, {
    data: {
      password: password,
    },
  });
  console.log("result", result);
};
</script>

<template>
  <!-- 1.게시판 생성 -->
  <h2>게시판 등록</h2>
  <input-bar v-slot="{ title, author, content, password }">
    <button @click="submit({ title, author, content, password })">등록</button>
  </input-bar>

  <!-- 2.게시판 목록 -->
  <h2>게시판 목록</h2>
  <button @click="getList">목록 가져오기</button>
  <ul>
    <li v-for="(item, index) in noticeList" :key="index">
      <p>{{ item }}</p>
      <div>
        <input-bar v-slot="{ title, author, content, password }">
          <button
            @click="updateNotice(item.id, { title, author, content, password })"
          >
            수정
          </button>
          <button @click="deleteNotice(item.id, password)">삭제</button>
        </input-bar>
      </div>
    </li>
  </ul>
</template>
