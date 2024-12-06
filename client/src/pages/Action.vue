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
    <div class="image-preview">
      <img v-if="photo" :src="photo" alt="Image" />
    </div>
    <FileUpload
      mode="basic"
      @select="onFileSelect"
      customUpload
      auto
      severity="secondary"
      class="p-button-outlined"
    />

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
    const photo=ref<string>("")

    onMounted(async () => {
        
          const item: Child = await childService.getById('test/categories', id.value!);
          console.log(item);
            if (item) {
              h1.value = item.h1 || '';
              title.value = item.title || '';
              description.value = item.description || '';
              name.value = item.name || '';
              content.value = item.content || '';
              photo.value = `${childService.baseUrl}/${item.photo}` || '';
            } else {
              console.log('Элемент с таким ID не найден');
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
      
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          
          photo.value = e.target.result as string; // Для отображения
          
        }
      };
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
      save,
      photo
    };
  }
});
</script>


<style>
.p-panel-header {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
  padding: 10px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

input.p-inputtext {
  width: 97%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 15px;
  transition: border 0.3s;
}

input.p-inputtext:focus {
  border-color: #4CAF50;
  outline: none;
}

.p-button {
  background-color: #269e2a;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 20px;
}

.p-button:hover {
  background-color: #166f1a;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.image-preview {
  margin-top: 10px;
  margin-bottom: 15px;
}

.image-preview img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
