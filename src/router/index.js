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
        component: ()=>import("../views/pages/use-sidebar.vue")
    }
]

const router = new VueRouter({
    routes
})

export default router
