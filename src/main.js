import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// Vant
import Vant from 'vant'
import 'vant/lib/index.css'

// dayjs
import dayjs from 'dayjs'

// 统一接收api文件夹中的全部请求函数
import API from '@/api/index.js'

// mint-ui
import { Range } from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.component(Range.name, Range)

Vue.use(Vant)
Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$dayjs = dayjs

new Vue({
  beforeCreate () {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
