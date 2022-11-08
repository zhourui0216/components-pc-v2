import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: home
    },
    {
        path: '/use-sidebar',
        name: 'use-sidebar',
        component: () => import("../views/pages/use-sidebar.vue")
    },
    {
        path: '/use-input-box',
        name: 'use-input-box',
        component: () => import("../views/pages/use-input-box.vue")
    },
    {
        path: '/use-verification-code',
        name: 'use-verification-code',
        component: () => import("../views/pages/use-verification-code.vue")
    },
    {
        path: '/use-switch-button',
        name: 'use-switch-button',
        component: () => import("../views/pages/use-switch-button.vue")
    }
]

const router = new VueRouter({
    routes
})

export default router
