import Vue from 'vue'
import App from './App'
import * as api from '@/apis/index.js';

Vue.config.productionTip = false
Vue.prototype.$api = api
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()