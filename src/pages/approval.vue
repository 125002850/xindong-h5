<template>
  <div class="bg-white! box-border w-full mx-auto rounded-8px shadow-[0_0_10px_0_#f8f8f8]">
    <div class="ml-12px my-16px text-22px font-bold lh-30px">申请人员</div>
    <div class="flex flex-col gap-10px">
      <ApprovalItem v-for="item in approvalList" :key="item.id" :data="item" @approval="getApprovalList" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Biz } from '~/api/interfaces'
import { fetchLeaveApprovalList } from '@/api/modules/biz'
import { useShopId } from '~/composables/shopData'
import ApprovalItem from '~/views/approval/ApprovalItem.vue'

useTitle('请假审批')

const computedShopId = useShopId()

const approvalList = ref<Biz.LeaveVo[]>([])

onMounted(async () => {
  await Promise.all([getApprovalList()])
})

function getApprovalList() {
  fetchLeaveApprovalList(computedShopId.value!).then(({ data }) => {
    approvalList.value = data ?? []
  })
}
</script>
