import { createApp } from 'vue'
import App from '@/app/App.vue'
import '@/app/styles/main.css'
import router from '@/app/router/index.ts'
import pinia from '@/app/store/index.ts'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
