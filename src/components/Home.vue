<script setup lang="ts">
import { ref } from "vue";
import { ParentService, ChildService, InfoService } from "../api/service.ts";

// Интерфейсы для типизации данных
interface Parent {
  id: string;
  title: string;
}

interface Child {
  id: string;
  title: string;
  parentId: string;
}

interface Info {
  id: string;
  description: string;
}

// Массив данных для левой панели
const parents = ref<Parent[]>([]); 

// Данные для правой панели
const childs = ref<Child[]>([]); 
const infos = ref<Info[]>([]);

// Управление отображением правой панели
const selectedParentId = ref<string | null>(null);
const showChild = ref(true); // Показывать дочерние данные

// Сервисы для загрузки данных
const parentService = new ParentService();
const childService = new ChildService();
const infoService = new InfoService();

// Загрузка данных для левой панели
const loadParent = async () => {
  try {
    parents.value = await parentService.getAll("admin");
  } catch (error) {
    console.error("Ошибка загрузки постов:", error);
  }
};

// Загрузка данных для правой панели
const loadChild = async (parentId: string) => {
  try {
    selectedParentId.value = parentId;
    childs.value = await childService.getAll(`admin/${parentId}/Child`);
    infos.value = []; // Очищаем данные 3 уровня
    showChild.value = true;
  } catch (error) {
    console.error("Ошибка загрузки дочерних постов:", error);
  }
};

const loadInfo = async (childId: string) => {
  try {
    infos.value = await infoService.getAll(`admin/${childId}/info`);
    showChild.value = false; // Переход на 3 уровень
  } catch (error) {
    console.error("Ошибка загрузки деталей:", error);
  }
};

// Загружаем посты при старте
loadParent();
</script>

<template>
  <div class="main__menu">
    <div class="container">
      <!-- Левая панель -->
      <div class="sidebar">
        <h1 class="welcome__text">Admin panel</h1>
        <div v-for="post in parents" :key="post.id">
          <button @click="loadChild(post.id)" class="post-button">
            {{ post.title }}
          </button>
        </div>
      </div>

      <!-- Правая панель -->
      <div class="content">
        <div v-if="showChild">
          <div v-for="subPost in childs" :key="subPost.id">
            <button @click="loadInfo(subPost.id)" class="subpost-button">
              {{ subPost.title }}
            </button>
          </div>
        </div>
        <div v-else>
          <ul>
            <li v-for="detail in infos" :key="detail.id">
              {{ detail.description }}
            </li>
          </ul>
        </div>
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
