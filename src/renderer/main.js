/*
 * @Author: your name
 * @Date: 2020-02-18 09:35:06
 * @LastEditTime: 2021-01-21 09:53:02
 * @LastEditors : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \inertiawheel1\src\renderer\main.js
 */
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
Vue.use(ElementUI, {
  locale
})

import '@/icons' // icon
import '@/permission' // permission control

// 数据库使用自己封装好的indexDB数据库
import indexDB from './indexDB'
indexDB.initIndexDB() // 初始化一下indexDB

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// 使用本地mock
import { mockXHR } from './mock'
mockXHR()

// 时间日期库
import moment from 'moment'
Vue.prototype.$moment = moment

// 虚拟键盘
import VueTouchKeyboard from 'vue-touch-keyboard'
import style from 'vue-touch-keyboard/dist/vue-touch-keyboard.css' // load default style
Vue.use(VueTouchKeyboard)

Vue.config.productionTip = false

new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
