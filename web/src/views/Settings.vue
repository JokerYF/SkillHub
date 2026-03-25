<script setup lang="ts">
/**
 * Skills Intelligence Hub - Settings Page 设置页面
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/design-system/layouts/AppLayout.vue'

const { t } = useI18n()

// 设置状态
const settings = ref({
  language: 'zh-CN',
  theme: 'light',
  notifications: true,
})

// CLI 命令参考
const cliCommands = [
  { cmd: 'skillhub push ./my-skill', desc: '发布技能到市场' },
  { cmd: 'skillhub pull skill-slug', desc: '安装技能到项目' },
  { cmd: 'skillhub list', desc: '列出已安装的技能' },
  { cmd: 'skillhub search <keyword>', desc: '搜索技能' },
  { cmd: 'skillhub show skill-slug', desc: '查看技能详情' },
]
</script>

<template>
  <AppLayout :title="t('appLayout.settings')" :show-sidebar="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-neutral-800">{{ t('appLayout.settings') }}</h1>
        <p class="text-neutral-500 mt-1">管理应用设置和偏好</p>
      </div>

      <!-- Language Settings -->
      <div class="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 class="text-lg font-semibold text-neutral-800 mb-4">语言和地区</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium text-neutral-800">界面语言</p>
              <p class="text-sm text-neutral-500">选择您的首选语言</p>
            </div>
            <select
              v-model="settings.language"
              class="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 class="text-lg font-semibold text-neutral-800 mb-4">通知设置</h2>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium text-neutral-800">系统通知</p>
              <p class="text-sm text-neutral-500">接收技能更新和推荐通知</p>
            </div>
            <button
              @click="settings.notifications = !settings.notifications"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.notifications ? 'bg-brand-500' : 'bg-neutral-300'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- CLI Reference -->
      <div class="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 class="text-lg font-semibold text-neutral-800 mb-4">CLI 命令参考</h2>
        <div class="space-y-3">
          <div
            v-for="item in cliCommands"
            :key="item.cmd"
            class="p-3 bg-neutral-50 rounded-lg"
          >
            <code class="text-sm text-brand-600 font-mono">{{ item.cmd }}</code>
            <p class="text-sm text-neutral-500 mt-1">{{ item.desc }}</p>
          </div>
        </div>
      </div>

      <!-- About -->
      <div class="bg-white rounded-lg border border-neutral-200 p-6">
        <h2 class="text-lg font-semibold text-neutral-800 mb-4">关于</h2>
        <div class="text-sm text-neutral-500 space-y-2">
          <p>Skills Intelligence Hub v1.0.0</p>
          <p>企业级 AI 技能管理平台</p>
          <div class="flex gap-4 mt-4">
            <router-link to="/admin" class="text-brand-500 hover:text-brand-700">
              {{ t('appLayout.help') }}
            </router-link>
            <router-link to="/admin" class="text-brand-500 hover:text-brand-700">
              {{ t('appLayout.privacy') }}
            </router-link>
            <router-link to="/admin" class="text-brand-500 hover:text-brand-700">
              {{ t('appLayout.terms') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>