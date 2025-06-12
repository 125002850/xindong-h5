<template>
  <div class="flex flex-col h-full z-10 overflow-hidden" @click="handleClick">
    <span class="day-label text-sm h-28px" :class="color">{{ day.day }}</span>
    <div class="flex flex-col items-center flex-grow overflow-hidden gap-1px">
      <template v-for="(attr, idx) in attributes.slice(0, 5)" :key="attr.key">
        <DateInfo :name="attr.customData?.username ?? ''" :idx="idx" :custom-class="attr.customData?.class" :rest-count="attributes.length - 4" />
      </template>
    </div>
  </div>
  <DateContentDialog v-if="show" v-model="show" :day="day" :attributes="attributes" />
</template>

<script setup lang="tsx">
import type { Attribute } from 'v-calendar/dist/types/src/utils/attribute'
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page'
import { ApprovalStatusEnum } from '~/enums'
import DateContentDialog from './DateContentDialog.vue'
import DateInfo from './DateInfo.vue'

const { attributes } = defineProps<{
  day: CalendarDay
  attributes: Attribute[]
}>()

const show = ref(false)

const isCurrentUser = computed(() => {
  return attributes.find(attr => attr.customData?.isCurrentUser)
})

const color = computed(() => {
  if (!isCurrentUser.value) return 'text-gray-900'
  if (isCurrentUser.value.customData?.status === ApprovalStatusEnum.pass) return 'text-green-500'
  if (isCurrentUser.value.customData?.status === ApprovalStatusEnum.reject) return 'text-red-500'
  return 'text-orange-300'
})

function handleClick() {
  show.value = true
}
</script>
