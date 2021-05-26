import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/Main.vue'
import Login from '@/components/Login.vue'

import MSDetail from '@/components/MSDetail'

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'main',
            component: Main,
            children: [
                {path: '/ms/:id', component: MSDetail}
            ]
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
    if(!to.meta.isPublic && !localStorage.token){
        console.log('试图访问一个非公开的页面，请先登录！')
        return next('/login');
      }
    else next()
})