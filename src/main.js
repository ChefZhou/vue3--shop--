import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import axios from '@/utils/axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
const pinia = createPinia()

app.config.globalProperties.$axios = axios

app.use(pinia)
app.use(router)
app.use(VueAxios, axios)

app.mount('#app')
