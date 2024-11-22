<script setup lang="ts">
import { ref } from "vue";
import { PostService } from "../api/service.ts";

// Интерфейс для типизации постов
interface Post {
  id: string;
  title: string;
  content?: string; // Поле content может быть необязательным
}

// Массив постов
const posts = ref<Post[]>([]); // Типизированный массив постов

// Выбранный пост
const selectedPost = ref<Post | null>(null); // Один пост или null

// Загружаем данные при монтировании
const loadPosts = async () => {
  try {
    const service = new PostService();
    posts.value = await service.getAll("admin"); // Типизированный результат
  } catch (error) {
    console.error("Ошибка загрузки постов:", error);
  }
};

// Загружаем данные при старте
loadPosts();

// Обработчик нажатия на кнопку
const handleClick = (post: Post) => {
  selectedPost.value = post; // Устанавливаем выбранный пост
};
</script>

<template>
  <div class="main__menu">
    <div class="container">
      <!-- Левая панель с кнопками -->
      <div class="sidebar">
        <h1 class="welcome__text">Admin panel</h1>
        <div v-for="post in posts" :key="post.id">
          <button
            @click="handleClick(post)"
            class="post-button"
          >
            {{ post.title }}
          </button>
        </div>
      </div>

      <!-- Правая область для отображения содержимого -->
      <div class="content">
        <h2 v-if="selectedPost">Информация о посте</h2>
        <div v-if="selectedPost">
          <p><strong>ID:</strong> {{ selectedPost.id }}</p>
          <p><strong>Название:</strong> {{ selectedPost.title }}</p>
          <p><strong>Содержимое:</strong> {{ selectedPost.content || 'Нет данных' }}</p>
        </div>
        <p v-else>Выберите пост, чтобы увидеть подробности</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome__text {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  color: green;
  margin: 0px;
  padding: 15px;
  text-align: center;
  
}
/* Основной контейнер */
.container {
  display: flex;
  margin: 0;
  padding: 0;
  background-color: wheat;
  height: 100vh; /* Высота 100% экрана */
}

/* Левая панель */
.sidebar {
  width: 20%; /* Занимает 30% ширины */
  background-color: #f4f4f4; /* Светлый фон */
  padding: 20px;
  display: flex;
  flex-direction: column; /* Кнопки располагаются вертикально */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  align-items:stretch;
  gap: 10px;
}

/* Правая область */
.content {
  width: 80%; /* Занимает 70% ширины */
  padding: 20px;
  overflow-y: auto; /* Скроллинг, если контент слишком длинный */
  background-color: #fff;
}
h1{
  margin: 0;
  padding: 0;
}
.p-button-success{
  width: 100%;
  box-sizing: border-box;
  background-color: #1dc439;
  border: none;
  color: white;
  border-radius: 10px;
  font-size: 18px;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}
.p-button-success:hover{
  background-color: #187d29;
}
.p-button-success:active {
  background-color: #12631f; /* Еще темнее при нажатии */
  transform: scale(1.02); /* Легкий эффект сжатия */
}
</style>