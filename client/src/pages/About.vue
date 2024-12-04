<template>
    <div> 
        <h1>О компании</h1>
        <p>Информация о компании.</p>

    </div>
    </template>
    
    <script lang="ts">
    import { defineComponent } from "vue";
    
    export default defineComponent({
      name: "about",
    });
    </script>

<style>
h1{
  text-align: center;
}
p{
  font-size: 22px;
  text-align: center;
  top:50%;
  left: 50%;
}
</style>