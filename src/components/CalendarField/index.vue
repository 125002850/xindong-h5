<template>
  <VDatePicker v-model="date">
    <template #default="{ togglePopover }">
      <van-field v-model="modelValue" v-bind="$attrs" is-link readonly name="calendar" placeholder="点击选择日期" @click="togglePopover"> </van-field>
    </template>
  </VDatePicker>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'

const modelValue = defineModel<string>()

const date = computed({
  get() {
    return dayjs(modelValue.value).toString()
  },
  set(val) {
    modelValue.value = dayjs(val).format('YYYY-MM-DD')
  },
})
</script>

<style scoped lang="scss"></style>
