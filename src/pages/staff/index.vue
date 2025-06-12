<template>
  <div class="bg-white! box-border w-full mx-auto rounded-8px shadow-[0_0_10px_0_#f8f8f8]">
    <div class="ml-12px my-16px text-22px font-bold lh-30px">申请人员</div>
    <div class="flex flex-col gap-10px">
      <StaffItem v-for="item in applyUsers" :key="item.id" :is-approval="true" :user="item" @update="handleUpdate" />
    </div>
    <div class="ml-12px my-16px text-22px font-bold lh-30px">已通过人员</div>
    <div class="flex flex-col gap-10px">
      <StaffItem v-for="item in users" :key="item.id" :user="item" @update="handleUpdate" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { User } from '~/api/interfaces'
import { fetchApplyUsers, fetchUsers } from '@/api/modules/user'
import StaffItem from '@/views/staff/StaffItem.vue'
import { DEFAULT_PAGE } from '~/api/interfaces'

const users = ref<User.Vo[]>([])
const applyUsers = ref<User.Vo[]>([])

onMounted(() => {
  handleUpdate()
})

async function handleUpdate() {
  await Promise.all([getUsers(), getApplyUsers()])
  console.log(applyUsers.value, users.value)
}

function getUsers() {
  fetchUsers().then(({ data }) => {
    users.value = data?.list ?? []
  })
}

function getApplyUsers() {
  fetchApplyUsers({ ...DEFAULT_PAGE, status: '0' }).then(({ data }) => {
    applyUsers.value = data?.list ?? []
  })
}
</script>
