import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../components/login.vue";
// import LoginForm from "../components/LoginForm.vue";
import Home from "../components/Home.vue";
import HuntingPage from "../categories/HuntingPage.vue";
import Fishing from "../categories/Fishing.vue";
import ActiveRecreation from "../categories/ActiveRecreation.vue";
import Ecotourism from "../categories/Ecotourism.vue";
import Services from "../categories/Services.vue";
import About from "../categories/About.vue";
import News from "../categories/News.vue";
import InfoHunting from "../infoPages/infoHunting.vue";
import InfoFishing from "../infoPages/infoFishing.vue";
import InfoActiverecreation from "../infoPages/infoActiverecreation.vue";
import InfoEcotourism from "../infoPages/infoEcotourism.vue";
import InfoService  from "../infoPages/infoServices.vue";
import InfoNews from "../infoPages/infoNews.vue";
import axios from "axios";

const routes = [
  {
    path: '/',
    redirect: '/admin', // Начальный маршрут
  },
  {
    name: "LoginForm",
    path: "/admin",
    component: LoginForm,
  },
  {
    name: "Home",
    path: "/home",
    component: Home,
    meta: { requiresAuth: true }, // Требуется авторизация
    children: [
      {
        name: "Hunting",
        path: "hunting",
        component: HuntingPage,
        meta: { requiresAuth: true },
      },
      {
        name: "InfoHunting",
        path: "infopage/infoHunting",
        component: InfoHunting,
        meta: { requiresAuth: true },
      },
      {
        name: "Fishing",
        path: "fishing",
        component: Fishing,
        meta: { requiresAuth: true },
      },
      {
        name: "InfoFishing",
        path: "infopage/infoFishing",
        component: InfoFishing,
        meta: { requiresAuth: true },
      },
      {
        name: "ActiveRecreation",
        path: "activeRecreation",
        component: ActiveRecreation,
        meta: { requiresAuth: true },
      },
      {
        name: "InfoActiveRecreation",
        path: "infopage/infoActiveRecreation",
        component: InfoActiverecreation,
        meta: { requiresAuth: true },
      },
      {
        name: "EcoTourism",
        path: "ecotourism",
        component: Ecotourism,
        meta: { requiresAuth: true },
      },
      {
        name: "InfoEcotourism",
        path: "infopage/infoEcotourism",
        component: InfoEcotourism,
        meta: { requiresAuth: true },
      },
      {
        name: "Services",
        path: "services",
        component: Services,
        meta: { requiresAuth: true },
      },
      {
        name: "InfoServices",
        path: "infopage/infoServices",
        component: InfoService,
        meta: { requiresAuth: true },
      },
      {
        name: "About",
        path: "/about",
        component: About,
        meta: { requiresAuth: true },
      },
      {
        name: "News",
        path: "news",
        component: News,
        meta: { requiresAuth: true },
      },
      {
        name: "InfoNews",
        path: "infopage/infoNews",
        component: InfoNews,
        meta: { requiresAuth: true },
      },
    ],
  },
];

// Создаем маршрутизатор
const router = createRouter({
  history: createWebHistory(),
  routes,
});



// Хук для проверки авторизации
// router.beforeEach(async (to, from, next) => {
  
//   if (to.meta.requiresAuth) {
//     try {
//       // Проверяем авторизацию на сервере
//       const response = await axios.get("http://127.0.0.1:8000/admin/check-auth", {
//         withCredentials: true,
//       });
//       if (response.data.authenticated) {
//         next(); // Пользователь авторизован, продолжаем навигацию
//       } else {
//         next({ name: "LoginForm" }); // Неавторизованный пользователь
//       }
//     } catch (error) {
//       console.error("Ошибка при проверке авторизации:", error);
//       next({ name: "LoginForm" });
//     }
//   } else {
//     next(); // Для маршрутов без авторизации
//   }
// });

// Экспорт маршрутизатора
export default router;


