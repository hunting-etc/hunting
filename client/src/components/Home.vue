<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import { SpeedDial } from "primevue";

const router = useRouter();

// Опции для направлений
const dropdownData = [
  {
    label: "Охота",
    key: "hunting",
    options: [
      { label: "Охота/Категории", path: "/home/hunting" },
      { label: "Охота/Информационные страницы", path: "/home/infopage/infoHunting" },
    ],
  },
  {
    label: "Рыбалка",
    key: "fishing",
    options: [
      { label: "Рыбалка/Категории", path: "/home/fishing" },
      { label: "Рыбалка/Информационные страницы", path: "/home/infopage/infoFishing" },
    ],
  },
  {
    label: "Активный отдых",
    key: "activeRecreation",
    options: [
      { label: "Активный отдых/Категории", path: "/home/activeRecreation" },
      { label: "Активный отдых/Информационные страницы", path: "/home/infopage/infoActiveRecreation" },
    ],
  },
  {
    label: "Экотуризм",
    key: "fishing",
    options: [
      { label: "Экотуризм/Категории", path: "/home/ecotourism" },
      { label: "Экотуризм/Информационные страницы", path: "/home/infopage/infoEcotourism" },
    ],
  },
  {
    label: "Услуги",
    key: "services",
    options: [
      { label: "Услуги/Категории", path: "/home/services" },
      { label: "Услуги/Информационные страницы", path: "/home/infopage/infoServices" },
    ],
  },
  {
    label: "Новости",
    key: "news",
    options: [
      { label: "Новости/Категории", path: "/home/news" },
      { label: "Новости/Информационные страницы", path: "/home/infopage/infoNews" },
    ],
  }
];

const items2 = ref([
  { label: 'Добавить админа', command: () => router.push({ name: 'RegisterAdmin' }) , icon: 'pi pi-user-plus' },
  { label: 'Теги', icon: 'pi pi-hashtag'}
]);

const selectedValues = ref<{ [key: string]: any }>({});

dropdownData.forEach((dropdown) => {
  selectedValues.value[dropdown.key] = null;
});

const resetOtherDropdowns = (currentKey: string) => {
  for (const key in selectedValues.value) {
    if (key !== currentKey) {
      selectedValues.value[key] = null;
    }
  }
};

const handleSelection = (dropdownKey: string, selectedOption: any) => {
  selectedValues.value[dropdownKey] = selectedOption;
  resetOtherDropdowns(dropdownKey);
  if (selectedOption?.path) {
    router.push(selectedOption.path).catch((err) => {
      console.error("Navigation Error:", err);
    });
  }
};
</script>

<template>
  <div class="main__menu">
    <div class="container">
      <!-- Левая панель -->
      <div class="sidebar">
        <h1 class="welcome__text">Admin panel</h1>

        <!-- Генерация выпадающих списков -->
        <div v-for="dropdown in dropdownData" :key="dropdown.key" class="menu-block">
  <Dropdown 
    v-model="selectedValues[dropdown.key]" 
    :options="dropdown.options" 
    optionLabel="label" 
    :placeholder="dropdown.label" 
    @change="(e) => handleSelection(dropdown.key, e.value)" 
    class="dropdown" 
  />
</div>


        <!-- Пример дополнительной кнопки -->
        <RouterLink to="/about">
          <Button label="О компании" class="p-button-success" />
        </RouterLink>
      </div>
      <div class="card">
          <div>
            <SpeedDial :model="items2" direction="up" style="position: absolute; left: calc(2%); bottom: 3%;" />
          </div>
        </div>
    
      <!-- Правая панель -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome__text {
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  color: green;
  margin: 0px;
  padding: 15px;
  text-align: center;
}

/* Основной контейнер */
.container {
  display: flex;
  margin: 0;
  padding: 0;
  background-color: rgb(199, 187, 166);
  height: 100vh; /* Высота 100% экрана */
}

/* Левая панель */
.sidebar {
  width: 20%; /* Занимает 30% ширины */
  background-color: #f4f4f4; /* Светлый фон */
  padding: 20px;
  display: flex;
  flex-direction: column; /* Кнопки располагаются вертикально */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  align-items: stretch;
  gap: 10px;
}

.p-button-success {
  background-color: #1cb836; /* Зеленый цвет кнопки */
  color: black; /* Цвет текста */
  width: 100%; /* На весь контейнер */
  border: none; /* Убираем границу */
  transition: background-color 0.3s; /* Плавный переход */
}

.p-button-success:hover {
  background-color:  #199c2f; /* Темнее при наведении */
}

.p-button-success:active {
  background-color: #137824; /* Еще темнее при нажатии */
}

/* Стили для Dropdown */
.dropdown {
  background-color: #1cb836; /* Зеленый цвет */
  color: black; /* Цвет текста */
  width: 100%; /* На весь контейнер */
  border: none; /* Убираем границу */
  transition: background-color 0.3s; /* Плавный переход */
}

.dropdown:hover {
  background-color: #199c2f; /* Темнее при наведении */
}

.dropdown:active {
  background-color: #137824; /* Еще темнее при нажатии */
}

/* Правая область */
.content {
  width: 80%; /* Занимает 70% ширины */
  padding: 20px;
  overflow-y: auto; /* Скроллинг, если контент слишком длинный */
  background-color: #fff;
}
.pi {
    color: black !important;
  }
</style>