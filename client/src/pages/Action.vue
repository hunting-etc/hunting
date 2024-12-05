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
    <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="p-button-outlined" />
    <img v-if="src" :src="src" alt="Image" style="filter: grayscale(70%)" />

    <label for="content">Content</label>
    <InputText id="content" v-model="content" />
    
    <Button label="Сохранить" class="p-button" @click="save" />
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref, toRefs } from 'vue';
import { ChildService, Child } from '../api/service';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';

export default defineComponent({
  name: 'Action',
  components: {
    InputText,
    Divider,
    Button,
    FileUpload
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
    const src = ref<File | null>(null);
    const selectedFile = ref<File | null>(null);
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
              src.value = item.image || '';
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
      console.log('Выбранный файл:', file);
      
      if (!file) {
        console.error('Файл не выбран!');
        return;
      }
      
      src.value = file;
      selectedFile.value = file;
      const reader = new FileReader();
      const newFile = ref<String>;

      /* reader.onload = (e) => {
        if (e.target && e.target.result) {
          newFile = e.target.result as string; // Для отображения
        }
      }; */

      reader.readAsDataURL(file);
    }

    const save = async () => {
  console.log('Начало сохранения...');

  const jsonData = {
    h1: h1.value,
    title: title.value,
    description: description.value,
    name: name.value,
    content: content.value,
    category: categoryType.value,
    src: src.value
  };

  console.log('Данные для отправки (JSON):', jsonData);

  try {
    const startTime = performance.now();
    let savedId = id.value;

    // Сохраняем JSON данные
    if (id.value && id.value !== 'null') {
      
      await childService.update(id.value, jsonData, 'test/categories');
    } else {
      const response = await childService.create(jsonData, 'test/categories');
      savedId = response.id; // Получение нового ID
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
