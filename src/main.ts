// import 'default-passive-events'

import { createHead } from '@unhead/vue/client'
import VCalendar from 'v-calendar'
import { createApp } from 'vue'

import App from './App.vue'
import global from './plugin/global'
import vant from './plugin/vant'
import router from './router'
import pinia from './stores'

import 'uno.css'
import 'vue-cropper/dist/index.css'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'

import './assets/scss/global/global.scss'
import './assets/scss/style.scss'
import 'v-calendar/style.css'

console.log(`当前环境: ${import.meta.env.VITE_APP_ENV}`)

const app = createApp(App)
const head = createHead()

app
  .use(pinia)
  .use(router)
  .use(head)
  .use(vant)
  .use(global)
  .use(VCalendar)
  .mount('#app')
