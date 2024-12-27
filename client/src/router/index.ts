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
import {ApiService} from "../api/service"
import RegisterAdmin from "../components/RegisterAdmin.vue";

const apiService=new ApiService()

const routes = [
  
  {
    name: "LoginForm",
    path: "/admin",
    component: LoginForm,
  },
  {
    name:"RegisterAdmin",
    path: "/registr",
    component:RegisterAdmin,
  },
  {
    name: "Home",
    path: "/home",
    component: Home, // Требуется авторизация
    children: [
      {
        name: "Hunting",
        path: "hunting",
        component: HuntingPage,

      },
      {
        name: "InfoHunting",
        path: "infopage/infoHunting",
        component: InfoHunting,

      },
      {
        name: "Fishing",
        path: "fishing",
        component: Fishing,

      },
      {
        name: "InfoFishing",
        path: "infopage/infoFishing",
        component: InfoFishing,

      },
      {
        name: "ActiveRecreation",
        path: "activeRecreation",
        component: ActiveRecreation,

      },
      {
        name: "InfoActiveRecreation",
        path: "infopage/infoActiveRecreation",
        component: InfoActiverecreation,

      },
      {
        name: "EcoTourism",
        path: "ecotourism",
        component: Ecotourism,

      },
      {
        name: "InfoEcotourism",
        path: "infopage/infoEcotourism",
        component: InfoEcotourism,

      },
      {
        name: "Services",
        path: "services",
        component: Services,

      },
      {
        name: "InfoServices",
        path: "infopage/infoServices",
        component: InfoService,

      },
      {
        name: "About",
        path: "/about",
        component: About,

      },
      {
        name: "News",
        path: "news",
        component: News,

      },
      {
        name: "InfoNews",
        path: "infopage/infoNews",
        component: InfoNews,

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
router.beforeEach(async (to, from, next) => {
  const refreshToken = localStorage.getItem("refresh_token");

// Проверяем наличие и валидность refresh token
if (!refreshToken || apiService.isAccessTokenExpired(refreshToken)) {
  console.log("Refresh token отсутствует или истёк.");
  
  // Избегаем бесконечного редиректа на LoginForm
  if (to.name !== "LoginForm") {
    return next({ name: "LoginForm" }); // Перенаправляем на страницу входа
  } else {
    return next(); // Если уже на LoginForm, пропускаем
  }
}

try {
  let accessToken = localStorage.getItem("access_token");

  // Проверяем и обновляем access token
  if (!accessToken || apiService.isAccessTokenExpired(accessToken)) {
    console.log("Access token истёк. Обновляем токен...");
    
    const response = await axios.post("http://127.0.0.1:8000/admin/refresh", {
      refresh: refreshToken,
    });

    // Сохраняем новый access token
    let accessToken = response.data.access;
    localStorage.setItem("access_token", accessToken);
  }

  // Токен действителен или успешно обновлён, продолжаем маршрут
  if(to.path === '/'){
    next({ name: "Home" });
  }
  next();
} catch (error) {
  console.error("Ошибка при обновлении токена:", error);

  // Перенаправляем на страницу входа при ошибке
  if (to.name !== "LoginForm") {
    return next({ name: "LoginForm" });
  } else {
    return next(); // Если уже на LoginForm, пропускаем
  }
}
});

// Экспорт маршрутизатора
export default router;


