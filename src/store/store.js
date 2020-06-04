import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user.js'
import tasks from './modules/tasks.js'
import auth from './modules/auth.js'
import chat from './modules/chat.js'
import news from './modules/news.js'
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        tasks,
        auth,
        chat,
        news
    }
})
