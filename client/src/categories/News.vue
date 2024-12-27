<template>
  <div>
    <h1>Новости</h1>
    <p>Информация о категориях новостей.</p>
    <div class="header-container">
      <Button label="+" class="createButton" @click="openCreateDialog" />
      <Dialog v-model:visible="createDialogVisible" modal header="Создание категории" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <Create @close="handleCreateDialogClose" category="News" />
      </Dialog>
    </div>
    <DataTable :value="childList" showGridlines tableStyle="min-width: 50rem">
      <Column field="name" header="Название">
        <template #body="slotProps">
          <div class="img-text-container">
            <div>
              <img :src="`${childService.baseUrl}${slotProps.data.photo}`" alt="Image" class="img-col" />
            </div>
            <div class="text">{{ slotProps.data.name }}</div>
          </div>
        </template>
      </Column>
      <Column header="Действия">
        <template #body="{ data }">
          <Button label="Изменить" @click="loadDataAndOpenDialog(data.id)" />
          <Button label="Удалить" class="deleteButton" @click="deleteItem(data.id)" />
        </template>
      </Column>
    </DataTable>

    <Dialog 
    v-model:visible="dialogVisible" 
    modal 
    header="Изменение категории" 
    :style="{ width: '50rem' }" 
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    @hide="onDialogHide"
    
    >
    
  <Suspense>
      <Action
      :initialData="selectedItem" 
      :id="selectedItem!.id" 
      @close="handleDialogClose"
      :category="'News'" />
  </Suspense>
  
</Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted} from "vue";
import { ChildService, Child } from "../api/service";
import { DataTable, Column } from 'primevue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Action from "../components/Action.vue";
import Create from "../components/Create.vue";


export default defineComponent({
  name: "News",
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    Action,
    Create
  },
  setup() {
    const childList = ref<Child[]>([]);
    const childService = new ChildService();
    const dialogVisible = ref(false); // Для "Изменение категории"
    const createDialogVisible = ref(false); // Для "Создание категории"
    const selectedItem = ref<Child | null>(null);
      let isManuallyClosed = false;
    const fetchData = async () => {
      try {
        childList.value = await childService.getByName('admin/categories', 'News');
        childList.value.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    const openCreateDialog = () => {
      createDialogVisible.value = true; // Открываем диалог для создания новой категории
    };

    const loadDataAndOpenDialog = async (id: string) => {
      try {
        const data: Child | Child[] = await childService.getAll('admin/categories', { id, category: "News" });
        if (Array.isArray(data)) {
          if (data.length > 0) {
            selectedItem.value = data[0];
          } else {
            throw new Error("Нет данных для отображения");
          }
        } else {
          selectedItem.value = data;
        }
        dialogVisible.value = true;
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    const handleDialogClose = () => {
      isManuallyClosed = true;
  dialogVisible.value = false;
  fetchData();
};

//добавление всплывающего окна о подтверждении выхода

const onDialogHide = async () => {
  if (isManuallyClosed) {
    // Если закрытие было вызвано вручную, просто сбрасываем флаг
    isManuallyClosed = false;
    return;
  }
  // Если закрытие происходит естественно, очищаем editorInstance
  window.processPendingDeletions('fulldelite');
};

 

    const handleCreateDialogClose = () => {
      isManuallyClosed = true;
      createDialogVisible.value = false;
      fetchData();
    };

    const deleteItem = async (id: string) => {
      const confirmDelete = confirm("Вы уверены, что хотите удалить этот элемент?");
      if (confirmDelete) {
        try {
          await childService.delete('admin/categories', id, '');
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
      openCreateDialog,
      loadDataAndOpenDialog,
      deleteItem,
      dialogVisible,
      createDialogVisible,
      selectedItem,
      handleDialogClose,
      handleCreateDialogClose,
      childService,
      onDialogHide,
      
    };
  }
});
</script>


<style>
h1 {
  text-align: center;
  font-size: 28px !important;
}
p {
  font-size: 20px !important;
  text-align: center;
  top: 50%;
  left: 50%;
}
.DataTable {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.DataTable th {
  background-color: #4CAF50;
  color: white;
  padding: 10px;
  text-align: left;
}

.DataTable td {
  border: 1px solid #dddddd;
  padding: 8px;
}

.DataTable tr:nth-child(even) {
  background-color: #f2f2f2;
}

.p-button {
  background-color: #269e2a;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}

.p-button:hover {
  background-color: #166f1a;
}
.header-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.createButton {
  margin-right: -1px;
  z-index: 1;
}
.deleteButton {
  background-color: #901010 !important;
  color: white;
  left: 10%;
}
.deleteButton:hover {
  background-color: #621313 !important;
}

.img-text-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.img-col {
  max-width: 150px; 
  max-height: 250px; 
  object-fit: cover; 
  border-radius: 4px;
  border: 1px solid #ddd; 
}
.text {
  text-align: center;
}
</style>