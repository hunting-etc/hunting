<template>
  <div class="panel">
  <label for="h1">H1</label>
  <InputText id="h1" v-model="h1" />
  <Divider />

  <label for="title">Title</label>
  <InputText id="title" v-model="title" />
  <Divider />

  <label for="description">Description</label>
  <InputText id="description" v-model="description" />
  <Divider />

  <label for="name">Название</label>
  <InputText id="name" v-model="name" />
  <Divider />

  <label for="content">Content</label>
  <InputText id="content" v-model="content" />
</div>
<Button label="Сохранить" class="p-button" @click="save" />

</template>
<!-- <label for="sortOrder">Сортировка</label>
    <InputText 
      id="sortOrder" 
      :value="sortOrder !== null ? sortOrder.toString() : ''" 
      @input="updateSortOrder" 
      type="number"
    /> -->

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { ChildService, Child } from '../api/service';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Button from 'primevue/button';

export default defineComponent({
  name: 'Action',
  components: {
    InputText,
    Divider,
    Button
  },
  props: {
    id: {
      type: String,
      required: false
    },
    initialData: {
      type: Object as () => Child | null,
      default: null
    },
    categoryType: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const { id, initialData, categoryType } = toRefs(props);
    const h1 = ref(initialData?.value?.h1 || '');
    const title = ref(initialData?.value?.title || '');
    const description = ref(initialData?.value?.description || '');
    const name = ref(initialData?.value?.name || '');
    const category = ref(categoryType.value);
    const content = ref(initialData?.value?.content || '');
    const childService = new ChildService();


    onMounted(async () => {
      if (id.value && id.value !== 'null' && !initialData.value) {
        try {
          const data: Child | Child[] = await childService.getById('test/categories', id.value);
          if (Array.isArray(data)) {
            const item = data.find((child) => child.id === id.value);
            if (item) {
              h1.value = item.h1 || '';
              title.value = item.title || '';
              description.value = item.description || '';
              name.value = item.name || '';
              content.value = item.content || '';
            } else {
              console.error('Элемент с таким ID не найден');
            }
          } else {
            console.error('Ожидался массив данных, но получен один объект');
          }
        } catch (error) {
          console.error('Ошибка при получении данных:', error);
        }
      }
    });

    const save = async () => {
      console.log('Начало сохранения...');
  // Создаем объект с новыми значениями полей
  const data: Partial<Child> = {
    h1: h1.value,
    title: title.value,
    description: description.value,
    name: name.value,
    content: content.value,
    category: categoryType.value
  };

  // Создаем объект для измененных данных
  const updatedData: Partial<Child> = {};

  // Сравниваем каждый ключ с текущими значениями и обновляем только те, что изменились
  for (const key of Object.keys(data) as Array<keyof Child>) {
    // Получаем значение из data и из initialData
    const newValue = data[key];
    const currentValue = initialData.value?.[key];

    // Если значения различаются, добавляем это поле в updatedData
    if (newValue !== currentValue) {
      updatedData[key] = newValue;
    }
  }

  // Если нет изменений, ничего не сохраняем
  if (Object.keys(updatedData).length === 0) {
    console.log('Нет изменений для сохранения.');
    return;
  }

  try {
    const startTime = performance.now(); // Начало отсчета времени
    // Если ID присутствует, выполняем обновление
    if (id.value && id.value !== 'null') {
      await childService.update(id.value, updatedData, 'test/categories');
    } else {
      // В противном случае создаем новый элемент
      await childService.create({ ...data, category: category.value });
    }
    console.log('Успех: Данные сохранены!');
    const endTime = performance.now(); // Конец отсчета времени
    console.log(`Сохранение завершено за ${endTime - startTime} мс`);
    emit('close');
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
  }
};



    return {
      h1,
      title,
      description,
      name,
      category,
      content,
      save
    };
  }
});

</script>


<style>
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
  width: 97%; /* Ширина на 100% */
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
  background-color: #269e2a;
  color: white; /* Белый текст */
  border: none; /* Без границы */
  padding: 5px 10px; /* Отступы */
  cursor: pointer; /* Указатель при наведении */
  border-radius: 4px; /* Закругленные углы */
  margin-top: 20px;
}

/* Эффект при наведении на кнопку */
.p-button:hover {
  background-color: #166f1a; /* Темнее при наведении */
}
  </style>
