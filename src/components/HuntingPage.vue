<template>
<div> 
    <h1>Охота</h1>
    <p>Информация о категориях охоты.</p>
    <Datatable :value="childList" showGridlines tableStyle="min-width: 50rem">
      <Column field="name" header="Название"></Column>
      <Column field="" header=""></Column>
      <Column header="Изменить">
        <template #body="{ data }">
          <Button label="Изменить" @click="goToAction(data)" />
        </template></Column>
    </Datatable>
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
        childList.value = await childService.getAll('children');
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    const goToAction = (data: Child) => {
      // Переход на Action.vue с передачей данных
      router.push({ name: 'Action', query: { id: data.id } });
    };

    onMounted(() => {
      fetchData(); // Загружаем данные при монтировании компонента
    });

    return {
      childList,
      goToAction // Возвращаем функцию перехода
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
</style>