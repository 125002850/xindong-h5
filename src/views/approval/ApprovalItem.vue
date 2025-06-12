<template>
  <div class="flex items-center h-62px van-hairline--bottom px-12px">
    <!-- <van-image :src="data.picture" class="w-40px h-40px rounded-50% overflow-hidden" /> -->
    <div class="flex flex-col flex-1 justify-between ml-12px h-36px">
      <div class="flex items-end gap-10px text-15px font-bold">
        <div>{{ data.username }}</div>
        <div class="text-12px">{{ shopName }}</div>
        <div class="c-red-400 text-12px">{{ data.date }}</div>
      </div>
      <div class="flex items-center gap-10px text-12px text-gray-500">
        {{ data.applyContent }}
      </div>
    </div>
    <div class="flex-shrink-0 flex items-center gap-6px">
      <van-button icon="success" :class="buttonStyle" class="c-green-500! bg-#a2ffc8ab!" @click="handlePass"> </van-button>
      <van-button icon="cross" :class="buttonStyle" class="c-red-500! bg-#ffc8c8ab!" @click="handleReject"> </van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Biz } from '~/api/interfaces'
import { showNotify } from 'vant'
import { fetchLeaveApproval } from '~/api/modules/biz'
import { ApprovalStatusEnum } from '~/enums'
import useUserStore from '~/stores/user'

const { data } = defineProps<{
  data: Biz.LeaveVo
}>()

const emits = defineEmits<{ approval: [] }>()

const { shopOptions } = storeToRefs(useUserStore())

const buttonStyle = ['flex', 'items-center', 'justify-center', 'p-4px!', 'w-52px!', 'h-30px!', 'text-white!', 'border-none!']

const shopName = computed(() => shopOptions.value.find(item => item.value === data.shopId)?.label)

async function handlePass() {
  await showConfirmDialog({
    title: '确定通过该用户吗？',
    message: '本日假期额度已满，通过后该用户将额外请假',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })

  await fetchLeaveApproval({
    status: ApprovalStatusEnum.pass,
    id: data.id,
  })
  showNotify({
    message: '通过成功',
    type: 'success',
  })
  emits('approval')
}

async function handleReject() {
  await showConfirmDialog({
    title: '确定拒绝该用户吗？',
    message: '拒绝后该用户的请假申请将不通过',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
  await fetchLeaveApproval({
    status: ApprovalStatusEnum.reject,
    id: data.id,
  })
  showNotify({
    message: '已拒绝该用户请假申请',
    type: 'warning',
  })
  emits('approval')
}
</script>
