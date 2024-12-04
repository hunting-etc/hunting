<template>
    <div>
      <h1>Posts</h1>
      <DataTable :value="posts" tableStyle="min-width: 50rem">
        <Column field="1" header="1"></Column>
        <Column field="2" header="2"></Column>
        <Column field="3" header="3"></Column>
        <Column field="4" header="4"></Column>
        <Column field="5" header="5"></Column>
        <Column field="6" header="6"></Column>
        <Column field="7" header="7"></Column>
        <Column field="8" header="8"></Column>
      </DataTable>
    </div>
  </template>
  
  <script>
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import ColumnGroup from 'primevue/columngroup';   // optional
  import Row from 'primevue/row';                   // optional
  
  import { ParentService } from "../api/service.ts";
  import { onMounted } from "vue";
  
  const service = new ParentService();
  
  export default {
    components: {
      DataTable,
      Column,
    },
    data() {
      return {
        posts: [],  // Инициализируйте как пустой массив
      };
    },
    mounted() {
      this.loadPosts("admin");
    },
    methods: {
      async loadPosts(prefix) {
        try {
          const posts = await service.getAll(prefix); 
          this.posts = posts; 
        } catch (error) {
          console.error("Ошибка загрузки постов:", error);
        }
      },
    },
  };
  </script>
  <style scoped>
  
  </style>