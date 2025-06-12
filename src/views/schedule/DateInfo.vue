<template>
  <div
    class="flex items-center max-w-full text-10px leading-tight rounded-sm mt-0"
    :class="getCustomClass"
    :style="{
      '--dot-color': colors[idx],
      '&:before': {
        backgroundColor: 'var(--dot-color)',
      },
    }"
  >
    <div class="van-ellipsis">{{ idx === maxCount ? `...` : name }}</div>
  </div>
</template>

<script lang="tsx" setup>
const {
  idx,
  restCount = 0,
  customClass = [],
  maxCount = 4,
} = defineProps<{
  name: string
  idx: number
  customClass?: string[]
  restCount?: number
  maxCount?: number
}>()

const colors = ['#ff4646', '#fcc4dc', '#d78be4', '#ff9900', '#0099ff', '#9900ff', '#ff00ff']

const showLabel = computed(() => {
  return idx >= maxCount && restCount > 0
})

const getCustomClass = computed(() => {
  return [customClass, showLabel.value ? ['c-#000  px-6px lh-14px rounded-1px'] : ['dot-item']]
})
</script>

<style lang="scss" scoped>
.dot-item {
  &:before {
    content: '';
    display: inline-block;
    flex-shrink: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin-right: 1px;
    background-color: var(--dot-color);
  }
}
</style>
