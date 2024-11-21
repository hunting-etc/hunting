<template>
<div> 
    <h1>Охота</h1>
    <ul>
        <li><router-link to="/hunting/coralHunt">Загонная охота</router-link></li>
        <li><router-link to="/hunting/driveHunt">Охота с подъезда</router-link></li>
    </ul>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HuntingPage",
});
</script>

<style>
h1{
  text-align: center;
}
</style>