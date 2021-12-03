import './public-path'
import Vue from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css'
import ProLayout, { PageHeaderWrapper } from './components/ProLayout'
import './core/lazy_use'
import routes from './router'
import store from './store'

Vue.config.productionTip = false
// 组件全局注册
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)

let instance = null
let router = null
const render = ({ container } = {}) => {
    router = routes
    instance = new Vue({
        router,
        store,
        render: h => h(App),
    }).$mount(container ? container.querySelector('#vue-app') : '#vue-app')
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
    render()
}

export async function bootstrap() {
    console.log('vue app bootstraped')
}

export async function mount(props) {
    console.log('props from main framework', props)
    // 首次render在动态路由后进行执行，否则路由会报相关错误，之后则每次进入页面后执行
    render(props)
}

export async function unmount() {
    instance.$destroy()
    instance.$el.innerHTML = ''
    instance = null
    router = null
}
