<template>
  <div class="flex items-center h-62px van-hairline--bottom px-12px">
    <van-image :src="user.picture" class="w-40px h-40px rounded-50% overflow-hidden" />
    <div class="flex flex-col flex-1 justify-between ml-12px h-36px">
      <div class="text-15px font-bold">{{ user.username }}</div>
      <div class="flex items-center gap-10px">
        <div class="text-12px text-gray-500">{{ RoleMap[user.userType as unknown as RoleEnum] }}</div>
        <div v-if="!userSuperAdmin" class="text-12px text-gray-500">{{ shopName }}</div>
      </div>
    </div>
    <div class="flex-shrink-0 flex items-center gap-6px">
      <van-button v-if="isApproval" icon="success" :class="buttonStyle" class="c-green-500! bg-#a2ffc8ab!" @click="() => handlePass()"> </van-button>
      <van-button
        v-if="isApproval || userStaff || (isSuperAdmin && !userSuperAdmin)"
        icon="cross"
        :class="buttonStyle"
        class="c-red-500! bg-#ffc8c8ab!"
        @click="() => (isApproval ? handleReject() : handleDelete())"
      >
      </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { User } from '~/api/interfaces'
import { showNotify } from 'vant'
import { fetchApprovalUser, fetchUserDelete } from '~/api/modules/user'
import { ApprovalStatusEnum, RoleEnum, RoleMap } from '~/enums'
import useUserStore from '~/stores/user'

const { user, isApproval = false } = defineProps<{
  user: User.Vo
  isApproval?: boolean
}>()

const emits = defineEmits<{ update: [] }>()

const { shopOptions, isSuperAdmin } = storeToRefs(useUserStore())

const buttonStyle = ['flex', 'items-center', 'justify-center', 'p-4px!', 'w-52px!', 'h-30px!', 'text-white!', 'border-none!']

const userSuperAdmin = computed(() => {
  return (user.userType as unknown as RoleEnum) === RoleEnum.superAdmin
})

const userStaff = computed(() => {
  return (user.userType as unknown as RoleEnum) === RoleEnum.staff
})

const shopName = computed(() => shopOptions.value.find(item => item.value === user.shopId)?.label)

async function handlePass() {
  await showConfirmDialog({
    title: '确定通过该用户吗？',
    message: '通过后该用户将可以登录系统',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  await fetchApprovalUser({
    status: ApprovalStatusEnum.pass,
    openid: user.openid,
  })
  showNotify({
    message: '通过成功',
    type: 'success',
  })
  emits('update')
}

async function handleReject() {
  await showConfirmDialog({
    title: '确定拒绝该用户吗？',
    message: '拒绝后该用户将无法登录系统',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })

  await fetchApprovalUser({
    status: ApprovalStatusEnum.reject,
    openid: user.openid,
  })

  showNotify({
    message: '已拒绝该用户申请',
    type: 'warning',
  })
  emits('update')
}

async function handleDelete() {
  await showConfirmDialog({
    title: '确定删除该员工吗?',
    message: '删除该员工后，以往数据将会清空，且无法登录系统',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })

  await fetchUserDelete(user.openid)

  showNotify({
    message: '已删除该员工',
    type: 'warning',
  })
  emits('update')
}
</script>
