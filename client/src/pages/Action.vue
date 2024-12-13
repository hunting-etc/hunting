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

    <Button label="Сохранить" class="p-button" @click="save" ></Button>
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
  name: "Action",
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
    let editorInstance: any = null;
    const photoUrl = ref<string | null>(null);

    

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
        photo.value = file;
        photoUrl.value = URL.createObjectURL(file);
      }
    };

    const save = async () => {
      
      try {        
        // Сохранение содержимого редактора
        const editorData = editorInstance
          ? await editorInstance.save().then((data: any) => JSON.stringify(data))
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
        content.value=""; //очищение строки контента
        console.log(content, "content")
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
      editorInstance
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