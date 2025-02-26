import router from '@/utils/router.js'
import Layui from '@layui/layui-vue'
import '@layui/layui-vue/lib/index.css'
import { createApp } from 'vue'
import { InstallCodeMirror } from "codemirror-editor-vue3";
import App from './App.vue'

createApp(App).use(router).use(Layui).use(InstallCodeMirror).mount('#app')
