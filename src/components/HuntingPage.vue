<template>
  <div>
    <h1>Охота</h1>
    <p>Информация о категориях охоты.</p>
    <DataTable :value="childList" showGridlines tableStyle="min-width: 50rem">
      <Column field="title" header="Название"></Column>
      <Column header=""></Column>
      <Column header="Изменить">
        <template #body="{ data }">
          <Button label="Изменить" @click="goToAction(data)" />
          <Button label="Удалить" @click="deleteItem(data.id)" />
        </template>
      </Column>
    </DataTable>


  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from 'vue-router'; // Импорт useRouter
import { ChildService, Child } from "../api/service"; // Импортируем ChildService и интерфейс Child
import { DataTable, Column } from 'primevue'; // Импортируем необходимые компоненты
import Button from 'primevue/button'; // Импортируем компонент Button

export default defineComponent({
  name: "HuntingPage",
  components: {
    DataTable,
    Column,
    Button
  },
  setup() {
    const router = useRouter(); // Инициализация роутера
    const childList = ref<Child[]>([]); // Типизация childList
    const childService = new ChildService();

    const fetchData = async () => {
      try {
        childList.value = await childService.getAll('/test/categories');
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    const goToAction = (data: Child) => {
      // Переход на Action.vue с передачей данных
      router.push({ name: 'Action', query: { id: data.id } });
    };

    const deleteItem = async (id: string) => {
      const confirmDelete = confirm("Вы уверены, что хотите удалить этот элемент?");
      if (confirmDelete) {
        try {
          await childService.delete('/test/categories', id, 'admin'); // Убедитесь, что указали правильный baseAdmin
          fetchData(); // Перезагружаем данные после удаления
        } catch (error) {
          console.error("Ошибка при удалении данных:", error);
        }
      }
    };


    onMounted(() => {
      fetchData(); // Загружаем данные при монтировании компонента
    });

    return {
      childList,
      goToAction, // Возвращаем функцию перехода
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
  background-color: #2196F3; /* Синий фон */
  color: white; /* Белый текст */
  border: none; /* Без границы */
  padding: 5px 10px; /* Отступы */
  cursor: pointer; /* Указатель при наведении */
  border-radius: 4px; /* Закругленные углы */
}

/* Эффект при наведении на кнопку */
.p-button:hover {
  background-color: #1976D2; /* Темнее при наведении */
}
</style>