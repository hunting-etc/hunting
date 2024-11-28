<template>
<div> 
    <h1>Охота</h1>
    <p>Информация о категориях охоты.</p>
    <ul>
      <li v-for="item in childList" :key="item.id">{{ item.title }}</li>
    </ul>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Child, ChildService } from "../api/service";

export default defineComponent({
  name: "hunting",
  setup() {
    const childList = ref<Child[]>([]); // Указываем тип для childList
    const childService = new ChildService();

    const fetchData = async () => {
      try {
        childList.value = await childService.getAll('children'); // 'children' - это префикс для API
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      childList
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