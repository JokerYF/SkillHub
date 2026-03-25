<script setup lang="ts">
/**
 * Skills Intelligence Hub - Profile Page 个人中心
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import AppLayout from '@/design-system/layouts/AppLayout.vue'

const { t } = useI18n()
const userStore = useUserStore()

// 用户信息编辑状态
const isEditing = ref(false)
const editForm = ref({
  username: '',
  email: '',
})

function startEdit() {
  if (userStore.user) {
    editForm.value = {
      username: userStore.user.username,
      email: userStore.user.email,
    }
    isEditing.value = true
  }
}

function cancelEdit() {
  isEditing.value = false
}

async function saveEdit() {
  // TODO: 实现用户信息更新 API
  isEditing.value = false
}
</script>

<template>
  <AppLayout :title="t('appLayout.profile')" :show-sidebar="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-neutral-800">{{ t('appLayout.profile') }}</h1>
        <p class="text-neutral-500 mt-1">管理您的个人信息</p>
      </div>

      <!-- Profile Card -->
      <div class="bg-white rounded-lg border border-neutral-200 p-6">
        <div class="flex justify-between items-start mb-6">
          <h2 class="text-lg font-semibold text-neutral-800">基本信息</h2>
          <button
            v-if="!isEditing"
            @click="startEdit"
            class="text-sm text-brand-500 hover:text-brand-700"
          >
            编辑
          </button>
        </div>

        <!-- View Mode -->
        <div v-if="!isEditing && userStore.user" class="space-y-4">
          <div class="flex items-center">
            <div class="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center">
              <span class="text-brand-600 font-bold text-2xl">
                {{ userStore.user.username?.charAt(0).toUpperCase() || 'U' }}
              </span>
            </div>
            <div class="ml-6">
              <h3 class="text-xl font-semibold text-neutral-800">{{ userStore.user.username }}</h3>
              <p class="text-neutral-500">{{ userStore.user.email }}</p>
            </div>
          </div>

          <div class="border-t border-neutral-200 pt-4 mt-4">
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm text-neutral-500">用户名</dt>
                <dd class="mt-1 text-neutral-800">{{ userStore.user.username }}</dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">邮箱</dt>
                <dd class="mt-1 text-neutral-800">{{ userStore.user.email }}</dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">角色</dt>
                <dd class="mt-1">
                  <span class="px-2 py-1 bg-brand-100 text-brand-700 rounded text-sm font-medium">
                    {{ userStore.user.role || 'user' }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm text-neutral-500">账户状态</dt>
                <dd class="mt-1">
                  <span class="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                    {{ t('users.active') }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else-if="isEditing" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">用户名</label>
            <input
              v-model="editForm.username"
              type="text"
              class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">邮箱</label>
            <input
              v-model="editForm.email"
              type="email"
              class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div class="flex gap-3 pt-4">
            <button
              @click="cancelEdit"
              class="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800"
            >
              取消
            </button>
            <button
              @click="saveEdit"
              class="px-4 py-2 bg-brand-500 text-white rounded-md text-sm hover:bg-brand-600"
            >
              保存
            </button>
          </div>
        </div>
      </div>

      <!-- Security Card -->
      <div class="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 class="text-lg font-semibold text-neutral-800 mb-4">安全设置</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center py-3 border-b border-neutral-100">
            <div>
              <p class="font-medium text-neutral-800">密码</p>
              <p class="text-sm text-neutral-500">上次修改: 未知</p>
            </div>
            <button class="text-sm text-brand-500 hover:text-brand-700">
              修改密码
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>