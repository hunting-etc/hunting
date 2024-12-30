import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import './style.css'
import App from './App.vue'
import router from "./router/index";
import 'primeicons/primeicons.css';
import { definePreset } from '@primevue/themes';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
//
const app = createApp(App)
app.use(ToastService);
app.component('Toast', Toast);
app.use(router)
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#f7f7f7',  // светлый оттенок черного (почти белый)
            100: '#e1e1e1',  // чуть темнее
            200: '#cccccc',  // еще темнее
            300: '#999999',  // серый
            400: '#666666',  // темно-серый
            500: '#333333',  // черный
            600: '#1a1a1a',  // еще темнее
            700: '#000000',  // черный
            800: '#000000',  // черный
            900: '#000000',  // черный
            950: '#000000'   // черный
        }
    }
});
app.use(PrimeVue,{
    theme:{
        preset: Aura//MyPreset
    }
})

app.mount('#app')