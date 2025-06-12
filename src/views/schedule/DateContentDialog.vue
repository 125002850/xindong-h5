<template>
  <van-dialog
    v-model:show="show"
    :title="title"
    teleport="body"
    :show-cancel-button="canLeave"
    confirm-button-color="#ff8383"
    :confirm-button-text="canLeave ? '我要请假' : '好的'"
    cancel-button-text="取消"
    :lock-scroll="true"
    @confirm="handleLeave"
  >
    <div class="flex flex-col py-16px px-22px gap-8px">
      <template v-for="attr in attributes" :key="attr.key">
        <div class="flex items-center h-38px px-12px rounded-6px border border-#e5e7eb border-solid">
          <div class="flex items-center gap-4px">
            <span class="text-13px fw-bold">{{ attr.customData.username }}</span>
          </div>
          <div
            class="inline-flex text-11px rounded-6px px-8px py-6px ml-auto fw-bold"
            :class="getStatusStyle(attr.customData.status)"
          >
            {{ getStatusText(attr.customData.status) }}
          </div>
          <div
            v-if="attr.customData?.isCurrentUser && isSameOrAfterToday"
            class="ml-12px px-8px py-6px rounded-6px text-11px fw-bold c-#7044ef bg-#7044ef20"
            @click="handleRevoke"
          >
            撤销申请
          </div>
        </div>
      </template>
    </div>
  </van-dialog>
</template>

<script setup lang="tsx">
import type { Attribute } from 'v-calendar/dist/types/src/utils/attribute'
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page'
import dayjs from 'dayjs'
import { showNotify } from 'vant'
import { fetchLeaveRevoke } from '~/api/modules/biz'
import { ScheduleContextKey } from '~/composables/provide'
import { ApprovalStatusEnum } from '~/enums'
import useUserStore from '~/stores/user'

const props = defineProps<{
  day: CalendarDay
  attributes: Attribute[]
}>()

const { getLeaveList, openLeave } = inject(ScheduleContextKey)!

const userStore = useUserStore()
const { leaveDetailData, isSuperAdmin, isAdmin } = storeToRefs(userStore)

const show = defineModel<boolean>({ required: true, type: Boolean })
const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

console.log(props.attributes)

const dayInstance = computed(() => dayjs(props.day.date))

const title = computed(() => {
  return `${dayInstance.value.format('YYYY-MM-DD')} ${weekdays[dayInstance.value.day()]}`
})

const isSameOrAfterToday = computed(() => {
  return dayInstance.value.isSame(dayjs(), 'day') || dayInstance.value.isAfter(dayjs(), 'day')
})

const isCurrentUser = computed(() => {
  return props.attributes.find(attr => attr.customData?.isCurrentUser)
})

const canLeave = computed(() => {
  if (isAdmin.value || isSuperAdmin.value) return false
  if (!isSameOrAfterToday.value) return false
  if (!isCurrentUser.value) return true
  return isCurrentUser.value.customData?.status === 'REJECTED'
})

async function handleRevoke() {
  await userStore.getLeaveDetailData(dayInstance.value.format('YYYYMM'))
  if (leaveDetailData.value.revokeRest < 1) {
    showNotify({ message: `本月已撤销请假申请${leaveDetailData.value.revokeCount}次，不允许再次撤销` })
    return
  }
  await showConfirmDialog({ title: '撤销请假申请', message: `是否确认撤销假期申请，该月还能撤销 ${leaveDetailData.value.revokeRest}次` })
  await fetchLeaveRevoke(isCurrentUser.value?.customData?.id)
  showNotify({ message: '撤销成功', type: 'success' })
  show.value = false
  getLeaveList()
}

function handleLeave() {
  if (!canLeave.value) return
  openLeave?.(dayInstance.value.format('YYYY-MM-DD'))
}

function getStatusStyle(status: ApprovalStatusEnum) {
  if (status === ApprovalStatusEnum.pass) return 'c-green-4 bg-#d4ffe466'
  if (status === ApprovalStatusEnum.reject) return 'c-red-500 bg-#ffe6e680'
  return 'c-orange-300 bg-#fdba7429'
}

function getStatusText(status: ApprovalStatusEnum) {
  if (status === ApprovalStatusEnum.pass) return '已通过'
  if (status === ApprovalStatusEnum.reject) return '已拒绝'
  return '审批中'
}
</script>
