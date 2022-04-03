// 对axios进行二次封装
import axios from 'axios'

// 引入store仓库
import store from '@/store'

// 1.利用axios对象的方法create，创建一个axios实例
const requests = axios.create({
  // 配置
  // baseURL: process.env.VUE_APP_BASE_API, // 基本路径前缀（自动匹配生产环境或开发环境）
  // baseURL: 'https://101.42.111.16:9615/api',
  baseURL: '/api',
  timeout: 30000, // 请求超时时间
  withCredentials: true // 请求携带Cookie
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  // }

})
// requests.defaults.withCredentials = true// 请求携带Cookie

// 请求拦截器：在请求发出前，做一些事情
requests.interceptors.request.use((config) => {
  // config:配置对象，其中有一个属性，headers请求头
  // 需要携带token给服务器
  if (store.state.user.token) {
    config.headers.token = store.state.user.token
  }

  return config
})

// 响应拦截器：成功和失败两种
requests.interceptors.response.use(
  (res) => {
    // 成功的回调函数
    return res.data
  },
  (err) => {
    // 失败的回调函数
    return Promise.reject(new Error(err))
  }
)

// 对外暴露
export default requests
