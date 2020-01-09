import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/home'

Vue.use(VueRouter)

const routes = [
//   { path: 'login', component: 箭头函数 }
//   import使用:
//   1.import xxx from xxx模块化导入  //完整导入
// 2.import(xxx)函数调用//按需导入
//   // 他们本质不是一回事
// 如下是import()函数调用, 好处是按需导入
// @符号代表src目录的绝对路径名地址: C: \Users\admin\Desktop\xiangmu1\wzhig / scr
// index.vue是默认索引文件, 不用设置, 自动会寻找, 代码更节省, 更优雅
//   name属性作用:编程式导航可以利用

  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/home', name: 'home', component: Home },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    redirect: '/welcome', // 路由重定向
    children: [
      // 欢迎页面子路由配置
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/article', name: 'article', component: () => import('@/views/article') }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})
