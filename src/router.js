import Vue from 'vue';
import Router from 'vue-router';
import Profile from '@/components/Profile/Profile.vue'
import Abitura from '@/components/Abitura/Abitura.vue'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Profile,
            meta: { uri: 'home', level: null }
        },
        {
            path: '/login',
            name: 'login',
            meta: { uri: 'login', level: null }
        },
        {
            path: '/entrant',
            name: 'entrant',
            component: Abitura,
            meta: { uri: 'entrant', level: null }
        },
    ]
});


export default router;
