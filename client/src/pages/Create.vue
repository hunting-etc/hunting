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
    categoryType: {
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
    const photo = ref<string>("");
    const selectedFile = ref<File | null>(null);

    const editorContainer = ref<HTMLElement | null>(null);
    let editorInstance: any = null;

    const childService = new ChildService();

    async function onFileSelect(event: { files: File[] }) {
  const file = event.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        photo.value = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);

    try {
      const response = await childService.uploadImage(file);
      if (response.url) {
        photo.value = response.url; // Обновляем фото на загруженный URL
        console.log("Изображение загружено:", response.url);
      }
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
    }
  }
}


async function onImageRemove(url: string) {
  try {
    await childService.deleteImage(url);
    photo.value = ""; // Очищаем локальную ссылку на изображение
    console.log("Изображение удалено:", url);
  } catch (error) {
    console.error("Ошибка при удалении изображения:", error);
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

      const jsonData = {
        h1: h1.value,
        title: title.value,
        description: description.value,
        name: name.value,
        editorContent: editorData,
        category: props.categoryType,
        src: selectedFile.value,
      };

      try {
        const response = await childService.create(jsonData, "test/categories");
        console.log("Категория успешно создана с ID:", response.id);
        emit("close"); // Закрытие окна или очистка данных
      } catch (error) {
        console.error("Ошибка при создании категории:", error);
      }
    };

    onMounted(() => {
      initializeEditor();
    });

    return {
      h1,
      title,
      description,
      name,
      content,
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


