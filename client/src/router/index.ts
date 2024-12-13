import { createRouter, createWebHistory } from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import Home from "../components/Home.vue";
import HuntingPage from "../categories/HuntingPage.vue";
import Fishing from "../categories/Fishing.vue";
import ActiveRecreation from "../categories/ActiveRecreation.vue";
import Ecotourism from "../categories/Ecotourism.vue";
import Services from "../categories/Services.vue";
import About from "../categories/About.vue";
import News from "../categories/News.vue";


export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "LoginForm",
      path: "/admin",
      component: LoginForm,
    },
    {
      name: "Home",
      path: "/home",
      component: Home,
      children: [
        {
          name: "Hunting",
          path: "hunting",
          component: HuntingPage,
        },
        {
          name: "Fishing",
          path: "fishing", // Относительный путь
          component: Fishing,
        },
        {
          name: "ActiveRecreation",
          path: "activeRecreation",
          component: ActiveRecreation,
        },
        {
          name: "EcoTourism",
          path: "ecotourism",
          component: Ecotourism,
        },
        {
          name: "Services",
          path: "services",
          component: Services,
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
      ],
    },
  ],
});