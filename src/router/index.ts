import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import HuntingPage from '../components/HuntingPage.vue'
import DriveHunt from '../pages/DriveHunt.vue'
import CoralHunt from '../pages/CoralHunt.vue'
import Fishing from '../components/Fishing.vue'
import ActiveRecreation from '../components/ActiveRecreation.vue'
import EcoTourism from '../components/EcoTourism.vue'
import Services from '../components/Services.vue'
import About from '../components/About.vue'
import News from '../components/News.vue'


export default createRouter(
    {
        history: createWebHistory(),
        routes: [
            {
                name: 'Home',
                path: '/',
                component: Home,
            children: [
            {
                name: 'hunting',
                path: '/hunting',
                component: HuntingPage, // Основной компонент
                children: [
                    {
                        name: 'DriveHunt',
                        path: 'driveHunt', // Дочерний маршрут (без начального "/")
                        component: DriveHunt, 
                    },
                    {
                      name: 'CoralHunt',
                      path: 'coralHunt',
                      component: CoralHunt
                    }
                ],       
              },
              {
                name: 'Fishing',
                path: '/fishing',
                component: Fishing,
              },
                {
                  name: 'ActiveRecreation',
                  path: '/activeRecreation',
                  component: ActiveRecreation,
                },
                {
                  name: 'EcoTourism',
                  path: '/ecotourism',
                  component: EcoTourism,
                },
                {
                  name: 'Services',
                  path: '/services',
                  component: Services,
                },
                {
                  name: 'About',
                  path: '/about',
                  component: About,
                },
                {
                  name: 'News',
                  path: '/news',
                  component: News,
                }
            ]
          }
        ]
    }
)