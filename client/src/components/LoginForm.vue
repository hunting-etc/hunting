<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import {ref} from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter();
const text = ref('')
const text1 = ref('')
const correctUsername = 'admin';
const correctPassword = '12345';
const login = () => {
  if (text.value === correctUsername && text1.value === correctPassword) {
    // Если данные введены верно, переходим на страницу dashboard
    router.push({name:'Home'})
  } else {
    // Если данные неверные, можно показать ошибку
    alert('Неверное имя пользователя или пароль');
  }
};
</script>

<template>
  <div class="main__menu">
    <span class="main__text">Admin panel</span>
    <InputText v-model="text" name="login" placeholder="Login"/>
    <InputText v-model="text1" name="password" placeholder="Password" type="password"/>
    <Button label="Log in" @click="login"/>
  </div>
</template>

<style scoped>
.main__menu{
  font-family:Times, "Times New Roman", Georgia, serif;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap:30px;
  height: 100vh;
}
.main__text {
  font-size: 24px;
}
.p-button {
  font-size: 20px; /* Размер текста на кнопке */
  padding: 15px 30px; /* Увеличенные отступы */
  width: 15%;
}
.p-inputtext {
  font-size: 20px; /* Размер текста внутри поля */
  padding: 10px; /* Отступы внутри поля */
  height: 50px; /* Высота поля */
  width: 15%;
}

</style>