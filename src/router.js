import Vue from 'vue';
import Router from 'vue-router';
import Profile from '@/components/Profile/Profile.vue'
import Abitura from '@/components/Abitura/Abitura.vue'
import Login from '@/components/Login/Login.vue'
import store from './store/store'

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'base',
        },
        {
            path: '/home',
            name: 'home',
            component: Profile,
            meta: { uri: 'home', level: null, requiresAuth: false }
        },
        {
            path: '/entrant',
            name: 'entrant',
            component: Abitura,
            meta: { uri: 'entrant', level: null, requiresAuth: false }
        },
        {
            path: '/login',
            name: 'login',
            meta: {
                title: 'Логин - Курсовая',
                 requiresAuth: false,
            },
            component: Login,
        },
        {
            path: '/labs',
            name: 'labs',
            meta: {
                title: 'Логин - Курсовая',
                requiresAuth: true,
            },
            component: () => import(/* webpackChunkName: "task" */ './components/TaskPage/Tasks')
        },
        {
            path: '/task',
            name: 'create-task',
            meta: {
                title: 'Логин - Курсовая',
                requiresAuth: true,
            },
            component: () => import(/* webpackChunkName: "task" */ './components/TaskPage/TaskPage')
        },
        {
            path: '/admin/users',
            name: 'user-settings',
            meta: {
                title: 'Логин - Курсовая',
                requiresAuth: true,
            },
            component: () => import(/* webpackChunkName: "task" */ './components/Admin/Users/Users')
        },
        {
            path: '/admin/groups',
            name: 'group-settings',
            meta: {
                title: 'Логин - Курсовая',
                requiresAuth: true,
            },
            component: () => import(/* webpackChunkName: "task" */ './components/Admin/Groups/Groups')
        },
        {
            path: '/admin/groups/:id',
            name: 'change-group',
            meta: {
                title: 'Логин - Курсовая',
                requiresAuth: true,
            },
            component: () => import(/* webpackChunkName: "task" */ './components/Admin/Groups/ChangeGroup')
        },
        {
            path: '/admin/management',
            name: 'management',
            meta: {
                title: 'Логин - Курсовая',
                requiresAuth: true,
            },
            component: () => import(/* webpackChunkName: "task" */ './components/Admin/Management')
        },
        {
            path: '/admin/users/:id',
            name: 'change-user',
            meta: {
                title: 'Логин - Курсовая',
                requiresAuth: true,
            },
            component: () => import(/* webpackChunkName: "task" */ './components/Admin/Users/ChangeUser')
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.name == 'base') {
        next('/home')
        return
    }
    if (to.name == 'login' && store.getters['auth/isLoggedIn'] ) {
        next('/home')
        return
    }
    if (store.getters['auth/isLoggedIn'] && store.getters['user/i']) {
        if (store.getters['user/i']) {
            try {
                store.dispatch('user/RECEIVE_USER_PROFILE')
            } catch (e) {
                this.$notify.error({
                    title: 'Ошибка!',
                    message: 'Что-то пошло не так'
                })
            }
        }
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters['auth/isLoggedIn']) {
            next()
            return
        }
        next('/login')
    } else {
        next()
    }
});


export default router;
