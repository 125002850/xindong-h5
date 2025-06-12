<template>
  <div class="flex flex-col h-screen w-screen">
    <van-form class="flex-1" label-align="left">
      <div v-for="item in rules" :key="item.day">
        <van-field
          v-model="item.maxUserNum"
          :label="item.label"
          :rules="[{ required: true, message: '请输入最大人数' }]"
          class="van-hairline--bottom"
        />
      </div>
    </van-form>

    <div class="flex items-center justify-center flex-basis-55px! flex-shrink-0 bg-white shadow-[1px_2px_10px_0_#f8f8f8]">
      <van-button type="primary" class="w-320px h-30px rounded-4px" @click="handleSave">保存</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Biz } from '~/api/interfaces'
import { showNotify } from 'vant'
import router from '@/router'
import { fetchLeaveRules, fetchLeaveRulesUpdate } from '~/api/modules/biz'
import { useShopId } from '~/composables/shopData'

const { shopId: _shopId } = useUrlSearchParams<{ shopId: string }>()
useTitle('规则配置')

const computedShopId = useShopId()
const rules = ref<Biz.LeaveRuleVo[]>([])
const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

onMounted(async () => {
  const { data } = await fetchLeaveRules(computedShopId.value!)
  data.sort((a, b) => a.day - b.day)
  rules.value = data.map(item => ({
    ...item,
    label: labels[item.day - 1],
  }))
})

async function handleSave() {
  console.log(rules.value)
  const params = rules.value.map(item => ({
    days: [item.day],
    maxUserNum: item.maxUserNum,
    shopId: computedShopId.value,
  }))
  await fetchLeaveRulesUpdate(computedShopId.value!, params)
  showNotify({ message: '保存成功', type: 'success' })
  router.back()
}
</script>
