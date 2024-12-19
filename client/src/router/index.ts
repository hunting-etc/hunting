import { createRouter, createWebHistory } from "vue-router";
// import LoginForm from "../components/login.vue";
import LoginForm from "../components/LoginForm.vue";
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
          name: "InfoHunting",
          path: "infopage/infoHunting",
          component: InfoHunting,
        },
        {
          name: "Fishing",
          path: "fishing", // Относительный путь
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
  ],
});


