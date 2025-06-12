<template>
  <div class="flex flex-col bg-white!">
    <Calendar :leaves="leaves" :min-date="mixDate" :max-date="maxDate" @update:pages="handleUpdatePages" />
    <FloatActionButton v-if="isStaff && canLeave" ref="floatActionButtonRef" @success="getLeaveList" />
  </div>
</template>

<script setup lang="ts">
import type { Page } from 'v-calendar/dist/types/src/utils/page'
import type { Biz } from '~/api'
import dayjs from 'dayjs'
import { ScheduleContextKey } from '@/composables/provide'
import Calendar from '@/views/schedule/Calendar.vue'
import FloatActionButton from '@/views/schedule/FloatActionButton.vue'
import { fetchLeaveList } from '~/api/modules/biz'
import { useShopId } from '~/composables/shopData'
import useUserStore from '~/stores/user'

const userStore = useUserStore()
const { isStaff } = storeToRefs(userStore)

const leaves = ref<Biz.LeaveVo[]>([])

const currentDate = ref(dayjs())

const canLeave = ref(false)
const floatActionButtonRef = useTemplateRef<InstanceType<typeof FloatActionButton>>('floatActionButtonRef')

const mixDate = dayjs().format('YYYY-MM')
const maxDate = dayjs().add(1, 'month').endOf('month').format('YYYY-MM-DD')

const computedShopId = useShopId()

async function getLeaveList() {
  const [res1, res2] = await Promise.all([
    fetchLeaveList(currentDate.value.format('YYYYMM'), computedShopId.value!),
    fetchLeaveList(currentDate.value.add(1, 'month').format('YYYYMM'), computedShopId.value!),
  ])
  leaves.value = [...(res1?.data ?? []), ...(res2?.data ?? [])]
  console.log(leaves.value)
}

function handleUpdatePages(pages: Page[]) {
  const pageDate = dayjs(pages?.[0]?.id)

  if (pageDate.isSame(currentDate.value, 'month') || pageDate.isSame(currentDate.value.add(1, 'month'), 'month')) {
    canLeave.value = true
  } else {
    canLeave.value = false
  }
}

provide(ScheduleContextKey, {
  leaves,
  getLeaveList,
  openLeave: (date?: string) => {
    floatActionButtonRef.value?.open(date)
  },
})

onMounted(() => {
  Promise.all([getLeaveList()])
})
</script>
