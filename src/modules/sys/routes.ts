import { type RouteRecordRaw } from 'vue-router'

// 捕获所有未匹配的路由，通常用于 404 页面
export const notMatchRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/pages/sys/NotFound.vue'),
}

const systemRoutes: RouteRecordRaw[] = []

export default systemRoutes
