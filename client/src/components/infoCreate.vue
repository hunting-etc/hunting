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


      <Button label="Сохранить" class="p-button" @click="save" ></Button>
      <p v-if="globalError" class="global-error">{{ globalError }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import InputText from "primevue/inputtext";
  import Divider from "primevue/divider";
  import Button from "primevue/button";
  import FileUpload from "primevue/fileupload";
  import { ChildService } from "../api/service";
  import { initEditor } from "../editor.js/editor-init";
  
  export default defineComponent({
    name: "infoCreate",
    components: {
      InputText,
      Divider,
      Button,
      FileUpload,
    },
    props: {
      category: {
        type: String,
        required: true,
      },
    },
    setup(props, { emit }) {
      const h1 = ref("");
      const title = ref("");
      const description = ref("");
      const name = ref("");
      const content = ref("");
      const src = ref<File | null>(null);
      const photo = ref<File | null>(null); // Для файла
      const photoUrl = ref<string | null>(null); // Для привязки к src
      const editorContainer = ref<HTMLElement | null>(null);
      let editorInstance: any = null;
      const childService = new ChildService();
  
      const errors = ref({
        h1: '',
        title: '',
        description: '',
        name: '',
        image: '',
      });
      const globalError = ref("");
  
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
  
  async function onImageRemove() {
    if (photoUrl.value) {
      URL.revokeObjectURL(photoUrl.value); // Удаляем объект URL
      photoUrl.value = null; // Очищаем строку для отображения
      photo.value = null; // Удаляем объект File
    }
  }
  
  
      const initializeEditor = () => {
        if (editorContainer.value) {
          editorInstance = initEditor(editorContainer.value, {
            onImageAdd: async (file: File) => {
              try {
                const response = await childService.uploadImage(file);
                if (response.url) {
                  editorInstance.insertImage(response.url);
                }
              } catch (error) {
                console.error("Ошибка при загрузке изображения:", error);
              }
            },
            onImageRemove: async (url: string) => {
              try {
                await childService.deleteImage(url);
              } catch (error) {
                console.error("Ошибка при удалении изображения:", error);
              }
            },
          });
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
      globalError.value = "Введены некорректные данные";
      console.error("Валидация не пройдена");
      return;
    }
    globalError.value = ""; // Сбрасываем ошибку при успешной валидации
  
    const editorData = editorInstance
      ? await editorInstance.save().then((data: any) => JSON.stringify(data))
      : "";
  
    const formData = new FormData();
    formData.append("h1", h1.value);
    formData.append("title", title.value || "");
    formData.append("description", description.value || "");
    formData.append("name", name.value || "");
    formData.append("content", editorData);
    if (props.category) {
      formData.append("type", JSON.stringify({ category: props.category }));
    }
  
  
    if (photo.value) {
      formData.append("photo", photo.value); // Добавляем файл
    }
  
    try {
      const response = await childService.create(formData, "/test/categories");
      console.log("Категория успешно создана с ID:", response.id);
      emit("close");
    } catch (error) {
      console.error("Ошибка при создании категории:", error);
    }
  };
  
  
      onMounted(() => {
        initializeEditor();
        if (photoUrl.value) {
      URL.revokeObjectURL(photoUrl.value);
    }
      });
  
      return {
        h1,
        title,
        description,
        name,
        content,
        photoUrl,
        src,
        onFileSelect,
        save,
        photo,
        editorContainer,
        onImageRemove,
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
    .error {
    color: red;
    font-size: 14px;
  }
  
  .input-error {
    border-color: red;
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
    .content__main {
    margin-top: 20px;
  }
  
  .header__input,
  .summary_input {
    width: 100%;
  }
  
  .image-upload {
    margin-top: 10px;
  }
  
  .content-editor {
    margin-top: 20px;
    min-height: 300px;
    border: 1px solid #ccc;
    padding: 10px;
  }
  .button-container {
    display: flex;
    align-items: center; /* Центрирование по вертикали */
    margin-top: 20px; /* Отступ сверху */
  }
  
  .global-error {
    color: red;
    font-size: 14px;
    margin-left: 10px; /* Отступ слева от сообщения об ошибке */
  }
    </style>
  
  