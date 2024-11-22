import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import LoginForm from '../components/LoginForm.vue'
import HuntingPage from '../components/HuntingPage.vue'
import DriveHunt from '../pages/peges2/DriveHunt.vue'
import CoralHunt from '../pages/peges2/CoralHunt.vue'
import Fishing from '../pages/Fishing.vue'
import Ecotourism from '../pages/Ecotourism.vue'
import Services from '../pages/Services.vue'
import HuntingOrganization from '../pages/peges2/HuntingOrganization.vue'
import About from '../pages/About.vue'
import News from '../pages/News.vue'
import ActiveRecreation from '../pages/ActiveRecreation.vue'
import Test from '../components/Test.vue'
import Output from '../components/Output.vue'



export default createRouter(
    {
        history: createWebHistory(),
        routes: [
          {
            name: 'LoginForm',
            path: '/',
            component: LoginForm,
          },
            {
                name: 'Home',
                path: '/home',
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
                      component: CoralHunt,
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
                  component: Ecotourism,
                },
                {
                  name: 'Services',
                  path: '/services',
                  component: Services,
                  children: [
                    {
                      name: 'HuntingOrganization',
                      path: 'huntingOrganization',
                      component: HuntingOrganization,
                    }
                  ]
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
                },
                {
                  name: 'Test',
                  path: '/test',
                  component: Test,
                }
            ]
          }
        ]
    }
)