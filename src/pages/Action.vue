<template>
      <Panel header="Изменение категории">
        <div class="panel">
            <label for="h1">h1</label>
            <InputText id="h1" v-model="h1"/>
            <Divider />
            <label for="title">Title</label>
            <InputText id="title" v-model="title"/>
            <Divider />
            <label for="description">description</label>
            <InputText id="description" v-model="description"/>
            <Divider />
            <label for="name">name</label>
            <InputText id="name" v-model="name"/>
            <Divider />
            <label for="content">content</label>
            <InputText id="content" v-model="content"/>
        </div>
      </Panel>
      <Button label="Сохранить" @click="save"/>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { ChildService, Child } from '../api/service'; // Импортируйте ваш сервис и интерфейс Child
  import Panel from 'primevue/panel';
  import InputText from 'primevue/inputtext';
  import Divider from 'primevue/divider';
  import { useToast } from 'primevue/usetoast';

  export default defineComponent({
    name: 'Action',
    setup() {
      const route = useRoute();
      const id = route.query.id; // Получаем ID из query
      const h1 = ref('');
      const title = ref(''); // Реф для заголовка
      const description = ref(''); // Реф для описания
      const name = ref('');
      const content = ref('');
      const childService = new ChildService(); // Экземпляр сервиса
      const toast = useToast();
  
      // Запрос данных при монтировании
      onMounted(async () => {
        if (id) {
          try {
            const data: Child[] = await childService.getAll('/test/categories'); // Получаем массив данных
            const item = data.find(child => child.id === id); // Находим элемент с соответствующим ID
            if (item) {
                h1.value = item.h1;
                title.value = item.title; // Устанавливаем заголовок
                description.value = item.description; // Устанавливаем описание
                name.value = item.name;
                content.value = item.content;
            } else {
              console.error("Элемент с таким ID не найден");
            }
          } catch (error) {
            console.error("Ошибка при получении данных:", error);
          }
        }
      });

  
      const save = async () => {
      const data: Child = {
        id: id as string, // или создайте новый ID, если это новый элемент
        h1: h1.value,
        title: title.value,
        description: description.value,
        name: name.value,
        content: content.value,
      };

      try {
        const result = await childService.create(data, '/test/categories');
        if (result) {
          toast.add({ severity: 'error', summary: 'Ошибка', detail: result.error });
        } else {
          toast.add({ severity: 'success', summary: 'Успех', detail: 'Данные сохранены!' });
        }
      } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось сохранить данные.' });
      }
    };


      // Возвращаем все данные, которые хотим использовать в шаблоне
      return {
        id,
        h1,
        title,
        description,
        name,
        content,
        save
      };
    }
  });
  </script>
  
  <style>
  /* Ваши стили */
  </style>