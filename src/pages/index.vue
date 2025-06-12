<template>
  <div class="flex flex-col h-screen w-screen p-16px bg-[linear-gradient(to_bottom_right,#d78be4,#fcc4dc)]!">
    <div class="text-white text-center mt-40px text-24px fw-500">心动屋日历</div>
    <div class="flex flex-wrap gap-12px mt-30px">
      <div
        v-for="(menu, idx) in menus"
        :key="menu.name"
        class="flex flex-col justify-center items-center w-165px h-165px rounded-8px"
        :style="{ background: menu.color }"
        @click="menu.click"
      >
        <div class="w-50px h-50px mb-10px menu-icon" :class="`menu-icon-${idx}`" />
        <div class="text-white text-16px fw-500">{{ menu.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuIcon from '@/assets/menu-icons.webp'
import router from '~/router'
import useUserStore from '~/stores/user'

interface Menu {
  name: string
  icon: string
  color: string
  click: AnyFn
}

const { isAdmin, isSuperAdmin } = storeToRefs(useUserStore())

const menus = computed<Menu[]>(() => [
  {
    name: '我要请假',
    icon: MenuIcon,
    color: '#54bbdb',
    click: () => {
      router.push('/schedule')
    },
  },
  {
    name: '请假审批',
    icon: MenuIcon,
    color: '#ff7b39',
    hidden: !isSuperAdmin.value || !isAdmin.value,
    click: () => {
      router.push('/approval')
    },
  },
  {
    name: '模板配置',
    icon: MenuIcon,
    color: '#3cc399',
    hidden: !isSuperAdmin.value || !isAdmin.value,
    click: () => {
      router.push('/templates')
    },
  },
  {
    name: '人员管理',
    icon: MenuIcon,
    color: '#9827cf',
    hidden: !isSuperAdmin.value,
    click: () => {
      router.push('/staff')
    },
  },
])
</script>

<style lang="scss" scoped>
.menu-icon {
  background-image: url('@/assets/menu-icons.webp');
  background-size: 100px 100px;
  background-repeat: no-repeat;
  &-0 {
    background-position: 0 0;
  }
  &-1 {
    background-position: -50px 0;
  }
  &-2 {
    background-position: -50px -50px;
  }
  &-3 {
    background-position: 0 -50px;
  }
}
</style>
