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

    <Button label="Сохранить" class="p-button" @click="save" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, toRefs } from "vue";
import InputText from "primevue/inputtext";
import Divider from "primevue/divider";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import { ChildService, Child } from "../api/service";
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
    id: {
      type: String,
      required: true,
    },
    categoryType: {
      type: String,
      required: true,
    },
    initialChildData: {
      type: Object as () => Child | null,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { id, initialChildData, categoryType } = toRefs(props);

    // Объявление переменных для формы
    const h1 = ref(initialChildData?.value?.h1 || "");
    const title = ref(initialChildData?.value?.title || "");
    const description = ref(initialChildData?.value?.description || "");
    const name = ref(initialChildData?.value?.name || "");
    const photo = ref<string>(initialChildData?.value?.photo || "");
    const selectedFile = ref<File | null>(null);
    const editorContainer = ref<HTMLElement | null>(null);
    let editorInstance: any = null;

    const childService = new ChildService();

    // Инициализация редактора
    const initializeEditor = () => {
      if (editorContainer.value) {
        editorInstance = initEditor(editorContainer.value, {
          data: initialChildData?.value?.content
            ? JSON.parse(initialChildData.value.content)
            : undefined,
        });
      }
    };

    // Обработчик выбора файла
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
      }
    }

    // Метод сохранения данных
    const save = async () => {
      try {
        // Сохранение содержимого редактора
        const editorData = editorInstance
          ? await editorInstance.save().then((data: any) => JSON.stringify(data))
          : "";

        // Подготовка данных для обновления
        const jsonData = {
          h1: h1.value,
          title: title.value,
          description: description.value,
          name: name.value,
          content: editorData,
          category: categoryType.value,
          photo: photo.value, // Используем выбранный файл или уже существующее фото
        };

        // Обновление данных через API
        await childService.update(id.value, jsonData, 'test/categories');
        console.log("Данные успешно обновлены");
        emit("close");
      } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
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
      photo,
      selectedFile,
      editorContainer,
      onFileSelect,
      save,
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
</style>