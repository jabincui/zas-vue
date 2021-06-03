import { createRouter, createWebHashHistory } from 'vue-router'
import Main from '@/Main.vue'
import Login from '@/components/Login.vue'

import MSDetail from '@/components/MSDetail'

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'main',
            component: Main,
            children: [
                {path: '/ms/:id', component: MSDetail},
            ],
            meta: {isPublic: false}
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta:{isPublic: true}
        }
    ],
})

router.beforeEach((to, from, next) => {
    if(!to.meta.isPublic && (!localStorage.token || !(localStorage.token.substr(0, 6) === 'Bearer'))){
        return next('/login');
      }
    else next()
})
