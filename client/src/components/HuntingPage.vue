<template>
  <div>
    <h1>Охота</h1>
    <p>Информация о категориях охоты.</p>
    <div class="header-container">
      <Button label="+" class="createButton" @click="openDialog()" />
    </div>
    <DataTable :value="childList" showGridlines tableStyle="min-width: 50rem">
      <Column field="name" header="Название"></Column>
      <Column field="sortOrder" header="Сортировка"></Column>
      <Column header="Действия">
        <template #body="{ data }">
          <Button label="Изменить" @click="loadDataAndOpenDialog(data.id)" />
          <Button label="Удалить" class="deleteButton" @click="deleteItem(data.id)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="dialogVisible" modal header="Изменение категории" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <Action :initialData="selectedItem" :id="selectedItem?.id" @close="handleDialogClose" categoryType="Hunting" />
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { ChildService, Child } from "../api/service";
import { DataTable, Column } from 'primevue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Action from "../pages/Action.vue";
import { FileWatcherEventKind } from "typescript";

export default defineComponent({
  name: "HuntingPage",
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    Action
  },
  setup() {
    const router = useRouter();
    const childList = ref<Child[]>([]);
    const childService = new ChildService();
    const dialogVisible = ref(false);
    const selectedItem = ref<Child | null>(null);

    const fetchData = async () => {
      try {
        // Получение данных по имени категории "Охота"
        childList.value = await childService.getByName('test/categories', 'Hunting');
        childList.value.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    const openDialog = () => {
      selectedItem.value = null; // Очищаем выбранный элемент для создания новой категории
      dialogVisible.value = true; // Открываем диалог
    };

    const loadDataAndOpenDialog = async (id: string) => {
    try {
        const data: Child | Child[] = await childService.getAll('test/categories', { id, category: "Hunting" });
        if (Array.isArray(data)) {
            if (data.length > 0) {
                selectedItem.value = data[0]; // Используем первый элемент массива, если он есть
            } else {
                throw new Error("Нет данных для отображения");
            }
        } else {
            selectedItem.value = data; // Прямое присваивание, если это объект
        }
        dialogVisible.value = true; // Открываем диалог
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
};

const handleDialogClose = () => {
  dialogVisible.value = false;
  fetchData();
};
    const deleteItem = async (id: string) => {
      const confirmDelete = confirm("Вы уверены, что хотите удалить этот элемент?");
      if (confirmDelete) {
        try {
          await childService.delete('test/categories', id, '');
          fetchData();
        } catch (error) {
          console.error("Ошибка при удалении данных:", error);
        }
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      childList,
      openDialog,
      loadDataAndOpenDialog,
      deleteItem,
      dialogVisible,
      selectedItem,
      handleDialogClose
    };
  }
});
</script>

<style>
h1 {
  text-align: center;
}
p {
  font-size: 12px;
  text-align: center;
  top: 50%;
  left: 50%;
}
.DataTable {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

/* Стили для заголовков таблицы */
.DataTable th {
  background-color: #4CAF50; /* Зеленый фон */
  color: white; /* Белый текст */
  padding: 10px; /* Отступы */
  text-align: left; /* Выравнивание текста */
}

/* Стили для ячеек таблицы */
.DataTable td {
  border: 1px solid #dddddd; /* Светло-серая граница */
  padding: 8px; /* Отступы */
}

/* Чередование фона строк для удобства чтения */
.DataTable tr:nth-child(even) {
  background-color: #f2f2f2; /* Светло-серый фон для четных строк */
}

/* Стили для кнопок */
.p-button {
  background-color: #269e2a;
  color: white; /* Белый текст */
  border: none; /* Без границы */
  padding: 5px 10px; /* Отступы */
  cursor: pointer; /* Указатель при наведении */
  border-radius: 4px; /* Закругленные углы */
}

/* Эффект при наведении на кнопку */
.p-button:hover {
  background-color: #166f1a; /* Темнее при наведении */
}
.header-container {
  display: flex;
  justify-content: flex-end; /* Выравнивание содержимого вправо */
  margin-bottom: 10px; /* Отступ между кнопкой и таблицей */
}

.createButton {
  margin-right: -1px; /* Убираем границу между кнопкой и таблицей */
  z-index: 1;
}
.deleteButton {
  background-color: #901010 !important; /* Красный цвет */
  color: white; /* Белый текст */
  left: 10%;
}
.deleteButton:hover {
  background-color: #621313 !important; /* Темнее при наведении */
}
</style>