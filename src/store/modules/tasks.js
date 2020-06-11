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
                    return {
                        id: elem.id,
                        name: elem.name,
                        discipline: elem.discipline,
                        number: elem.number,
                        points: elem.points,
                        variants: elem.variants,
                        users: elem.users,
                        discipline_id: elem.discipline_id,
                    }

                })
            })
            .catch(err => {
                errHandler(err)
            })
    },
    CHANGE_TASK(_, { taskData, id }) {
        return apiClient.patch(`/api/labs/${id}`, taskData)
            .then(({ data }) => {
                return data
            })
    },
    GET_TASK(_, { id }) {
        return apiClient.get(`/api/labs/${id}`)
            .then(({ data }) => {
                return {
                    id: data.id,
                    name: data.name,
                    discipline: data.discipline,
                    number: data.number,
                    points: data.points,
                    variants: data.variants,
                    users: data.users,
                    discipline_id: data.discipline_id,
                }
            })
            .catch(err => {
                errHandler(err)
            })
    },
    DELETE_TASK(_, { id }) {
        return apiClient.delete(`/api/labs/${id}`)
            .then(({ data }) => {
                return data
            })
    },
    CREATE_TASK(_, { discipline, raw }) {
        return apiClient.post('/api/labs', {
            discipline: discipline,
            raw: raw,
        }).then(({ data }) => {
            return data
        })
    },
    EXCEL() {
        let url = '/api/labs/report'
        return apiClient.get(url, { responseType: 'blob' })
            .then(({ data }) => {
                return data
            })
    },
    UPLOAD(_, { file, data, variant_id }) {
        var formData = new FormData();
        formData.append('file', file)
        formData.append('data', JSON.stringify(data))
        let url = `/api/labs/${variant_id}/report`
        return apiClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(({ data }) => {
                return data
            })
    },
    DOWNLOAD_REPORT(_, { lab_id, user_id }) {
        //window.open(`http://localhost:8888/api/labs/${id}/report`, '_blank');
        let url = `/api/labs/${lab_id}/${user_id}/report`
        return apiClient.get(url)
            .then(res => {
                return {
                    data: res.data, filename: res.headers['content-disposition'].split("filename=")[1].substr(1).slice(0, -1)
                }
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
    GET_RAW(_, { discipline }) {
        return apiClient.get(`/api/labs/${discipline}/raw`)
            .then(({ data }) => {
                return data.raw
            })
    }
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
