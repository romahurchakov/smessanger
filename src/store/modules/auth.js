import { apiClient } from '@/api.js';
import axios from 'axios'
import user from './../modules/user.js'

const state = {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {}
};

const getters = {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
};

const isTeacher = function (element) {
    if (element.name == 'teacher') {
        return true
    }
    return false
}

const isStudent = function (element) {
    if (element.name == 'student') {
        return true
    }
    return false
}

const isAdmin = function (element) {
    if (element.name == 'admin') {
        return true
    }
    return false
}

const actions = {
    LOGIN({ commit }, user1) {
        return new Promise((resolve, reject) => {
            commit('auth_request')
            apiClient.post('/api/auth', user1)
                .then(resp => {
                    const token = resp.headers.authorization
                    const user1 = resp.data.login
                    user.state.profile.login = user1
                    user.state.profile.name = resp.data.name
                    user.state.profile.role.teacher = resp.data.roles.find(isTeacher)
                    user.state.profile.role.student = resp.data.roles.find(isStudent)
                    user.state.profile.role.admin = resp.data.roles.find(isAdmin)
                    delete axios.defaults.headers.common["Authorization"]
                    localStorage.setItem('token', token)
                    axios.defaults.headers.common['Authorization'] = token
                    commit('auth_success', token, user1)
                    resolve(resp)
                })
                .catch(err => {
                    commit('auth_error')
                    localStorage.removeItem('token')
                    reject(err)
                })
        })
    },
    LOGOUT({commit}) {
        return new Promise((resolve) => {
            commit('logout')
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization']
            resolve()
        })
    },
};

const mutations = {
    auth_request(state) {
        state.status = 'loading'
    },
    auth_success(state, token, user) {
        state.status = 'success'
        state.token = token
        state.user = user
    },
    auth_error(state) {
        state.status = 'error'
    },
    logout(state) {
        state.status = ''
        state.token = ''
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
