import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { setupStore } from '@/store'

import { registerGlobComp } from '@/components/base/registerGlobComp'

// 引入全局样式文件
import '@/assets/scss/index.scss'

const app = createApp(App)

// 配置store
setupStore(app)

// 注册全局组件
registerGlobComp(app)

app
	.use(router)
	.mount('#app')
