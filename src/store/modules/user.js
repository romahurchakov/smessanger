import { errHandler, apiClient } from '@/api.js';

const state = {
    profile: {
        login: null,
        role: {
            teacher: false,
            student: false,
            admin: false,
            news: false,
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
    name: state => state.profile.name,
    isAdmin: state => state.profile.role.admin,
    isNewsEditor: state => state.profile.role.news,
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

const isNewsEditor = function (element) {
    if (element.name == 'news') {
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
    GET_USERS() {
        return apiClient.get('/api/users').then(({ data }) => {
            return data.users
        }).catch(err => {
            return errHandler(err)
        })
    },
    GET_GROUPS() {
        return apiClient.get('/api/groups').then(({ data }) => {
            return data.groups
        }).catch(err => {
            return errHandler(err)
        })
    },
    GET_ROLES() {
        return apiClient.get('/api/list/roles').then(({ data }) => {
            return data.roles
        }).catch(err => {
            return errHandler(err)
        })
    },
    CREATE_USER(_, user ) {
        return apiClient.post('/api/users', user ).then(({ data }) => {
            return data
        }).catch(err => {
            return errHandler(err)
        })
    },
    UPDATE_USER(_, user) {
        return apiClient.patch(`/api/users/${user.id}`, user).then(({ data }) => {
            return data
        }).catch(err => {
            return errHandler(err)
        })
    },
    DELETE_USER(_, id) {
        return apiClient.delete(`/api/users/${id}`).then(({ data }) => {
            return data
        }).catch(err => {
            return errHandler(err)
        })
    },
    GET_USER(_, id) {
        return apiClient.get(`/api/users/${id}`).then(({ data }) => {
            return data
        }).catch(err => {
            return errHandler(err)
        })
    },
    GET_GROUP(_, id) {
        return apiClient.get(`/api/groups/${id}`).then(({ data }) => {
            return data
        }).catch(err => {
            return errHandler(err)
        })
    },
    UPDATE_GROUP(_, {id, data}) {
        console.log("KEK")
        return apiClient.patch(`/api/groups/${id}`, data).then(({ data }) => {
            return data
        }).catch(err => {
            return errHandler(err)
        })
    },
    DELETE_GROUP(_, id) {
        console.log("KEK")
        return apiClient.delete(`/api/groups/${id}`).then(({ data }) => {
            return data
        }).catch(err => {
            return errHandler(err)
        })
    },
    CREATE_GROUP(_, data) {
        return apiClient.post(`/api/groups`, data).then(({ data }) => {
            return data
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
        state.profile.role.news = data.roles.find(isNewsEditor)
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
