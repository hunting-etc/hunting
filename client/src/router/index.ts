import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import LoginForm from "../components/LoginForm.vue";
import HuntingPage from "../components/HuntingPage.vue";
import Fishing from "../pages/Fishing.vue";
import Ecotourism from "../pages/Ecotourism.vue";
import Services from "../pages/Services.vue";
import About from "../pages/About.vue";
import News from "../pages/News.vue";
import ActiveRecreation from "../pages/ActiveRecreation.vue";
import Action from "../pages/Action.vue";

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
          name: "Action",
          path: "action",
          component: Action,
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