import { errHandler, apiClient } from '@/api.js';

const state = {
    labs: [],
    courseWorks: []
};

const getters = {

};

const actions = {
    GET_TASKS(_, { taskType }) {
        let url = ''
        switch (taskType) {
            case 'labs':
                url = '/api/labs'
                break
            case 'courses':
                url = '/api/course'
                break
        }
        return apiClient.get(url)
            .then(({ data }) => {
                if (!data.labs) {
                    return []
                }
                return data.labs.map(function (elem) {
                    if (elem.users[0]) {
                        return {
                            id: elem.id,
                            completed: elem.completed,
                            description: elem.description,
                            discipline: elem.discipline,
                            issueDate: elem.created_at,
                            thesisDate: elem.thesis_date,
                            name: elem.name,
                            users: data.users,
                            already_exists: data.already_exists,
                        }
                    } else {
                        return {
                            id: elem.id,
                            completed: elem.completed,
                            description: elem.description,
                            discipline: elem.discipline,
                            issueDate: elem.created_at,
                            thesisDate: elem.thesis_date,
                            name: elem.name,
                            already_exists: data.already_exists,
                        }
                    }
                })
            })
            .catch(err => {
                errHandler(err)
            })
    },
    CHANGE_TASK(_, { taskData, id, taskType}) {
        let url = ''
        switch (taskType) {
            case 'labs':
                url = `/api/labs/${id}`
                break
            case 'courses':
                url = `/api/labs/${id}`
                break
        }
        return apiClient.patch(url, {
            thesisDate: taskData.thesisDate,
        })
            .then(({ data }) => {
                return data
            })
    },
    GET_TASK(_, { taskType, id }) {
        let url = ''
        switch (taskType) {
            case 'labs':
                url = `/api/labs/${id}`
                break
            case 'courses':
                url = `/api/labs/${id}`
                break
        }
        return apiClient.get(url)
            .then(({ data }) => {
                if (data.users.length > 0) {
                    return {
                        id: data.id,
                        completed: data.completed,
                        description: data.description,
                        discipline: data.discipline,
                        issueDate: data.created_at,
                        thesisDate: data.thesis_date,
                        name: data.name,
                        users: data.users,
                        already_exists: data.already_exists,
                    }
                } else {
                    return {
                        id: data.id,
                        completed: data.completed,
                        description: data.description,
                        discipline: data.discipline,
                        issueDate: data.created_at,
                        thesisDate: data.thesis_date,
                        name: data.name,
                        already_exists: data.already_exists,
                    }
                }
            })
            .catch(err => {
                errHandler(err)
            })
    },
    DELETE_TASK(_, { taskType,id }) {
        let url = ''
        switch (taskType) {
            case 'labs':
                url = '/api/labs/' + encodeURIComponent(id)
                break
            case 'courses':
                url = '/api/labs/' + encodeURIComponent(id)
                break
        }
        console.log(url)
        return apiClient.delete(url)
            .then(({ data }) => {
                return data
            })
    },
    CREATE_TASK(_, { taskData, taskType }) {
        let url = ''
        switch (taskType) {
            case 'labs':
                url = '/api/labs'
                break
            case 'courses':
                url = '/api/labs'
                break
        }
        delete taskData.id
        return apiClient.post(url, {
            completed: taskData.completed,
            description: taskData.description,
            discipline: taskData.discipline,
            issueDate: taskData.issueDate,
            thesisDate: taskData.thesisDate,
            name: taskData.title,
            users: taskData.users,
        })
            .then(({ data }) => {
                return data
            })
    },
    EXCEL() {
        let url = '/api/labs/report'
        return apiClient.get(url, {responseType: 'blob'})
            .then(({ data }) => {
                return data
            })
    },
    UPLOAD(_, {file, id}) {
        var formData = new FormData();
        formData.append('file', file.file)
        let url = `/api/labs/${id}/report`
        return apiClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data'}})
            .then(({ data }) => {
                return data
            })
    },
    DOWNLOAD_REPORT(_, { id }) {
        //window.open(`http://localhost:8888/api/labs/${id}/report`, '_blank');
        let url = `/api/labs/${id}/report`
        return apiClient.get(url)
            .then(({ data }) => {
                return data
            })
    },
    GET_DISCIPLINES() {
        let url = '/api/list/disciplines'
        return apiClient.get(url)
            .then(({ data }) => {
                return data
            })
    },
    DELETE_USER(_, { id, user_id }) {
        return apiClient.delete(`/api/labs/${id}/${user_id}`)
            .then(({ data }) => {
                return data
            })
    },
};

const mutations = {
    SET_LABS() {

    },
    SET_COURSE_WORKS() {

    },
    ADD_LAB() {

    },
    ADD_COURSE_WORK() {

    },
    DELETE_LAB() {

    },
    DELETE_COURSE_WORK() {

    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
