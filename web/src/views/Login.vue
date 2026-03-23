<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { extractErrorMessage } from '@/api/index'
import AuthLayout from '@/design-system/layouts/AuthLayout.vue'
import Button from '@/design-system/elements/Button/Button.vue'
import Input from '@/design-system/elements/Input/Input.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''

  if (!email.value || !email.value.includes('@')) {
    error.value = 'Please enter a valid email address'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  try {
    await userStore.login({
      email: email.value,
      password: password.value,
    })

    // Redirect to original target page or home
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (e) {
    error.value = extractErrorMessage(e, 'Login failed')
  }
}
</script>

<template>
  <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
    <form class="space-y-6" @submit.prevent="handleLogin">
      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
      >
        {{ error }}
      </div>

      <!-- Success Message from Registration -->
      <div
        v-if="route.query.registered === 'true'"
        class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
      >
        Registration successful! Please log in.
      </div>

      <!-- Email Input -->
      <Input
        v-model="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        required
        :state="error && !email.includes('@') ? 'error' : 'default'"
      />

      <!-- Password Input -->
      <Input
        v-model="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
        show-password
        hint="At least 8 characters"
      />

      <!-- Submit Button -->
      <Button
        type="primary"
        block
        :loading="userStore.loading"
        native-type="submit"
      >
        {{ userStore.loading ? 'Signing in...' : 'Sign In' }}
      </Button>
    </form>
  </AuthLayout>
</template>