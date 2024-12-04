<template>
    <div> 
        <h1>Услуги</h1>
        <ul>
        <li><router-link to="/services/huntingOrganization">Организация охоты</router-link></li>
    </ul>
    </div>
    </template>
    
    <script lang="ts">
    import { defineComponent } from "vue";
    
    export default defineComponent({
      name: "Services",
    });
    </script>