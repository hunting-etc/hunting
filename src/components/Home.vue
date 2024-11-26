<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Dropdown from "primevue/dropdown";
import { ParentService, ChildService, InfoService, Parent, Info, Child } from "../api/service.ts";

// Определяем тип элемента меню
interface MenuItem {
  label: string;
  path: string;
}

const router = useRouter();

// Определяем элементы для выпадающего списка
const menuItems: MenuItem[] = [
  { label: "Категории", path: "/categories" },
  { label: "Информационные страницы", path: "/info-pages" },
];

// Храним выбранные элементы для каждого раздела
const huntingSelection = ref<MenuItem | null>(null);
const fishingSelection = ref<MenuItem | null>(null);
const activeRecreationSelection = ref<MenuItem | null>(null);
const ecotourismSelection = ref<MenuItem | null>(null);
const servicesSelection = ref<MenuItem | null>(null);
const newsSelection = ref<MenuItem | null>(null);

// Данные для правой панели
const infos = ref<Info[]>([]);
const currentContent = ref<string>("");

// Сервисы для загрузки данных
const infoService = new InfoService();

// Загрузка данных для категорий
const loadCategoriesData = async (context: string) => {
  try {
    const response = await infoService.getAll(`admin/${context}/categories`); // Подразумевается, что у вас есть API для получения категорий
    infos.value = response;
    currentContent.value = "Категории"; // Устанавливаем заголовок
  } catch (error) {
    console.error("Ошибка загрузки категорий:", error);
  }
};

// Обработчик навигации
const navigate = (selection: MenuItem | null, context: string) => {
  if (selection) {
    // Если выбраны категории, загружаем данные
    if (selection.label === "Категории") {
      loadCategoriesData(context);
    } else if (selection.path) {
      router.push(selection.path); // Переход по маршруту
      currentContent.value = selection.label; // Обновляем заголовок
    }
  }
};
</script>

<template>
  <div class="main__menu">
    <div class="container">
      <div class="sidebar">
        <h1 class="welcome__text">Admin panel</h1>

        <div class="menu-block">
          <Dropdown
            v-model="huntingSelection"
            :options="menuItems"
            optionLabel="label"
            placeholder="Охота"
            appendTo="self"
            class="dropdown"
            @change="(event) => navigate(event.value, 'hunting')"
          />
        </div>

        <div class="menu-block">
          <Dropdown
            v-model="fishingSelection"
            :options="menuItems"
            optionLabel="label"
            placeholder="Рыбалка"
            appendTo="self"
            @change="(event) => navigate(event.value, 'fishing')"
            class="dropdown"
          />
        </div>

        <div class="menu-block">
          <Dropdown
            v-model="activeRecreationSelection"
            :options="menuItems"
            optionLabel="label"
            placeholder="Активный отдых"
            appendTo="self"
            @change="(event) => navigate(event.value, 'activeRecreation')"
            class="dropdown"
          />
        </div>

        <div class="menu-block">
          <Dropdown
            v-model="ecotourismSelection"
            :options="menuItems"
            optionLabel="label"
            placeholder="Экотуризм"
            appendTo="self"
            @change="(event) => navigate(event.value, 'ecotourism')"
            class="dropdown"
          />
        </div>

        <div class="menu-block">
          <Dropdown
            v-model="servicesSelection"
            :options="menuItems"
            optionLabel="label"
            placeholder="Услуги"
            appendTo="self"
            @change="(event) => navigate(event.value, 'services')"
            class="dropdown"
          />
        </div>

        <RouterLink to="/about">
          <Button label="О компании" class="p-button-success" />
        </RouterLink>

        <div class="menu-block">
          <Dropdown
            v-model="newsSelection"
            :options="menuItems"
            optionLabel="label"
            placeholder="Новости"
            appendTo="self"
            @change="(event) => navigate(event.value, 'news')"
            class="dropdown"
          />
        </div>
      </div>

      <div class="content">
        <h2>{{ currentContent }}</h2>
        <ul>
          <li v-for="info in infos" :key="info.id">{{ info.description }}</li>
        </ul>
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
  width: 20%; /* Занимает 20% ширины */
  background-color: #f4f4f4; /* Светлый фон */
  padding: 20px;
  display: flex;
  flex-direction: column; /* Кнопки располагаются вертикально */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  align-items: stretch;
  gap: 10px;
}

/* Правая область */
.content {
  width: 80%; /* Занимает 80% ширины */
  padding: 20px;
  overflow-y: auto; /* Скроллинг, если контент слишком длинный */
  background-color: #fff;
}

.menu-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative; /* Локальное позиционирование */
}

h1 {
  margin: 0;
  padding: 0;
}

.dropdown {
  width: 100%;
  box-sizing: border-box;
  background-color: #1dc439;
  border: none;
  color: black;
  font-size: 18px;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
}

.p-dropdown .p-dropdown-label {
  color: black !important; /* Черный цвет */
  font-weight: bold !important; /* Жирный шрифт */
}

.p-dropdown-panel {
  position: relative !important;
  z-index: auto;
}

.dropdown:hover {
  background-color: #187d29;
}

.dropdown:active {
  background-color: #12631f; /* Еще темнее при нажатии */
  transform: scale(1.02); /* Легкий эффект сжатия */
}
</style>