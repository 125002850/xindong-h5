import type { Login, Option } from '@/api'
import wx from 'weixin-js-sdk'
import { fetchShopDropList, fetchUserLeaveCount } from '~/api/modules/biz'
import { fetchLoginPost } from '~/api/modules/user'
import { RoleEnum } from '~/enums'

interface LeaveDetailData {
  leaveCount: number
  leaveRest: number
  revokeCount: number
  revokeRest: number
}

const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userInfo = ref<Login.ResLogin>({})

    const refreshToken = () => {
      const { token: _token } = useUrlSearchParams<{ token?: string }>()
      if (_token) {
        token.value = _token
      }

      return token.value
    }

    const getUserInfo = async () => {
      const { data } = await fetchLoginPost({ openid: token.value })
      userInfo.value = data
    }

    const logout = () => {
      wx.miniProgram.navigateTo({
        url: '/pages/login/index',
      })
    }

    const isStaff = computed(() => {
      return userInfo.value.userType === RoleEnum.staff
    })

    const isAdmin = computed(() => {
      return userInfo.value.userType === RoleEnum.admin
    })

    const isSuperAdmin = computed(() => {
      return userInfo.value.userType === RoleEnum.superAdmin
    })

    const shopId = computed(() => {
      return userInfo.value.shopId
    })

    const shopOptions: Ref<Option[]> = ref([])

    const shopName = computed(() => {
      return shopOptions.value.find(item => item.value === shopId.value)?.label
    })

    const getShopOptions = async () => {
      const { data } = await fetchShopDropList()
      shopOptions.value = data?.map(item => ({ label: item.shopName, value: item.id }))
    }

    const leaveDetailData = ref<LeaveDetailData>({
      leaveCount: 0,
      leaveRest: 0,
      revokeCount: 0,
      revokeRest: 0,
    })

    async function getLeaveDetailData(date: string) {
      if (!isStaff.value) return
      const rsp = await fetchUserLeaveCount(date, shopId.value!)
      const leaveCount = rsp?.data?.find(item => item.status === 'LEAVE')
      const revokeCount = rsp?.data?.find(item => item.status === 'WITHDRAW')

      leaveDetailData.value.leaveCount = leaveCount?.num ?? 0
      leaveDetailData.value.leaveRest = leaveCount?.remainingTotal ?? 0
      leaveDetailData.value.revokeCount = revokeCount?.num ?? 0
      leaveDetailData.value.revokeRest = revokeCount?.remainingTotal ?? 0
    }

    return {
      token,
      refreshToken,
      userInfo,
      getUserInfo,
      logout,
      isStaff,
      isAdmin,
      isSuperAdmin,
      shopName,
      shopId,
      shopOptions,
      getShopOptions,
      leaveDetailData,
      getLeaveDetailData,
    }
  },
  {
    persist: {
      enabled: true,
    },
  },
)

export default useUserStore
