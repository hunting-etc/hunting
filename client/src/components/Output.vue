<template>
  <div>
    <h1>Posts</h1>
    <div>
      <button
        v-for="post in posts"
        :key="post.id"
        @click="handleClick(post)"
        class="post-button"
      >
        {{ post.title }}
      </button>
    </div>
  </div>
</template>

<script>
import { ParentService } from "../api/service.ts";

export default {
  data() {
    return {
      posts: [], // Инициализируем как пустой массив
    };
  },
  mounted() {
    this.loadPosts("admin");
  },
  methods: {
    async loadPosts(prefix) {
      try {
        const service = new ParentService();
        const posts = await service.getAll(prefix);
        this.posts = posts;
      } catch (error) {
        console.error("Ошибка загрузки постов:", error);
      }
    },
    handleClick(post) {
      alert(`Вы нажали на пост с ID: ${post.id} и названием: ${post.title}`);
    },
  },
};
</script>

<style scoped>

</style>
