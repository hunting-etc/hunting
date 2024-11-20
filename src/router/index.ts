import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import HuntingPage from '../components/HuntingPage.vue'
import DriveHunt from '../components/DriveHunt.vue'
import CoralHunt from '../components/CoralHunt.vue'


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
                name: 'HuntingPage',
                path: '/huntingPage',
                component: HuntingPage, // Основной компонент
                children: [
                    {
                        name: 'DriveHunt',
                        path: 'driveHunt', // Дочерний маршрут (без начального "/")
                        component: DriveHunt, // Компонент HelloWorld.vue
                    },
                    {
                      name: 'CoralHunt',
                      path: 'coralHunt',
                      component: CoralHunt
                    }
                ],
              }
            ]
          }
        ]
    }
)