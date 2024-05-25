import { createRouter, createWebHistory } from "vue-router";

import PvzView from '@/views/Pvz.vue';

const routes = [
    {
        path: '/',
        component: PvzView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router