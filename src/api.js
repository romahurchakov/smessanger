import axios from 'axios';
import router from './router'

export const errHandler = err => {
    if (err.response.status === 403) {
        router.push("/login")
        throw Error('Вы неаутентифицированы! Пройдите аутентификацию')
    } else {
        throw Error('Ошибка сервера! Попробуйте позднее.')
    }
};

export const apiClient = axios.create({
    baseURL: 'http://localhost:8888',
    headers: {
        'Authorization': localStorage.getItem('token')
    }
})

//При каждом ответе сервера, если получаем ответ 401 - пользователь не авторизован => login page
axios.interceptors.response.use(
    response => {
        return response;
    },
    err => {
        if (err.response.status === 401) {
            router.push({ name: 'login' })
        }
        return Promise.reject(err.response);
    }
);

apiClient.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem('token');
    return config;
}
);
