import piniaPluginPersistedstate from '@/app/store/plugins/persistedstate.ts'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
