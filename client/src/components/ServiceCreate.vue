<template>
    <div class="panel">
      <label for="h1">H1</label>
      <InputText id="h1" v-model="h1" :class="{ 'input-error': errors.h1 }" @input="clearError('h1')"/>
      <p v-if="errors.h1" class="error">{{ errors.h1 }}</p>
      <Divider />
  
      <label for="title">Title</label>
      <InputText id="title" v-model="title" :class="{ 'input-error': errors.title }" @input="clearError('title')"/>
      <p v-if="errors.title" class="error">{{ errors.title }}</p>
      <Divider />
  
      <label for="description">Description</label> 
      <InputText id="description" v-model="description" :class="{ 'input-error': errors.description }" @input="clearError('description')"/>
      <p v-if="errors.description" class="error">{{ errors.description }}</p>
      <Divider />
  
      <label for="name">Название</label>
      <InputText id="name" v-model="name" :class="{ 'input-error': errors.name }" @input="clearError('name')"/>
      <p v-if="errors.name" class="error">{{ errors.name }}</p>
      <Divider />
  
      <label for="category">Категория</label>
      <div class="card flex justify-center">
          <Select v-model="selectedCategory" :options="categories " optionLabel="label" placeholder="Выбрать категорию" class="w-full md:w-56"  @change="clearError('category')"/>
      </div>
      <p v-if="errors.category" class="error">{{ errors.category }}</p>
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
      <Divider />
  
      <label for="price">Цена</label>
      <div class="card flex justify-center">
          <InputText id="price" v-model="price"/>
      </div>
      <Divider />
  
      <Button label="Сохранить" class="p-button" @click="save" ></Button>
      <p v-if="globalError" class="global-error">{{ globalError }}</p>
  
      
  
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted, computed  } from "vue";
  import InputText from "primevue/inputtext";
  import Divider from "primevue/divider";
  import Button from "primevue/button";
  import FileUpload from "primevue/fileupload";
  import { InfoService, Info } from "../api/service";
  import { initEditor } from "../editor.js/editor-init";
  import Select from 'primevue/select';
  
  import MultiSelect from 'primevue/multiselect';
  
  
  export default defineComponent({
    name: "infoCreate",
    components: {
      InputText,
      Divider,
      Button,
      FileUpload,
      Select,
      MultiSelect
    },
    props: {
      category: {
        type: String,
        required: true,
      },
    },
  
    setup(props, { emit }) {
      const categoryList = ref<Info[]>([]);
      // const serviceList = ref<Info[]>([]);
      const h1 = ref("");
      const title = ref("");
      const description = ref("");
      const name = ref("");
      const content = ref("");
      const price = ref("");
      const src = ref<File | null>(null);
      const photo = ref<File | null>(null); // Для файла
      const photoUrl = ref<string | null>(null); // Для привязки к src
      const editorContainer = ref<HTMLElement | null>(null);
      const {category}=props
      const childService = new InfoService();
  
  
      const selectedCategory = ref();
      const categories  = computed(() =>
      categoryList.value.map(item => ({
        label: item.name, // Для отображения имени в Select
        value: item, // Полный объект для привязки
      })));
  
      const fetchData = async () => {
          try {
            
            categoryList.value = await childService.getByName('test/categories', category);
            
            categoryList.value.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
          } catch (error) {
            console.error("Ошибка при получении данных:", error);
          }
        };
  
  
  
      const errors = ref({
        h1: '',
        title: '',
        description: '',
        name: '',
        image: '',
        category: '',
      });
      const globalError = ref("");
  
      const clearError = (field: keyof typeof errors.value) => {
        errors.value[field] = "";
        globalError.value = ""; // Убираем глобальную ошибку при изменении любого поля
      };
  
      const onFileSelect = (event: { files: File[] }) => {
    const file = event.files[0];
  
    if (file) {
      // Проверяем формат изображения
      if (!file.type.startsWith('image/')) {
        errors.value.image = 'Загрузите изображение в формате PNG, JPEG или GIF.';
        photo.value = null; // Сбрасываем файл
        photoUrl.value = null;
        return;
      }
      // Проверяем размер файла
      if (file.size > 5242880) {
        errors.value.image = 'Изображение должно весить не более 5 МБ.';
        photo.value = null; // Сбрасываем файл
        photoUrl.value = null;
        return;
      }
      // Устанавливаем файл и сбрасываем ошибки
      photo.value = file;
      photoUrl.value = URL.createObjectURL(file);
      errors.value.image = ''; // Сбрасываем ошибку, если файл корректный
    } else {
      // Если файл не выбран, устанавливаем ошибку
      errors.value.image = 'Фото обязательно для загрузки';
      photo.value = null;
      photoUrl.value = null;
    }
  };
  
  async function onImageRemove() {
    if (photoUrl.value) {
      URL.revokeObjectURL(photoUrl.value); // Удаляем объект URL
      photoUrl.value = null; // Очищаем строку для отображения
      photo.value = null; // Удаляем объект File
    }
  }
  
  
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
        errors.value.image = photoUrl.value ? '' : 'Фото обязательно для загрузки';
        errors.value.category = selectedCategory.value ? '' : 'Категория обязательна для выбора';
  
        return Object.values(errors.value).every((error) => !error);
      };
  
      const save = async () => {
        if (!validateAll()) {
      globalError.value = "Введены некорректные данные";
      return;
    }
    globalError.value = ""; // Сбрасываем ошибку при успешной валидации
    if (window.processPendingDeletions) {
          await window.processPendingDeletions('delete');
        }
    const editorData = window.editorInstance
      ? await window.editorInstance.save().then((data: any) => JSON.stringify(data))
      : "";
  
    const formData = new FormData();
    formData.append("h1", h1.value);
    formData.append("title", title.value || "");
    formData.append("description", description.value || "");
    formData.append("name", name.value || "");
    formData.append("price", price.value || "")
    formData.append("content", editorData);
    
    if (selectedCategory) {
      formData.append("category", JSON.stringify({ id: selectedCategory.value?.value?.id }));
    }    
  
    if (photo.value) {
      formData.append("photo", photo.value); // Добавляем файл
    }
  
    try {
      const response = await childService.create(formData, "test/infopages");
      console.log("Категория успешно создана с ID:", response.id);
      emit("close");
    } catch (error) {
      console.error("Ошибка при создании категории:", error);
    }
  };
  
  
      onMounted(() => {
        fetchData();
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
        globalError,
        clearError,
        selectedCategory,
        categories,
        price
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
  </style>
  