<template>
  <div id="app" class="container">
    <header class="header">
      <h1>Админ панель</h1>
    </header>
    <div class="content">
      <div class="left-panel">
        <button class="btn" @click="goToHunting">Охота</button>
        <button class="btn" @click="goToFishing">Рыбалка</button>
      </div>
      <div class="right-panel">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "App",
  setup() {
    const router = useRouter();

    const goToHunting = () => {
      router.push("/hunting");
    };

    const goToFishing = () => {
      router.push("/fishing");
    };

    return {
      goToHunting,
      goToFishing,
    };
  },
});
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Шапка страницы */
.header {
  background-color: #007bff;
  color: white;
  padding: 10px; /* Уменьшен отступ */
  font-size: 18px; /* Уменьшен размер текста */
  font-weight: bold;
  text-align: left;
  box-sizing: border-box;
  height: 50px; /* Фиксированная меньшая высота */
  display: flex;
  align-items: center; /* Вертикальное центрирование текста */
}

.content {
  display: flex;
  flex-grow: 1;
}

.left-panel {
  width: 30%;
  background: #f4f4f4;
  padding: 20px;
  box-sizing: border-box;
}

.right-panel {
  width: 70%;
  padding: 20px;
  box-sizing: border-box;
}

.btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  text-align: left;
}

.btn:hover {
  background-color: #0056b3;
}
</style>
