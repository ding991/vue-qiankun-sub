import { BasicLayout } from '@/layouts'
import defaultSettings from '@/config/defaultSettings'

const RouteView = {
    name: 'RouteView',
    render: h => h('router-view'),
}

/**
 * 菜单图标配置
 * @type { *[] }
 */
export const routeIconConfig = {
    home: 'home',
}

let prefix = ''
if (window.__POWERED_BY_QIANKUN__) {
    prefix = '/sub-vue'
}
export const asyncRouterMap = [
    {
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: { title: '主页' },
        redirect: defaultSettings.defaultRoute,
        children: [
            {
                path: prefix + '/home',
                name: 'Home',
                component: () => import('@/views/Home.vue'),
                meta: {
                    title: '主页',
                    keepAlive: true,
                },
            },
            {
                path: prefix + '/table',
                name: 'Table',
                component: RouteView,
                redirect: prefix + '/table/user',
                meta: {
                    title: '表格',
                    keepAlive: true,
                },
                children: [
                    {
                        path: prefix + '/table/user',
                        name: 'User',
                        component: () => import('@/views/User.vue'),
                        meta: {
                            title: '用户管理',
                            keepAlive: true,
                        },
                    },
                    {
                        path: prefix + '/table/carManage',
                        name: 'CarManage',
                        component: () => import('@/views/CarManage'),
                        meta: {
                            title: '车辆管理',
                            keepAlive: true,
                        },
                    },
                ],
            },
            {
                path: prefix + '/about',
                name: 'About',
                component: () => import('@/views/About.vue'),
                meta: {
                    title: '关于',
                    keepAlive: true,
                },
            },
        ],
    },
]
