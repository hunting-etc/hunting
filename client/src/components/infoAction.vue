<template>
    <div class="panel">
      <label for="h1">H1</label>
      <InputText id="h1" v-model="h1" :class="{ 'input-error': errors.h1 }"/>
      <p v-if="errors.h1" class="error">{{ errors.h1 }}</p>
      <Divider />
  
      <label for="title">Title</label>
      <InputText id="title" v-model="title" :class="{ 'input-error': errors.title }"/>
      <p v-if="errors.title" class="error">{{ errors.title }}</p>
      <Divider />
  
      <label for="description">Description</label>
      <InputText id="description" v-model="description" :class="{ 'input-error': errors.description }"/>
      <p v-if="errors.description" class="error">{{ errors.description }}</p>
      <Divider />
  
      <label for="name">Название</label>
      <InputText id="name" v-model="name" :class="{ 'input-error': errors.name }"/>
      <p v-if="errors.name" class="error">{{ errors.name }}</p>
      <Divider />
  
      <label for="image">Фото</label>
      <div class="image-preview">
        <img v-if="photoUrl" :src="photoUrl" alt="Image" />
      </div>
      <FileUpload
        mode="basic"
        @select="onFileSelect"
        customUpload
        auto
        :maxFileSize="5242880"
        accept="image/*"
        severity="secondary"
        class="p-button-outlined"
        :class="{ 'input-error': errors.image }"
      />
      <p v-if="errors.image" class="error">{{ errors.image }}</p>
      <Divider />
  
      <div class="content__main">
        <div ref="editorContainer" class="content-editor"></div>
      </div>

      <label for="services">Услуги</label>
  
      <div class="button-container">
      <Button label="Сохранить" :class="{ 'p-button-error': globalError }" @click="save" ></Button>
  
    </div>
  </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, toRefs, watch } from "vue";
  import InputText from "primevue/inputtext";
  import Divider from "primevue/divider";
  import Button from "primevue/button";
  import FileUpload from "primevue/fileupload";
  import { ChildService, Child } from "../api/service";
  import { initEditor } from "../editor.js/editor-init";
  
  export default defineComponent({
    name: "infoAction",
    components: {
      InputText,
      Divider,
      Button,
      FileUpload,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      initialData: {
        type: Object as () => Child | null,
        default: null,
        required: true,
      },
    },
    async setup(props, { emit }) {
      const { id, initialData} = toRefs(props);
     
      const {category } = props;
      const h1 = ref(initialData?.value?.h1 || "");
      const title = ref(initialData?.value?.title || "");
      const description = ref(initialData?.value?.description || "");
      const name = ref(initialData?.value?.name || "");
      const content = ref(initialData?.value?.content || "");
      const photo = ref<File | null>(null); // Объект файла
      const childService = new ChildService();
      const editorContainer = ref<HTMLElement | null>(null);
      const photoUrl = ref<string | null>(null);
  
      const errors = ref({
        h1: '',
        title: '',
        description: '',
        name: '',
        image: '',
      });
      const globalError = ref("");
      
  
      if (initialData?.value?.photo && (initialData.value.photo as any) instanceof File) {
    photoUrl.value = URL.createObjectURL(initialData.value.photo as File);
  } else if (typeof initialData?.value?.photo === "string") {
    photoUrl.value =`${childService.baseUrl}${initialData.value.photo}` ; // Если это уже строка URL
  }
  
  
  watch(photo, (newFile: File | null, oldFile: File | null) => {
    // Если был старый файл и есть URL, освобождаем его
    if (oldFile && photoUrl.value) {
      URL.revokeObjectURL(photoUrl.value);
    }
    // Если есть новый файл, создаём новый URL
    if (newFile) {
      photoUrl.value = URL.createObjectURL(newFile);
    } else {
      photoUrl.value = null; // Сбрасываем URL, если файла нет
    }
  });
  
  const initializeEditor = () => {//ВТОРУЮ ЧАСТЬ МЕТОДА ПЕРЕПИСЫВАЛ GPT НО ОН БЫЛ ВЗЯТ У ЯРИКА
    if (!editorContainer.value) {
      console.error("Editor container is not defined.");
      return;
    }
  
    window.editorInstance = initEditor(editorContainer.value, {
    });
    
    // Загрузка данных в редактор ВТОРАЯ ЧАСТЬ, ЭТОТ БЛОК МБ ДОЛЖЕН НАХОДИТЬСЯ НЕ ЗДЕСЬ Я ХЗ
  };
  
  const onFileSelect = (event: { files: File[] }) => {
    const file = event.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        errors.value.image = 'Загрузите изображение в формате PNG, JPEG или GIF.';
        return;
      }
      if (file.size > 5242880) {
        errors.value.image = 'Изображение должно весить не более 5 МБ.';
        return;
      }
      photo.value = file;
      photoUrl.value = URL.createObjectURL(file);
      errors.value.image = ''; // Очистка ошибок
    }
  };
  
      const validateAll = (): boolean => {
        errors.value.h1 =
          h1.value.length >= 10 && h1.value.length <= 60
            ? ''
            : 'H1 должно быть от 10 до 60 символов';
        errors.value.title =
          title.value.length >= 30 && title.value.length <= 80
            ? ''
            : 'Title должно быть от 30 до 80 символов';
        errors.value.description =
          description.value.length >= 80 && description.value.length <= 160
            ? ''
            : 'Description должно быть от 80 до 160 символов';
        errors.value.name = name.value.length > 0 && name.value.length <= 200 ? '' : 'Name обязателен и не должен превышать 200 символов';
  
        return Object.values(errors.value).every((error) => !error);
      };
  
      const save = async () => {
        if (!validateAll()) {
      globalError.value = "Введены некорректные данные.";
      return;
    }
    globalError.value = ""; // Сбрасываем ошибку при успешной валидации
        try {        
          // Сохранение содержимого редактора
          const editorData = window.editorInstance
            ? await window.editorInstance.save().then((data: any) => JSON.stringify(data))
            : "";
        
          // Подготовка данных для обновления
          const formData = new FormData();
          formData.append("h1", h1.value);
          formData.append("title", title.value || "");
          formData.append("description", description.value || "");
          formData.append("name", name.value || "");
          formData.append("content", editorData);
          
          if ( category ) {
            formData.append("category", JSON.stringify({ category: category }));
          }
  
          if (photo.value) {
            formData.append("photo", photo.value); // Добавляем файл
          }
  
          // Обновление данных через API
          await childService.update(id.value, formData, "test/categories");
          console.log("Данные успешно обновлены");
          emit("close");
        } catch (error) {
          console.error("Ошибка при сохранении данных:", error);
        }
      };
  
      onMounted(() => {
        
      initializeEditor();
  
      setTimeout(() => {
    try {
      if (window.editorInstance) {
        // Рендерим данные в редактор
        window.editorInstance.render(content.value)
      } else {
        console.error("Editor instance is not initialized");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }, 100);})
  
      return {
        h1,
        title,
        description,
        name,
        photo,
        photoUrl,
        editorContainer,
        onFileSelect,
        save,
        childService,
        validateAll,
        errors,
        globalError
      };
    },
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
  .error {
    color: red;
    font-size: 14px;
  }
  
  .input-error {
    border-color: red;
  }
  .p-button {
    background-color: #269e2a;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 10px;
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
  .p-button-error {
    background-color: red !important;
    color: white !important;
  }
  </style>