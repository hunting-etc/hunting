<template>
  <div class="panel">
    <label for="h1">H1</label>
    <InputText id="h1" v-model="h1" :class="{ 'input-error': errors.h1 }"  @input="clearError('h1')"/>
    <p v-if="errors.h1" class="error">{{ errors.h1 }}</p>
    <Divider />

    <label for="title">Title</label>
    <InputText id="title" v-model="title" :class="{ 'input-error': errors.title }"  @input="clearError('title')"/>
    <p v-if="errors.title" class="error">{{ errors.title }}</p>
    <Divider />

    <label for="description">Description</label>
    <InputText id="description" v-model="description" :class="{ 'input-error': errors.description }"  @input="clearError('description')"/>
    <p v-if="errors.description" class="error">{{ errors.description }}</p>
    <Divider />

    <label for="name">Название</label>
    <InputText id="name" v-model="name" :class="{ 'input-error': errors.name }" @input="clearError('name')"/>
    <p v-if="errors.name" class="error">{{ errors.name }}</p>
    <Divider />

    <label for="category">Категория</label>
    <div class="card flex justify-center">
        <Select v-model="selectedCategory" :options="categories " optionValue="label"  optionLabel="label" placeholder="Выбрать категорию" class="w-full md:w-56" />
    </div>
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

    <label for="services">Услуги</label>
    <div class="card flex justify-center">
        <MultiSelect v-model="selectedServices" :options="Services" optionValue="label" optionLabel="label" filter placeholder="Выбрать услугу"
            :maxSelectedLabels="3" class="w-full md:w-80" />
    </div>
    <Divider />

    <div class="button-container">
    <Button label="Сохранить" :class="{ 'p-button-error': globalError }" @click="save" ></Button>
    <p v-if="globalError" class="global-error">{{ globalError }}</p>



  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, toRefs, watch, computed } from "vue";
import InputText from "primevue/inputtext";
import Divider from "primevue/divider";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import { InfoService, Category, Info } from "../api/service";
import { initEditor } from "../editor.js/editor-init";
import { Select } from "primevue";
import MultiSelect from 'primevue/multiselect';

export default defineComponent({
  name: "Action",
  components: {
    InputText,
    Divider,
    Button,
    FileUpload,
    Select,
    MultiSelect
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    category: {
      type:  Object as () => Category,
      required: true,
      
    },
    initialData: {
      type: Object as () => Info | null,
      default: null,
      required: true,
    },
    services:{
      type : Array<string>,
      required: true,
      
    },
    maincategory:{
      type:String,
      required:true,
    }
  },
  async setup(props, { emit }) {
    const childList = ref<Info[]>([]);
    const serviceList = ref<Info[]>([]);
    const { id, initialData} = toRefs(props);
    const {category,services,maincategory } = props;
    const h1 = ref(initialData?.value?.h1 || "");
    const title = ref(initialData?.value?.title || "");
    const description = ref(initialData?.value?.description || "");
    const name = ref(initialData?.value?.name || "");
    const content = ref(initialData?.value?.content || "");
    const photo = ref<File | null>(null); // Объект файла
    const childService = new InfoService();
    const editorContainer = ref<HTMLElement | null>(null);
    const photoUrl = ref<string | null>(null);
    const selectedCategory=ref(category.name || "");



    const categories  = computed(() =>
    childList.value.map(item => ({
      label: item.name, // Для отображения имени в Select
      value: item, // Полный объект для привязки
    })));  

    const selectedServices = ref(services.map(service=>service));
    const Services = computed(() =>
    serviceList.value.map(item => ({
      label: item.name, // Для отображения имени в Select
      value: item, // Полный объект для привязки
    })));


const fetchData = async () => {
  try {
    childList.value = await childService.getByName("test/categories", maincategory);
    serviceList.value = await childService.getByName('test/services', 'Services');
    childList.value.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    serviceList.value.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
   
    //бла бла
    
    // Устанавливаем значение по умолчанию после загрузки данных
    if (childList.value.length > 0) {
      // selectedCategory.value = categories.value[0].label || null;
      
    }
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
    });
    const globalError = ref("");
    
    const clearError = (field: keyof typeof errors.value) => {
      errors.value[field] = "";
      globalError.value = ""; // Убираем глобальную ошибку при изменении любого поля
    };

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
        
        if (selectedCategory) {
          
          const selectedCategoryId=childList.value.find(category=> category.name===selectedCategory.value)?.id;
          formData.append("category", JSON.stringify({ id: selectedCategoryId }));
        }
        
        if (selectedServices.value?.length > 0) {
         
          const selectedIds = selectedServices.value.map(selectedService => {
    const match = serviceList.value.find(service => service.name === selectedService);
    return match ? match.id : null; // Возвращаем id или null, если не найдено
}).filter(id => id !== null); // Убираем null из массива
const selectedServicesArray = selectedIds.map((service:any) => ({
    id: service,
  }));

          formData.append("services", JSON.stringify(selectedServicesArray));
        }



  
        if (photo.value) {
          formData.append("photo", photo.value); // Добавляем файл
        }

        // Обновление данных через API
        await childService.update(id.value, formData, "test/infopages");
        console.log("Данные успешно обновлены");
        emit("close");
      } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
      }
    };

    onMounted(() => {
      fetchData();
      
      

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
      globalError,
      clearError,
      selectedCategory,
      categories,
      selectedServices,
      Services,
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