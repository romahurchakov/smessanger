import { apiClient } from '@/api.js';

const actions = {
    GET_NEWS() {
        return apiClient.get(`/api/news`)
            .then(({ data }) => {
                return data
            })
    },

    DELETE_NEWS(_, id) {
        return apiClient.delete(`/api/news/${id}`)
            .then(({ data }) => {
                return data
            })
    },
    CREATE_NEWS(_, { file, data }) {
        var formData = new FormData();
        formData.append('file', file)
        formData.append('data', JSON.stringify(data))
        let url = `/api/news`
        return apiClient.put(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            .then(({ data }) => {
                return data
            })
    },
    DOWNLOAD_REPORT(_, { name }) {
        //window.open(`http://localhost:8888/api/labs/${id}/report`, '_blank');
        let url = `/api/news/docs/${name}`
        return apiClient.get(url)
            .then(({ data }) => {
                return data
            })
    },
};

export default {
    namespaced: true,
    actions,
};
