// 此文件专门负责项目的路由

import VueRouter from "vue-router"

// 引入组件
import Login from '../views/login/Login.vue'
import Register from '../views/register/Register.vue'
import Home from '../views/home/Home.vue'
import Admin from '../views/home/Admin.vue'
// import User from '../views/user/User'
import { Message } from "element-ui"
import User from "../views/home/User.vue"
import FinishTest from '../views/home/FinishTest.vue'
import AirControllerT1 from '../views/questions/air_controller/air_controller_t1.vue'
import AirControllerT2 from '../views/questions/air_controller/air_controller_t2.vue'
import TicketsSaleT1 from '../views/questions/tickets_sale/tickets_sale_t1.vue'
import TicketsSaleT2 from '../views/questions/tickets_sale/tickets_sale_t2.vue'
import TicketsSaleT3 from '../views/questions/tickets_sale/tickets_sale_t3.vue'
import CatFeedT1 from '../views/questions/cat_feed/cat_feed_t1.vue'
import CatFeedT2 from '../views/questions/cat_feed/cat_feed_t2.vue'
import BigAirControllerT1 from "../views/questions/big_air_controller/big_air_controller_t1.vue"
import BigAirControllerT2 from "../views/questions/big_air_controller/big_air_controller_t2.vue"
import CameraControllerT1 from "../views/questions/camera_controller/camera_controller_t1.vue"
import CameraControllerT2 from "../views/questions/camera_controller/camera_controller_t2.vue"
import CoffeeMachineT1 from "../views/questions/coffee_machine/coffee_machine_t1.vue"
import CoffeeMachineT2 from "../views/questions/coffee_machine/coffee_machine_t2.vue"
import FlashlightT1 from "../views/questions/flashlight/flashlight_t1.vue"
import FlashlightT2 from "../views/questions/flashlight/flashlight_t2.vue"
import FlowerGardenT1 from "../views/questions/flower_garden/flower_garden_t1.vue"
import FlowerGardenT2 from "../views/questions/flower_garden/flower_garden_t2.vue"
import FruitTeaT1 from "../views/questions/fruit_tea/fruit_tea_t1.vue"
import FruitTeaT2 from "../views/questions/fruit_tea/fruit_tea_t2.vue"
import PerfumeMakerT1 from "../views/questions/perfume_maker/perfume_maker_t1.vue"
import PerfumeMakerT2 from "../views/questions/perfume_maker/perfume_maker_t2.vue"
import ProjectionControllerT1 from "../views/questions/projection_controller/projection_controller_t1.vue"
import ProjectionControllerT2 from "../views/questions/projection_controller/projection_controller_t2.vue"
import RiceCookerT1 from "../views/questions/rice_cooker/rice_cooker_t1.vue"
import RiceCookerT2 from "../views/questions/rice_cooker/rice_cooker_t2.vue"
import VideoPlayerT1 from "../views/questions/video_player/video_player_t1.vue"
import VideoPlayerT2 from "../views/questions/video_player/video_player_t2.vue"
import WaterDispenserT1 from "../views/questions/water_dispenser/water_dispenser_t1.vue"
import WaterDispenserT2 from "../views/questions/water_dispenser/water_dispenser_t2.vue"

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
        },
        {
            path: '/questions/cat_feed/cat_feed_t1',
            component: CatFeedT1
        },
        {
            path: '/questions/cat_feed/cat_feed_t2',
            component: CatFeedT2
        },
        {
            path: '/questions/big_air_controller/big_air_controller_t1',
            component: BigAirControllerT1
        },
        {
            path: '/questions/big_air_controller/big_air_controller_t2',
            component: BigAirControllerT2
        },
        {
            path: '/questions/camera_controller/camera_controller_t1',
            component: CameraControllerT1
        },
        {
            path: '/questions/camera_controller/camera_controller_t2',
            component: CameraControllerT2
        },
        {
            path: '/questions/coffee_machine/coffee_machine_t1',
            component: CoffeeMachineT1
        },
        {
            path: '/questions/coffee_machine/coffee_machine_t2',
            component: CoffeeMachineT2
        },
        {
            path: '/questions/flashlight/flashlight_t1',
            component: FlashlightT1
        },
        {
            path: '/questions/flashlight/flashlight_t2',
            component: FlashlightT2
        },
        {
            path: '/questions/flower_garden/flower_garden_t1',
            component: FlowerGardenT1
        },
        {
            path: '/questions/flower_garden/flower_garden_t2',
            component: FlowerGardenT2
        },
        {
            path: '/questions/fruit_tea/fruit_tea_t1',
            component: FruitTeaT1
        },
        {
            path: '/questions/fruit_tea_t2',
            component: FruitTeaT2
        },
        {
            path: '/questions/perfume_maker/perfume_maker_t1',
            component: PerfumeMakerT1
        },
        {
            path: '/questions/perfume_maker/perfume_maker_t2',
            component: PerfumeMakerT2
        },
        {
            path: '/questions/projection_controller/projection_controller_t1',
            component: ProjectionControllerT1
        },
        {
            path: '/questions/projection_controller/projection_controller_t2',
            component: ProjectionControllerT2
        },
        {
            path: '/questions/rice_cooker/rice_cooker_t1',
            component: RiceCookerT1
        },
        {
            path: '/questions/rice_cooker/rice_cooker_t2',
            component: RiceCookerT2
        },
        {
            path: '/questions/video_player/video_player_t1',
            component: VideoPlayerT1
        },
        {
            path: '/questions/video_player/video_player_t2',
            component: VideoPlayerT2
        },
        {
            path: '/questions/water_dispenser/water_dispenser_t1',
            component: WaterDispenserT1
        },
        {
            path: '/questions/water_dispenser/water_dispenser_t2',
            component: WaterDispenserT2
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