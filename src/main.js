import { createApp } from 'vue'
import App from './App.vue'
import axios from "axios"

axios.defaults.timeout = 5000       // 超时时长
process.env.NODE_ENV === 'production' ? axios.defaults.baseURL = "/" : axios.defaults.baseURL = "/url"

createApp(App).mount('#app')
