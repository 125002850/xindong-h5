<template>
  <div class="custom-calendar">
    <VCalendar v-bind="$attrs" :attributes="attributesRef" expanded trim-weeks title-position="left" borderless>
      <template #header-title="{ title }">
        <div class="flex items-center justify-between">
          <div>{{ title }}</div>
          <div class="ml-20px">{{ shopName }}</div>
        </div>
      </template>
      <template #day-content="{ day, attributes }">
        <DateItem :day="day" :attributes="attributes" />
      </template>
    </VCalendar>
  </div>
</template>

<script setup lang="ts">
import type { Biz } from '~/api'
import useUserStore from '~/stores/user'
import DateItem from './DateItem.vue'

const { leaves } = defineProps<{ leaves: Biz.LeaveVo[] }>()

const { userInfo, shopName } = storeToRefs(useUserStore())

const attributesRef = computed(() =>
  leaves.map((leave) => {
    return {
      key: leave.id,
      dates: leave.date,
      customData: {
        username: leave.username,
        status: leave.status,
        isCurrentUser: leave.username === userInfo.value?.username,
        id: leave.id,
      },
    }
  }),
)
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0px;
}

::-webkit-scrollbar-track {
  display: none;
}

.custom-calendar {
  :deep(.vc-container) {
    --day-border: 0.5px solid #ccc;
    --day-border-highlight: 0.5px solid #ccc;
    --day-width: calc(100% / 7);
    --day-height: 100px;
    --weekday-bg: transparent;
    --vc-header-arrow-hover-bg: #ffd4d9;

    border-radius: 0;
    width: 100%;

    & .vc-header {
      margin-top: 0;
      padding: 20px 7px;
      box-sizing: content-box;
      background: linear-gradient(to bottom, #d78be4, #fcc4dc);
      .vc-title-wrapper {
        position: relative;
      }
      .vc-title,
      .vc-arrow {
        color: white;
      }
    }
    & .vc-weeks {
      padding: 0;
    }
    & .vc-weekdays {
      padding-bottom: 10px;
      background: linear-gradient(to bottom, #fcc4dc, #fae4ed);
      border-radius: 0 0 20px 20px;
    }
    & .vc-weekday {
      background-color: var(--weekday-bg);
      border-bottom: var(--weekday-border);
      border-top: var(--weekday-border);
      padding: 5px 0;
      color: white !important;
    }
    & .vc-day {
      text-align: left;
      height: var(--day-height);
      min-width: var(--day-width);
      background-color: white;
      box-sizing: border-box;
      &.weekday-1,
      &.weekday-7 {
        // background-color: #eff8ff;
      }
      &:not(.on-bottom) {
        border-bottom: var(--day-border);
        &.weekday-1 {
          border-bottom: var(--day-border-highlight);
        }
      }
      &:not(.on-right) {
        // border-right: var(--day-border);
      }

      .day-label {
        text-align: center;
        font-weight: 600;
        line-height: 32px;
      }
    }
    & .vc-day-dots {
      margin-bottom: 5px;
    }
  }
}

:deep(.vc-pane-container) {
  .is-not-in-month * {
    // opacity: 0.25;
  }
}
</style>
