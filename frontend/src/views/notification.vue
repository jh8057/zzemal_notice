<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import InputBar from "../components/inputBar.vue";
import CommentBar from "../components/commentBar.vue";

const $axios = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

type noticeItem = {
  title?: string;
  content?: string;
  author?: string;
  password?: string;
};

const setPost = async (item: noticeItem) => {
  const result = await $axios.post("/posts", item);
  console.log("result", result);
};

const noticeList = ref([]) as any;
const noticeTotal = ref(0) as any;
const getList = async () => {
  const result = await $axios.get("/posts");
  noticeList.value = result.data.data;
  noticeTotal.value = result.data.total;

  console.log("result", result);
};

const updateNotice = async (id: any, item: noticeItem) => {
  const result = await $axios.patch(`/posts/update/${id}`, {
    title: item.title,
    content: item.content,
    author: item.author,
    password: item.password,
  });

  console.log("result", result);
};

const deleteNotice = async (id: any, password: any) => {
  const result = await $axios.delete(`/posts/delete/${id}`, {
    data: {
      password: password,
    },
  });
  console.log("result", result);
};

const setComment = async (id: number, item: any, parentId?: number) => {
  const result = parentId
    ? await $axios.post(`/comments/${id}/${parentId}`, item)
    : await $axios.post(`/comments/${id}`, item);

  console.log("result", result);
};

const getComment = async (id: number) => {
  const result = await $axios.get(`/comments/${id}`);
  // 해당 게시물에 추가
  noticeList.value.forEach((item: any) => {
    if (Number(item.id) === Number(id)) {
      item.comments = result.data;
    }
  });
  console.log("result", result);
};
</script>

<template>
  <!-- 1.게시판 생성 -->
  <h2>게시판 등록</h2>
  <input-bar v-slot="{ title, author, content, password }">
    <button @click="setPost({ title, author, content, password })">등록</button>
  </input-bar>

  <!-- 2.게시판 목록 -->
  <h2>게시판 목록</h2>
  <button @click="getList">목록 가져오기</button>
  <ul>
    <li
      v-for="(item, index) in noticeList"
      :key="index"
      style="border: 1px black solid; margin: 10px; padding: 10px"
    >
      <p>{{ item }}</p>
      <div>
        <input-bar v-slot="{ title, author, content, password }">
          <button
            @click="updateNotice(item.id, { title, author, content, password })"
          >
            수정
          </button>
          <button @click="deleteNotice(item.id, password)">삭제</button>

          <!-- 3. 댓글목록 -->
          <button @click="getComment(item.id)">댓글 목록 가져오기</button>
          <comment-bar v-slot="{ commentContent, commentAuthor }">
            <button
              @click="
                setComment(item.id, {
                  content: commentContent,
                  author: commentAuthor,
                })
              "
            >
              댓글 등록
            </button>
          </comment-bar>
          <ul>
            <li v-for="(comment, index) in item.comments" :key="index">
              <p>{{ comment }}</p>
              <comment-bar v-slot="{ commentContent, commentAuthor }">
                <button
                  @click="
                    setComment(
                      item.id,
                      {
                        content: commentContent,
                        author: commentAuthor,
                      },
                      comment.id
                    )
                  "
                >
                  대댓글 등록
                </button>
              </comment-bar>
            </li>
          </ul>
        </input-bar>
      </div>
    </li>
  </ul>
</template>
