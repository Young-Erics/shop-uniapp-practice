// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram'
// 导入 store 的实例对象
import store from './store/store.js'
// 为顶级属性uni挂载一个自定义属性$http,指向导入的成员$http
uni.$http = $http
// 配置请求根路径
$http.baseUrl = 'https://www.uinav.com'

// $http.baseUrl = 'https://autumnfish.cn/wx'
// 请求开始之前做一些事情
$http.beforeRequest = function(options) {
  uni.showLoading({ title: '数据加载中...', }) //开启loading加载效果
}
// 请求完成之后做一些事情
$http.afterRequest = function() {
  uni.hideLoading() //隐藏loading效果
}
// 封装的展示消息提示的方法
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}
Vue.config.productionTip = false
App.mpType = 'app'
// 将 store 挂载到 Vue 实例上
const app = new Vue({ ...App, store })
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
// #endif
