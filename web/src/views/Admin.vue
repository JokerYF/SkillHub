<script setup lang="ts">
/**
 * Skills Intelligence Hub - Admin Page 管理面板首页
 *
 * 仅作为管理功能入口，显示用户管理、部门管理、角色管理的导航卡片
 */
import { useI18n } from 'vue-i18n'
import AppLayout from '@/design-system/layouts/AppLayout.vue'

const { t } = useI18n()
</script>

<template>
  <AppLayout :title="t('admin.title')" :show-sidebar="true">
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-2xl font-bold text-neutral-800">{{ t('admin.title') }}</h1>
        <p class="text-neutral-500 mt-1">{{ t('admin.subtitle') }}</p>
      </div>

      <!-- Quick Navigation Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/admin/users"
          class="bg-white rounded-lg border border-neutral-200 p-6 hover:border-brand-300 hover:shadow-sm transition-all"
        >
          <div class="flex items-center">
            <div class="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="font-semibold text-neutral-800">{{ t('adminNav.userManagement') }}</h3>
              <p class="text-sm text-neutral-500">{{ t('adminNav.userManagementDesc') }}</p>
            </div>
          </div>
        </router-link>

        <router-link
          to="/admin/groups"
          class="bg-white rounded-lg border border-neutral-200 p-6 hover:border-brand-300 hover:shadow-sm transition-all"
        >
          <div class="flex items-center">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="font-semibold text-neutral-800">{{ t('adminNav.departmentManagement') }}</h3>
              <p class="text-sm text-neutral-500">{{ t('adminNav.departmentManagementDesc') }}</p>
            </div>
          </div>
        </router-link>

        <router-link
          to="/admin/roles"
          class="bg-white rounded-lg border border-neutral-200 p-6 hover:border-brand-300 hover:shadow-sm transition-all"
        >
          <div class="flex items-center">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="font-semibold text-neutral-800">{{ t('adminNav.roleManagement') }}</h3>
              <p class="text-sm text-neutral-500">{{ t('adminNav.roleManagementDesc') }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>