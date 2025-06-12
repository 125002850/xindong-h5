import useUserStore from '~/stores/user'

const userStore = useUserStore()
const { isSuperAdmin, shopId } = storeToRefs(userStore)

export function useShopId() {
  const { shopId: _shopId } = useUrlSearchParams<{ shopId: string }>()
  return computed(() => {
    if (isSuperAdmin.value) return _shopId
    return shopId.value
  })
}
