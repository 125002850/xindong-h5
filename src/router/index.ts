import { createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import wx from 'weixin-js-sdk'
import useUserStore from '~/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_PATH),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { refreshToken, getUserInfo, getShopOptions } = useUserStore()
  const token = refreshToken()
  if (!token) {
    wx.miniProgram.navigateTo({
      url: '/pages/login/index',
    })
    return
  }

  await Promise.all([getUserInfo(), getShopOptions()])

  next()
})

export default router
