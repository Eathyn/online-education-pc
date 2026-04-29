import { createRouter, createWebHistory } from 'vue-router'
import { type RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from '@/app/router/guards.ts'
import baseRoutes from '@/app/router/routes/base.ts'
import { notMatchRoute } from '@/modules/sys/routes.ts'
import authRoutes from '@/modules/auth/routes/index.ts'
import homeRoutes from '@/modules/home/routes/index.ts'

const routes: RouteRecordRaw[] = [...baseRoutes, ...authRoutes, ...homeRoutes]

// 未匹配的路由必须在最后
routes.push(notMatchRoute)

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

setupRouterGuards(router)

export default router
