<template>
  <div
    class="fixed bottom-52px right-24px z-999 flex items-center justify-center w-55px h-55px bg-#d78be4 rounded-full shadow-[0_2px_8px_8px_rgba(215,139,228,0.15)]"
    @click="handleClick"
  >
    <van-icon name="plus" class="c-white text-20px" />
  </div>
  <van-popup
    v-model:show="showPopup"
    position="bottom"
    round
    :style="{ display: 'flex', flexDirection: 'column', height: '62%', padding: '10px 2px' }"
    teleport="body"
    @close="handleClose"
  >
    <van-form label-align="top">
      <CalendarField v-model="formData.applyDate" label="请假日期" />
      <van-field v-model="formData.applyContent" label="请假原因" placeholder="请输入请假原因" />
      <div class="ml-12px my-12px c-#858877">
        <van-icon name="question-o" class="mr-2px" />本月已请假<span class="mx-4px">{{ leaveDetailData.leaveCount }}</span>天，还剩<span class="mx-4px c-red-500">{{ leaveDetailData.leaveRest }}</span>天
      </div>
    </van-form>
    <van-button
      class="van-safe-area-bottom mt-auto! mx-auto! w-320px! rounded-8px! bg-[linear-gradient(to_bottom_right,#fcc4dc,#d78be4)]! color-white! border-none!"
      block
      @click="handleSubmit"
    >
      提交
    </van-button>
  </van-popup>
</template>

<script setup lang="ts">
import type { Biz } from '~/api'
import dayjs from 'dayjs'
import { showNotify } from 'vant'
import CalendarField from '@/components/CalendarField/index.vue'
import { fetchLeaveSubmit } from '~/api/modules/biz'
import useUserStore from '~/stores/user'

const emits = defineEmits(['success'])
const showPopup = ref(false)
const userStore = useUserStore()
const { shopId, leaveDetailData } = storeToRefs(userStore)

const DefaultFormData: Biz.submitDto = {
  applyDate: dayjs().format('YYYY-MM-DD'),
  applyContent: '',
  shopId: shopId.value!,
}

const formData = ref<Biz.submitDto>({
  ...DefaultFormData,
})

function handleClick() {
  open()
}

async function handleSubmit() {
  console.log(formData.value)
  await fetchLeaveSubmit(formData.value)
  showPopup.value = false

  showNotify({ message: '请假已申请', type: 'success' })
  emits('success')
  handleClose()
}

function handleClose() {
  formData.value = {
    ...DefaultFormData,
  }
}

function open(date = dayjs().format('YYYY-MM-DD')) {
  showPopup.value = true
  formData.value.applyDate = date
}

watch(
  () => formData.value.applyDate,
  (value) => {
    userStore.getLeaveDetailData(dayjs(value).format('YYYYMM'))
  },
  { immediate: true },
)

defineExpose({
  open,
})
</script>
