<template>
  <div> 
    <h1>О компании</h1>
    <p>Информация о компании.</p>
  </div>
  <div class="panel">
    <label for="h1">H1</label>
    <InputText id="h1" v-model="h1" :class="{ 'input-error': errors.h1 }" @input="clearError('h1')" />
    <p v-if="errors.h1" class="error">{{ errors.h1 }}</p>
    <Divider />

    <label for="title">Title</label>
    <InputText id="title" v-model="title" :class="{ 'input-error': errors.title }" @input="clearError('title')" />
    <p v-if="errors.title" class="error">{{ errors.title }}</p>
    <Divider />

    <label for="description">Description</label>
    <InputText id="description" v-model="description" :class="{ 'input-error': errors.description }" @input="clearError('description')" />
    <p v-if="errors.description" class="error">{{ errors.description }}</p>
    <Divider />

    <label for="name">Название</label>
    <InputText id="name" v-model="name" :class="{ 'input-error': errors.name }" @input="clearError('name')" />
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
      :class="{ 'input-error': errors.image }"
    />
    <p v-if="errors.image" class="error">{{ errors.image }}</p>
    <Divider />

    <div class="content__main">
      <div ref="editorContainer" class="content-editor"></div>
    </div>

    <div class="button-container">
      <Button label="Сохранить" :class="{ 'p-button-error': globalError }" @click="save" />
      <p v-if="saveSuccess" class="success-message">Данные успешно сохранены!</p>
      <p v-if="globalError" class="global-error">{{ globalError }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, toRefs } from "vue";
import { useRouter } from "vue-router"; 
import InputText from "primevue/inputtext";
import Divider from "primevue/divider";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import { ChildService } from "../api/service";
import { initEditor } from "../editor.js/editor-init";

export default defineComponent({
  name: "About",
  components: {
    InputText,
    Divider,
    Button,
    FileUpload,
  },
  setup() {
    const router = useRouter();
    const id = ref("");
    const h1 = ref("");
    const title = ref("");
    const description = ref("");
    const name = ref("");
    const content = ref("");
    const photo = ref<File | null>(null);
    const photoUrl = ref<string | null>(null);
    const errors = ref({ h1: '', title: '', description: '', name: '', image: '' });
    const globalError = ref("");
    const childService = new ChildService();
    const editorContainer = ref<HTMLElement | null>(null);
    const isDataExisting = ref(false);
    const saveSuccess = ref(false);

    const clearError = (field: keyof typeof errors.value) => {
      errors.value[field] = "";
      globalError.value = "";
    };

    const fetchData = async () => {
      try {
        const data = await childService.getByName("test/categories", "About");
        if (data.length > 0) {
          const item = data[0]; // Assuming you want the first item
          id.value = item.id || "";
          h1.value = item.h1 || "";
          title.value = item.title || "";
          description.value = item.description || "";
          name.value = item.name || "";
          content.value = item.content || ""; // Set content here
          if (item.photo) {
            photoUrl.value = `${childService.baseUrl}${item.photo}`;
          }
          isDataExisting.value = true; // Data exists
        } else {
          resetFields();
          isDataExisting.value = false; // No data found
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const resetFields = () => {
      h1.value = "";
      title.value = "";
      description.value = "";
      name.value = "";
      content.value = "";
      photoUrl.value = null;
    };

    const initializeEditor = () => {//ВТОРУЮ ЧАСТЬ МЕТОДА ПЕРЕПИСЫВАЛ GPT НО ОН БЫЛ ВЗЯТ У ЯРИКА
  if (!editorContainer.value) {
    console.error("Editor container is not defined.");
    return;
  }
  
  const { editorInstance, processPendingDeletions } = initEditor(
    editorContainer.value,
    content.value
  );

  // Сохраняем ссылки на экземпляр редактора и метод обработки удалений в глобальной области
  window.editorInstance = editorInstance;
  window.processPendingDeletions = processPendingDeletions;
  // Загрузка данных в редактор ВТОРАЯ ЧАСТЬ, ЭТОТ БЛОК МБ ДОЛЖЕН НАХОДИТЬСЯ НЕ ЗДЕСЬ Я ХЗ
};

    const save = async () => {
      if (!validateAll()) {
        globalError.value = "Введены некорректные данные.";
        return;
      }
      globalError.value = ""; // Reset error on successful validation


      if (window.processPendingDeletions) {
          await window.processPendingDeletions('delete');
        }
      try {
        const editorData = window.editorInstance ? await window.editorInstance.save().then((data: any) => JSON.stringify(data)) : "";

        const formData = new FormData();
        formData.append("h1", h1.value);
        formData.append("title", title.value || "");
        formData.append("description", description.value || "");
        formData.append("name", name.value || "");
        formData.append("content", editorData);

        formData.append("type", JSON.stringify({ category: "About" }));

        if (photo.value) {
          formData.append("photo", photo.value);
        }

        // Log FormData contents
        for (const [key, value] of formData.entries()) {
          console.log(key, value);
        }

        if (isDataExisting.value) {
          await childService.update(id.value, formData, "test/categories");
          console.log("Данные успешно обновлены");
          saveSuccess.value = true;
        } else {
          await childService.create(formData, "test/categories");
          console.log("Данные успешно созданы");
          saveSuccess.value = true;
        }
      } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
      }
    };

    const validateAll = (): boolean => {
      errors.value.h1 = h1.value.length >= 10 && h1.value.length <= 60 ? '' : 'H1 должно быть от 10 до 60 символов';
      errors.value.title = title.value.length >= 30 && title.value.length <= 80 ? '' : 'Title должно быть от 30 до 80 символов';
      errors.value.description = description.value.length >= 80 && description.value.length <= 160 ? '' : 'Description должно быть от 80 до 160 символов';
      errors.value.name = name.value.length > 0 && name.value.length <= 200 ? '' : 'Name обязателен и не должен превышать 200 символов';
      errors.value.image = photoUrl.value ? '' : 'Фото обязательно для загрузки';

      return Object.values(errors.value).every((error) => !error);
    };

    const onFileSelect = (event: { files: File[] }) => {
      const file = event.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          errors.value.image = 'Загрузите изображение в формате PNG, JPEG или GIF.';
          photo.value = null;
          photoUrl.value = null;
          return;
        }
        if (file.size > 5242880) {
          errors.value.image = 'Изображение должно весить не более 5 МБ.';
          photo.value = null;
          photoUrl.value = null;
          return;
        }
        photo.value = file;
        photoUrl.value = URL.createObjectURL(file);
        errors.value.image = '';
      } else {
        errors.value.image = 'Фото обязательно для загрузки';
        photo.value = null;
        photoUrl.value = null;
      }
    };

    onMounted(async () => {
      await fetchData(); // Fetch data first
      initializeEditor(); // Then initialize the editor

      router.beforeEach((to, from, next) => {
        if (from.name === 'About' && to.name !== 'About') {
          window.processPendingDeletions('fulldelite'); // Вызов метода перед переходом
        }
        next(); // Продолжить к следующему маршруту
      })
    });

    return {
      h1,
      title,
      description,
      name,
      photo,
      photoUrl,
      editorContainer,
      save,
      errors,
      globalError,
      clearError,
      onFileSelect,
      isDataExisting,
      saveSuccess
    };
  },
});
</script>

<style scoped>
  /* Общий стиль для панели */
.panel {
  max-width: 800px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* Заголовки */
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

/* Поля ввода */
input.p-inputtext {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: #fff;
}

input.p-inputtext:focus {
  border-color: #4caf50;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.6);
  outline: none;
}

/* Поля с ошибкой */
.input-error {
  border-color: #e53935 !important;
  background-color: #ffe6e6;
}

/* Разделители */
.p-divider {
  margin: 20px 0;
  border: none;
  height: 1px;
  background-color: #ddd;
}

/* Превью изображений */
.image-preview {
  margin: 20px 0;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Кнопки */
.p-button {
  display: block;
  width: 100%;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.p-button:hover {
  background-color: #45a049;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
/* Ошибки под полями */
.error {
  color: #e53935;
  font-size: 12px !important; /* Принудительное применение размера */
  margin-top: 4px;
}

/* Ошибки на глобальном уровне */
.global-error {
  color: #e53935;
  font-size: 14px !important; /* Принудительное применение размера */
  font-weight: bold;
  margin-top: 8px;
  text-align: center;
}

/* Кнопка ошибки */
.p-button-error {
  background-color: #e53935 !important;
  color: white !important;
}

.p-button-error:hover {
  background-color: #d32f2f !important;
}

/* Контейнер редактора */
.content-editor {
  min-height: 300px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Контейнер для кнопок */
.button-container {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .panel {
    padding: 15px;
  }

  .p-button {
    font-size: 14px;
    padding: 10px;
  }

  input.p-inputtext {
    font-size: 13px;
    padding: 8px;
  }
}
.success-message {
  color: green;
  margin-top: 8px;
}
  </style>