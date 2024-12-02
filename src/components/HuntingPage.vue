<template>
  <div>
    <h1>Охота</h1>
    <p>Информация о категориях охоты.</p>
    <div class="header-container">
      <Button label="+" class="createButton" @click="goToAction()"/>
    </div>
    <DataTable :value="childList" showGridlines tableStyle="min-width: 50rem">
      <Column field="title" header="Название"></Column>
      <Column field="sortOrder" header="Сортировка"></Column>
      <Column header="Изменить">
        <template #body="{ data }">
          <Button label="Изменить" @click="goToAction(data)" />
          <Button label="Удалить" class="deleteButton" @click="deleteItem(data.id)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { ChildService, Child } from "../api/service";
import { DataTable, Column } from 'primevue';
import Button from 'primevue/button';

export default defineComponent({
  name: "HuntingPage",
  components: {
    DataTable,
    Column,
    Button
  },
  setup() {
    const router = useRouter();
    const childList = ref<Child[]>([]);
    const childService = new ChildService();

    const fetchData = async () => {
      try {
        childList.value = await childService.getAll('/test/categories');
        // Сортируем массив по полю sortOrder
        childList.value.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    const goToAction = (data?: Child) => {
      if (data) {
        router.push({ name: 'Action', query: { id: data.id } });
      } else {
        router.push({ name: 'Action', query: { id: null } });
      }
    };

    const deleteItem = async (id: string) => {
      const confirmDelete = confirm("Вы уверены, что хотите удалить этот элемент?");
      if (confirmDelete) {
        try {
          await childService.delete('/test/categories', id, 'admin');
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
      goToAction,
      deleteItem 
    };
  }
});
</script>

<style>
h1{
  text-align: center;
}
p{
  font-size: 12px;
  text-align: center;
  top:50%;
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
.deleteButton{
  background-color: #901010;
  left: 20%;
}
.deleteButton:hover {
  background-color: #621313;
}
</style>