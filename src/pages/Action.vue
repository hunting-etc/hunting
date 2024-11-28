<template>
      <Panel header="Изменение категории">
        <div class="panel">
            <label for="h1">h1</label>
            <InputText id="h1" v-model="h1"/>
            <Divider />
            <label for="title">Title</label>
            <InputText id="title" v-model="title"/>
            <Divider />
            <label for="description">Description</label>
            <InputText id="description" v-model="description"/>
            <Divider />
            <label for="name">Name</label>
            <InputText id="name" v-model="name"/>
            <Divider />
            <label for="content">Content</label>
            <InputText id="content" v-model="content"/>
        </div>
      </Panel>
      <Button label="Сохранить" class="p-button" @click="save"/>
  </template>

  <script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ChildService, Child } from '../api/service';
import Panel from 'primevue/panel';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Button from 'primevue/button';


export default defineComponent({
  name: 'Action',
  components: {
    Panel,
    InputText,
    Divider,
    Button
  },
  setup() {
    const route = useRoute();
    const id = route.query.id as string; // Указываем тип id
    const h1 = ref('');
    const title = ref('');
    const description = ref('');
    const name = ref('');
    const content = ref('');
    const childService = new ChildService();

    onMounted(async () => {
      if (id) {
        try {
          const data: Child[] = await childService.getAll('/test/categories');
          const item = data.find(child => child.id === id);
          if (item) {
            h1.value = item.h1;
            title.value = item.title;
            description.value = item.description;
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
      const data: Partial<Child> = {
        h1: h1.value,
        title: title.value,
        description: description.value,
        name: name.value,
        content: content.value,
      };

      try {
        const result = await childService.update(id, data, 'test/categories');
        if (result) {
          console.log('Успех: Данные сохранены!'); // Выводим сообщение об успехе
        }
      } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
      }
    };

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
 .panel {
    width: 99%;
  padding: 20px;
  background-color: #f9f9f9; /* Светлый фон панели */
  border-radius: 8px; /* Закругленные углы */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Лёгкая тень */
}

/* Стили для заголовка панели */
.p-panel-header {
  background-color: #4CAF50; /* Цвет фона заголовка */
  color: white; /* Цвет текста заголовка */
  font-weight: bold; /* Жирный шрифт */
  padding: 10px; /* Отступы */
  border-top-left-radius: 8px; /* Закругление верхних углов */
  border-top-right-radius: 8px; /* Закругление верхних углов */
}

/* Стили для элементов ввода */
input.p-inputtext {
  width: 100%; /* Ширина на 100% */
  padding: 10px; /* Отступы */
  border: 1px solid #ccc; /* Светло-серая граница */
  border-radius: 4px; /* Закругленные углы */
  margin-bottom: 15px; /* Отступ между элементами */
  transition: border 0.3s; /* Плавный переход при изменении границы */
}

/* Эффект при наведении на элементы ввода */
input.p-inputtext:focus {
  border-color: #4CAF50; /* Цвет границы при фокусе */
  outline: none; /* Убираем стандартный обвод */
}

/* Стили для кнопок */
.p-button {
  background-color: #2196F3; /* Синий фон */
  color: white; /* Белый текст */
  border: none; /* Без границы */
  padding: 5px 10px; /* Отступы */
  cursor: pointer; /* Указатель при наведении */
  border-radius: 4px; /* Закругленные углы */
}

/* Эффект при наведении на кнопку */
.p-button:hover {
  background-color: #1976D2; /* Темнее при наведении */
}
  </style>


