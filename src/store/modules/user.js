import { errHandler, apiClient } from '@/api.js';

const state = {
    profile: {
        login: null,
        role: {
            teacher: false,
            student: false,
            admin: false,
        },
        name: null
    },
    grants: null,
    userTasks: {
        transfers: [],
        familiarisations: []
    }
};

const getters = {
    i: state => !state.profile.name || !state.login,
    name: state => state.profile.name
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
    RECEIVE_USER_PROFILE({ commit }) {
        return apiClient.get('/api/users/i')
            .then(({ data }) => {
                commit('SET_PROFILE', data)
            })
            .catch(err => {
                errHandler(err)
            })
    },
    FIND_USERS(_, { fio, role_filter }) {
        const params = new URLSearchParams();
        params.append('fts', fio);
        params.append('role_filter', role_filter);
        return apiClient.get('/api/search/users', {
            params: params
        }).then(({ data }) => {
            return data.users
        }).catch(err => {
            return errHandler(err)
        })
    },
};

const mutations = {
    SET_PROFILE(state, data) {
        state.profile.login = data.login
        state.profile.name = data.fio
        state.profile.role.teacher = data.roles.find(isTeacher)
        state.profile.role.student = data.roles.find(isStudent)
        state.profile.role.admin = data.roles.find(isAdmin)
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
