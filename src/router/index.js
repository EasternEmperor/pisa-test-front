// 此文件专门负责项目的路由

import VueRouter from "vue-router"

// 引入组件
import Login from '../views/login/Login'
import Register from '../views/register/Register'
import Home from '../views/home/Home'
import Admin from '../views/home/Admin'
// import User from '../views/user/User'
import { Message } from "element-ui"
import User from "../views/home/User.vue"
import FinishTest from '../views/home/FinishTest.vue'
import AirControllerT1 from '../views/questions/air_controller/air_controller_t1'
import AirControllerT2 from '../views/questions/air_controller/air_controller_t2'
import TicketsSaleT1 from '../views/questions/tickets_sale/tickets_sale_t1'
import TicketsSaleT2 from '../views/questions/tickets_sale/tickets_sale_t2'
import TicketsSaleT3 from '../views/questions/tickets_sale/tickets_sale_t3'

// 创建并暴露一个路由器
const router = new VueRouter({
    mode: 'history',    // 路由模式，该模式不会在地址中显示井号#
    routes: [
        {
            path: '/',          // 路径
            redirect: '/login'  // 重定向
        },
        {
            path: '/login',     // 路径
            component: Login    // 跳转到的组件
        },
        {
            path: '/register',     // 路径
            component: Register    // 跳转到的组件
        },
        {
            path: '/home',     // 路径
            component: Home    // 跳转到的组件
        },
        {
            path: '/admin',     // 路径
            component: Admin    // 跳转到的组件
        },
        {
            path: "/user",      // 路径
            component: User     // 跳转到的组件
        },
        {
            path: '/FinishTest',
            component: FinishTest
        },
        {
            path: '/questions/air_controller/air_controller_t1',
            component: AirControllerT1
        },
        {
            path: '/questions/air_controller/air_controller_t2',
            component: AirControllerT2
        },
        {
            path: '/questions/tickets_sale/tickets_sale_t1',
            component: TicketsSaleT1
        },
        {
            path: '/questions/tickets_sale/tickets_sale_t2',
            component: TicketsSaleT2
        },
        {
            path: '/questions/tickets_sale/tickets_sale_t3',
            component: TicketsSaleT3
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        // 如果存在 savedPosition，则表示用户使用了浏览器的前进/后退按钮，保持原有位置
        if (savedPosition) {
          return savedPosition;
        } else {
          return { x: 0, y: 0 }; // 否则滚动到页面顶部
        }
    }
})

// 导航守卫，前置处理
router.beforeEach((to, from, next) => {
    let isAuthenticated = !!sessionStorage.getItem('userInfo')
    // 如果路由要跳转到除了登录和注册的界面的话就判断是否已经登录，如果没有登录就强制跳到登录界面
    if (to.path !== '/login' && to.path !== '/register' && !isAuthenticated) {
        next({ path: '/login' })
        Message({
            message: '请先登录！',
            type: "warning",
        });
    } else next()
})

export default router;