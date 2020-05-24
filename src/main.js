import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ru-RU';
import router from './router';
import './assets/styles/element-variables.scss';
import './index.css';
import store from './store/store'

Vue.config.productionTip = false
Vue.use(Element, { locale });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
