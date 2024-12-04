<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";

// Опции для направлений
const dropdownData = [
  {
    label: "Охота",
    key: "hunting",
    options: [
      { label: "Категории", path: "/home/hunting" },
      { label: "Информационные страницы", path: "/home/hunting-info" },
    ],
  },
  {
    label: "Рыбалка",
    key: "fishing",
    options: [
      { label: "Категории", path: "/home/fishing" },
      { label: "Информационные страницы", path: "/home/fishing-info" },
    ],
  },
  {
    label: "Активный отдых",
    key: "activeRecreation",
    options: [
      { label: "Категории", path: "/home/activeRecreation" },
      { label: "Информационные страницы", path: "/home/activeRecreation-info" },
    ],
  },
  {
    label: "Экотуризм",
    key: "fishing",
    options: [
      { label: "Категории", path: "/home/ecotourism" },
      { label: "Информационные страницы", path: "/home/ecotourism-info" },
    ],
  },
  {
    label: "Услуги",
    key: "services",
    options: [
      { label: "Категории", path: "/home/services" },
      { label: "Информационные страницы", path: "/home/services-info" },
    ],
  },
  {
    label: "Новости",
    key: "news",
    options: [
      { label: "Категории", path: "/home/news" },
      { label: "Информационные страницы", path: "/home/news-info" },
    ],
  }
];

// Управление маршрутизацией
const router = useRouter();
const handleSelection = (path: string) => {
  if (!path) return;
  router.push(path).catch((err) => {
    console.error("Navigation Error:", err);
  });
};
</script>

<template>
  <div class="main__menu">
    <div class="container">
      <!-- Левая панель -->
      <div class="sidebar">
        <h1 class="welcome__text">Admin panel</h1>

        <!-- Генерация выпадающих списков -->
        <div v-for="dropdown in dropdownData" :key="dropdown.key" class="menu-block">
          <Dropdown 
            :options="dropdown.options" 
            optionLabel="label" 
            :placeholder="dropdown.label" 
            @change="(e) => handleSelection(e.value.path)" 
            class="dropdown" 
          />
        </div>

        <!-- Пример дополнительной кнопки -->
        <RouterLink to="/about">
          <Button label="О компании" class="p-button-success" />
        </RouterLink>
      </div>
    
      <!-- Правая панель -->
      <div class="content">
        <router-view />
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
  background-color: rgb(199, 187, 166);
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
  align-items: stretch;
  gap: 10px;
}

.p-button-success {
  background-color: #1cb836; /* Зеленый цвет кнопки */
  color: black; /* Цвет текста */
  width: 100%; /* На весь контейнер */
  border: none; /* Убираем границу */
  transition: background-color 0.3s; /* Плавный переход */
}

.p-button-success:hover {
  background-color:  #199c2f; /* Темнее при наведении */
}

.p-button-success:active {
  background-color: #137824; /* Еще темнее при нажатии */
}

/* Стили для Dropdown */
.dropdown {
  background-color: #1cb836; /* Зеленый цвет */
  color: black; /* Цвет текста */
  width: 100%; /* На весь контейнер */
  border: none; /* Убираем границу */
  transition: background-color 0.3s; /* Плавный переход */
}

.dropdown:hover {
  background-color: #199c2f; /* Темнее при наведении */
}

.dropdown:active {
  background-color: #137824; /* Еще темнее при нажатии */
}

/* Правая область */
.content {
  width: 80%; /* Занимает 70% ширины */
  padding: 20px;
  overflow-y: auto; /* Скроллинг, если контент слишком длинный */
  background-color: #fff;
}
</style>