/* eslint-disable */
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: "debug4j",
            redirect: "/login"
        },
        {
            path: '/login',
            name: "debug4j/login",
            component: () => import("@/components/Login.vue")
        },
        {
            path: '/index',
            name: "debug4j/index",
            component: () => import("@/components/Index.vue")
        },
        {
            path: '/log',
            name: "debug4j/log",
            component: () => import("@/components/Log.vue")
        },
        {
            path: '/code',
            name: "debug4j/code",
            component: () => import("@/components/Code.vue")
        },
        {
            path: '/:pathMatch(.*)',
            component: () => import("@/components/404.vue")
        }
    ]
})

export default router