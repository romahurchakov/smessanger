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
                            fio: elem.users[0].fio,
                            faculty: elem.users[0].faculty,
                            group: elem.users[0].group,
                            mail: elem.users[0].email,
                            telnum: elem.users[0].phone,
                            user_id: elem.users[0].id,
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
                        }
                    }
                })
            })
            .catch(err => {
                errHandler(err)
            })
    },
    CHANGE_TASK() {

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
                        user_id: data.users[0].id,
                        fio: data.users[0].fio,
                        faculty: data.users[0].faculty,
                        group: data.users[0].group,
                        mail: data.users[0].email,
                        telnum: data.users[0].phone,
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
                console.log('Обрабатываем успешный ответ', data)
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
                console.log('Обрабатываем успешный ответ', data)
                return data
            })
    },
    EXCEL() {
        let url = '/api/report'
        return apiClient.get(url, {responseType: 'blob'})
            .then(({ data }) => {
                console.log('Обрабатываем успешный ответ', data)
                return data
            })
    },
    UPLOAD(_, {file, id}) {
        var formData = new FormData();
        formData.append('file', file.file)
        let url = `/api/labs/${id}/report`
        return apiClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data'}})
            .then(({ data }) => {
                console.log('Обрабатываем успешный ответ', data)
                return data
            })
    },
    DOWNLOAD_REPORT(_, { id }) {
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
