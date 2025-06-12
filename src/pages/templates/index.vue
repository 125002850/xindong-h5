<template>
  <div class="flex flex-col h-screen w-screen">
    <div class="flex flex-col flex-1 p-12px gap-16px h-0 overflow-y-auto">
      <template v-for="item in 2" :key="item">
        <div class="w-350px mx-auto rounded-6px p-16px bg-white">
          <div class="flex items-center text-16px font-bold">
            <div>{{ item === 1 ? '本月模板' : '次月模板' }}</div>
            <van-button class="ml-12px! h-30px!" type="warning" @click="handleCreateTemplate(item === 2)">生成模板</van-button>
            <van-button class="ml-12px! h-30px!" type="danger" @click="handleDeleteTemplate(item === 2)">删除模板</van-button>
          </div>
          <div class="flex align-items center mt-12px gap-20px">
            <VCalendar
              :min-date="item === 1 ? currentMonth[0] : nextMonth[0]"
              :max-date="item === 1 ? currentMonth[1] : nextMonth[1]"
              :attributes="item === 1 ? currentTemplate : nextTemplate"
              expanded
              title-position="left"
            >
              <template #day-content="{ day, attributes }">
                <div class="text-center fw-bold">{{ day.day }}</div>
                <template v-for="attr in attributes" :key="attr.key">
                  <div class="w-16px h-16px lh-16px mt-2px mx-auto text-11px text-center bg-red-400 text-white rounded-2px rounded-50%">
                    {{ attr.customData?.maxUserNum }}
                  </div>
                </template>
              </template>
            </VCalendar>
          </div>
        </div>
      </template>
    </div>

    <div class="flex items-center justify-center flex-basis-55px! flex-shrink-0 bg-white shadow-[1px_2px_10px_0_#f8f8f8]">
      <van-button type="primary" class="w-350px h-30px" @click="handleConfigRule">配置规则</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Biz } from '~/api/interfaces'
import dayjs from 'dayjs'
import { showNotify } from 'vant'
import { fetchCreateTemplate, fetchDeleteTemplate, fetchTemplates } from '~/api/modules/biz'
import { useShopId } from '~/composables/shopData'
import router from '~/router'

useTitle('模板配置')

const currentMonth = ref([dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')])
const nextMonth = ref([dayjs().add(1, 'month').startOf('month').format('YYYY-MM-DD'), dayjs().add(1, 'month').endOf('month').format('YYYY-MM-DD')])

const templates = ref<Biz.TemplateVo[][]>([])

const computedShopId = useShopId()

const currentTemplate = computed(() =>
  templates.value[0]?.map((item) => {
    return {
      key: useId(),
      dates: dayjs(item.date.toString()).format('YYYY-MM-DD'),
      customData: {
        maxUserNum: item.maxUserNum,
      },
    }
  }),
)

const nextTemplate = computed(() =>

  templates.value[1]?.map((item) => {
    return {
      key: useId(),
      dates: dayjs(item.date.toString()).format('YYYY-MM-DD'),
      customData: {
        maxUserNum: item.maxUserNum,
      },
    }
  }),
)

function handleConfigRule() {
  router.push(`/templates/rule?shopId=${computedShopId.value}`)
}

async function handleCreateTemplate(next = false) {
  await showConfirmDialog({
    title: '警告',
    message: '确定生成模板吗？',
  })
  const params: Biz.CreateTemplateDto = {
    shopId: computedShopId.value!.toString(),
    date: next ? dayjs().add(1, 'month').format('YYYYMM') : dayjs().format('YYYYMM'),
  }
  await fetchCreateTemplate(params)
  showNotify({ message: '生成成功', type: 'success' })
  handleBatchQueryTemplate()
}

async function handleDeleteTemplate(next = false) {
  await showConfirmDialog({
    title: '警告',
    message: '确定删除模板吗？删除模版将清除当月请假数据',
  })
  const params: Biz.CreateTemplateDto = {
    shopId: computedShopId.value!.toString(),
    date: next ? dayjs().add(1, 'month').format('YYYYMM') : dayjs().format('YYYYMM'),
  }
  await fetchDeleteTemplate(params)
  showNotify({ message: '删除成功', type: 'success' })
  handleBatchQueryTemplate()
}

async function handleQueryTemplate(date: string) {
  return fetchTemplates({
    shopId: computedShopId.value!.toString(),
    date,
  })
}

async function handleBatchQueryTemplate() {
  const rsp = await Promise.all([handleQueryTemplate(dayjs().format('YYYYMM')), handleQueryTemplate(dayjs().add(1, 'month').format('YYYYMM'))])
  templates.value = rsp?.map(item => item.data)
}

onMounted(async () => {
  handleBatchQueryTemplate()
})
</script>
