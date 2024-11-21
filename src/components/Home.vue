<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import { RouterLink, RouterView, useRouter } from "vue-router";
const router = useRouter();
</script>

<template>
  <div class="main__menu">
    <div class="container">
      <!-- Левая панель с кнопками -->
      <div class="sidebar">
        <h1 class="welcome__text">Admin panel</h1>
        <RouterLink to="/hunting">
          <Button label="Охота" class="p-button-success" />
        </RouterLink>
        <RouterLink to="/fishing">
          <Button label="Рыбалка" class="p-button-success" />
        </RouterLink>
        <RouterLink to="/activeRecreation">
          <Button label="Активный отдых" class="p-button-success" />
        </RouterLink>
        <RouterLink to="/ecotourism">
          <Button label="Экотуризм" class="p-button-success" />
        </RouterLink>
        <RouterLink to="/services">
          <Button label="Услуги" class="p-button-success" />
        </RouterLink>
        <RouterLink to="/about">
          <Button label="О компании" class="p-button-success" />
        </RouterLink>
        <RouterLink to="/news">
          <Button label="Новости" class="p-button-success" />
        </RouterLink>
        <RouterLink to="/test">
          <Button label="Test" class="p-button-success" />
        </RouterLink>


      </div>
      <!-- Правая область для отображения содержимого -->
      <div class="content">
        <RouterView />
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