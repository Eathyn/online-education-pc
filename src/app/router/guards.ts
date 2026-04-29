import type { Router } from 'vue-router'

export function setupRouterGuards(router: Router) {
  createBeforeEachGuard(router)
}

function createBeforeEachGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    console.log(to.name)
    console.log(from.name)
    next()
  })
}
