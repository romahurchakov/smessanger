import { apiClient } from '@/api.js';

const actions = {
    GET_CHATS() {
        return apiClient.get(`/api/chats`)
            .then(({ data }) => {
                return data
            })
    },
    GET_CHAT(_, id) {
        return apiClient.get(`/api/chats/${id}`)
            .then(({ data }) => {
                return data
            })
    },
    GET_ALL_MESSAGES(_, id) {
        return apiClient.get(`/api/chats/${id}/messages`)
            .then(({ data }) => {
                return data.messages
            })
    },
    ADD_MESSAGE(_, {id, message}) {
        return apiClient.post(`/api/chats/${id}/messages`, message)
            .then(({ data }) => {
                return data
            })
    },
    DELETE_CHAT(_, id) {
        return apiClient.delete(`/api/chats/${id}`)
            .then(({ data }) => {
                return data
            })
    },
    CREATE_CHAT(_, chat) {
        console.log(chat)
        return apiClient.post(`/api/chats`, chat)
            .then(({ data }) => {
                return data
            })
    },
    GET_CHAT_ID(_, {user_id, discipline_id}) {
        return apiClient.get(`/api/chats/${discipline_id}/${user_id}/id`)
            .then(({ data }) => {
                return data.chat_id
            })
    },
};

export default {
    namespaced: true,
    actions,
};
