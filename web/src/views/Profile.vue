<script setup lang="ts">
/**
 * Skills Intelligence Hub - Profile Page 个人中心
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { updateUser, type UpdateUserRequest } from '@/api/users'
import AppLayout from '@/design-system/layouts/AppLayout.vue'

const { t } = useI18n()
const userStore = useUserStore()

// 用户信息编辑状态
const isEditing = ref(false)
const editForm = ref({
  username: '',
  email: '',
})
const isSaving = ref(false)
const editError = ref('')

// 修改密码弹窗状态
const showPasswordModal = ref(false)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const isChangingPassword = ref(false)
const passwordError = ref('')

function startEdit() {
  if (userStore.user) {
    editForm.value = {
      username: userStore.user.username,
      email: userStore.user.email,
    }
    editError.value = ''
    isEditing.value = true
  }
}

function cancelEdit() {
  isEditing.value = false
  editError.value = ''
}

async function saveEdit() {
  if (!userStore.user) return

  // 验证输入
  if (!editForm.value.username.trim()) {
    editError.value = '用户名不能为空'
    return
  }
  if (!editForm.value.email.trim() || !editForm.value.email.includes('@')) {
    editError.value = '请输入有效的邮箱地址'
    return
  }

  isSaving.value = true
  editError.value = ''

  try {
    const payload: UpdateUserRequest = {
      username: editForm.value.username.trim(),
      email: editForm.value.email.trim(),
    }

    await updateUser(userStore.user.id, payload)

    // 更新本地用户信息
    await userStore.fetchUser()

    isEditing.value = false
  } catch (e: any) {
    editError.value = e.response?.data?.error || '保存失败，请重试'
  } finally {
    isSaving.value = false
  }
}

function openPasswordModal() {
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
  passwordError.value = ''
  showPasswordModal.value = true
}

function closePasswordModal() {
  showPasswordModal.value = false
  passwordError.value = ''
}

async function changePassword() {
  // 验证输入
  if (!passwordForm.value.oldPassword) {
    passwordError.value = '请输入当前密码'
    return
  }
  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = '新密码至少需要 8 个字符'
    return
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = '两次输入的新密码不一致'
    return
  }

  isChangingPassword.value = true
  passwordError.value = ''

  try {
    // TODO: 调用后端修改密码 API
    // await changePassword({
    //   old_password: passwordForm.value.oldPassword,
    //   new_password: passwordForm.value.newPassword,
    // })

    // 临时提示：后端 API 未实现
    passwordError.value = '修改密码功能暂未实现，请联系后端开发'

    // 成功后关闭弹窗
    // showPasswordModal.value = false
  } catch (e: any) {
    passwordError.value = e.response?.data?.error || '修改密码失败'
  } finally {
    isChangingPassword.value = false
  }
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
          <!-- Error Message -->
          <div v-if="editError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ editError }}
          </div>

          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">用户名</label>
            <input
              v-model="editForm.username"
              type="text"
              class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              :disabled="isSaving"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 mb-1">邮箱</label>
            <input
              v-model="editForm.email"
              type="email"
              class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              :disabled="isSaving"
            />
          </div>
          <div class="flex gap-3 pt-4">
            <button
              @click="cancelEdit"
              class="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800"
              :disabled="isSaving"
            >
              取消
            </button>
            <button
              @click="saveEdit"
              class="px-4 py-2 bg-brand-500 text-white rounded-md text-sm hover:bg-brand-600 disabled:opacity-50"
              :disabled="isSaving"
            >
              {{ isSaving ? '保存中...' : '保存' }}
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
            <button
              @click="openPasswordModal"
              class="text-sm text-brand-500 hover:text-brand-700"
            >
              修改密码
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Change Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-neutral-800 mb-4">修改密码</h3>

          <!-- Error Message -->
          <div v-if="passwordError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {{ passwordError }}
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">当前密码</label>
              <input
                v-model="passwordForm.oldPassword"
                type="password"
                class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                :disabled="isChangingPassword"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">新密码</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                :disabled="isChangingPassword"
                placeholder="至少 8 个字符"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 mb-1">确认新密码</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                :disabled="isChangingPassword"
              />
            </div>
          </div>

          <div class="flex gap-3 pt-6">
            <button
              @click="closePasswordModal"
              class="flex-1 px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 border border-neutral-300 rounded-md"
              :disabled="isChangingPassword"
            >
              取消
            </button>
            <button
              @click="changePassword"
              class="flex-1 px-4 py-2 bg-brand-500 text-white rounded-md text-sm hover:bg-brand-600 disabled:opacity-50"
              :disabled="isChangingPassword"
            >
              {{ isChangingPassword ? '修改中...' : '确认修改' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>