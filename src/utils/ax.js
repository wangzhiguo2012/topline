// 导入axios主入口文件引入配置axios
import axios from 'axios'
// 导入vue模块
import Vue from 'vue'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 配置为Vue的继承成员
Vue.prototype.$http = axios
// 配置请求拦截器
axios.interceptors.request.use(function (config) {
  // 发送请求的相关逻辑
  // config:对象  与 axios.defaults 相当
  // 借助config配置token
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 判断token存在再做配置
  if (userinfo) {
    let token = JSON.parse(userinfo).token
    // 注意：token前边有 'Bearer ' 的信息前缀
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
