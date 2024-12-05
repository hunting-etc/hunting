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

    <label for="image">Фото</label>
    <div class="card flex flex-col items-center gap-6">
      <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="p-button-outlined" />
      <img v-if="src" :src="src" alt="Image" class="shadow-md rounded-xl w-full sm:w-64" style="filter: grayscale(100%)" />
    </div>

    <label for="content">Content</label>
    <InputText id="content" v-model="content" />
    
    <Button label="Сохранить" class="p-button" @click="save" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { ChildService, Child } from '../api/service';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload'; // Убедитесь, что импортируете FileUpload

export default defineComponent({
  name: 'Action',
  components: {
    InputText,
    Divider,
    Button,
    FileUpload // Не забудьте добавить FileUpload в компоненты
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
    const content = ref(initialData?.value?.content || '');
    const src = ref<string | null>(null);
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

    function onFileSelect(event: { files: File[] }) {
      const file = event.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.result) {
          src.value = e.target.result as string; // Приведение типа
        }
      };

      reader.readAsDataURL(file);
    }

    const save = async () => {
      console.log('Начало сохранения...');
      const data: Partial<Child> = {
        h1: h1.value,
        title: title.value,
        description: description.value,
        name: name.value,
        content: content.value,
        category: categoryType.value
      };

      const updatedData: Partial<Child> = {};

      for (const key of Object.keys(data) as Array<keyof Child>) {
        const newValue = data[key];
        const currentValue = initialData.value?.[key];
        if (newValue !== currentValue) {
          updatedData[key] = newValue;
        }
      }

      if (Object.keys(updatedData).length === 0) {
        console.log('Нет изменений для сохранения.');
        return;
      }

      try {
        const startTime = performance.now();
        if (id.value && id.value !== 'null') {
          await childService.update(id.value, updatedData, 'test/categories');
        } else {
          await childService.create({ ...data, category: categoryType.value });
        }
        console.log('Успех: Данные сохранены!');
        const endTime = performance.now();
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
      content,
      src,
      onFileSelect,
      save
    };
  }
});
</script>

<style>
/* Стили для заголовка панели */
.p-panel-header {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

/* Стили для элементов ввода */
input.p-inputtext {
  width: 97%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;
  transition: border 0.3s;
}

/* Эффект при наведении на элементы ввода */
input.p-inputtext:focus {
  border-color: #4CAF50;
  outline: none;
}

/* Стили для кнопок */
.p-button {
  background-color: #269e2a;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 20px;
}

/* Эффект при наведении на кнопку */
.p-button:hover {
  background-color: #166f1a;
}
</style>