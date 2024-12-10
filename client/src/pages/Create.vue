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
      <img v-if="photoUrl" :src="photoUrl" alt="Image" />
    </div>
    <FileUpload
      mode="basic"
      @select="onFileSelect"
      customUpload
      auto
      severity="secondary"
      class="p-button-outlined"
    />
    <Divider />

    <div class="content__main">

      <div ref="editorContainer" class="content-editor"></div>
    </div>

    <Button label="Создать категорию" class="p-button" @click="save" />
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
  name: "Create",
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

    async function onFileSelect(event: { files: File[] }) {
  const file = event.files[0];
  if (file) {
    photo.value = file; // Сохраняем объект File
    photoUrl.value = URL.createObjectURL(file); // Создаем URL для отображения
  }
}

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

    const save = async () => {
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
    formData.append("type", JSON.stringify(props.category));
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
      onImageRemove
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
  </style>

