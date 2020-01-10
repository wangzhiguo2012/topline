import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入组件模块的css样式
import '@/assets/css/global.css'
// 引入组件库模块
import ElementUI from 'element-ui'
// 导入axios主入口文件引入配置axios
import axios from 'axios'
// 引入axios相关
import '@/utils/ax.js'
// 配置为vue的原型对象
Vue.prototype.$http = axios
// 注册
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
// 配置请求拦截器
