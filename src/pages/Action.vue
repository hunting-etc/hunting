<template>
    <div>
      <h1>Детали элемента</h1>
      <p><strong>ID:</strong> {{ id }}</p>
      <p><strong>Название:</strong> {{ title }}</p>
      <p><strong>Описание:</strong> {{ description }}</p>
      <!-- Добавьте другие поля, если необходимо -->
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { ChildService, Child } from '../api/service'; // Импортируйте ваш сервис и интерфейс Child
  
  export default defineComponent({
    name: 'Action',
    setup() {
      const route = useRoute();
      const id = route.query.id; // Получаем ID из query
      const title = ref(''); // Реф для заголовка
      const description = ref(''); // Реф для описания
      const childService = new ChildService(); // Экземпляр сервиса
  
      // Запрос данных при монтировании
      onMounted(async () => {
        if (id) {
          try {
            const data: Child[] = await childService.getAll('children'); // Получаем массив данных
            const item = data.find(child => child.id === id); // Находим элемент с соответствующим ID
            if (item) {
              title.value = item.title; // Устанавливаем заголовок
              description.value = item.description; // Устанавливаем описание
            } else {
              console.error("Элемент с таким ID не найден");
            }
          } catch (error) {
            console.error("Ошибка при получении данных:", error);
          }
        }
      });
  
      // Возвращаем все данные, которые хотим использовать в шаблоне
      return {
        id,
        title,
        description
      };
    }
  });
  </script>
  
  <style>
  /* Ваши стили */
  </style>