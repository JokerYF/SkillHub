<script setup lang="ts">
/**
 * Skills Intelligence Hub - Input 组件
 *
 * 企业级输入框组件，支持多种状态和扩展功能
 */
import { computed, ref, useSlots } from 'vue'
import type { InputProps, InputEmits, InputSize } from './Input.types'
import { inputSizeMap, inputStateMap } from './Input.types'

// Props 定义
const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false,
  clearable: false,
  showPassword: false,
  autofocus: false,
  autocomplete: 'off',
  state: 'default',
})

// Emits 定义
const emit = defineEmits<InputEmits>()

// Slots
const slots = useSlots()

// 内部状态
const isFocused = ref(false)
const showPasswordValue = ref(false)

// 计算当前输入类型
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPasswordValue.value ? 'text' : 'password'
  }
  return props.type
})

// 计算当前状态
const currentState = computed(() => {
  if (props.disabled) return 'disabled'
  if (props.state === 'error') return 'error'
  if (props.state === 'success') return 'success'
  if (isFocused.value) return 'focus'
  return 'default'
})

// 计算输入框类名
const inputClasses = computed(() => {
  const classes: string[] = [
    'w-full',
    'outline-none',
    'transition-all duration-150 ease-in-out',
    'rounded-lg',
    'border',
  ]

  // 尺寸样式
  const sizeStyles = inputSizeMap[props.size as InputSize]
  classes.push(`h-[${sizeStyles.height}]`)
  classes.push(`px-[${sizeStyles.padding}]`)
  classes.push(`text-[${sizeStyles.fontSize}]`)

  // 状态样式
  const stateStyles = inputStateMap[currentState.value]
  classes.push(stateStyles.border)
  classes.push(stateStyles.bg)
  if (currentState.value !== 'disabled') {
    classes.push(stateStyles.ring)
  }

  // 禁用样式
  if (props.disabled) {
    classes.push('cursor-not-allowed')
    classes.push('text-neutral-400')
  } else {
    classes.push('text-neutral-800')
  }

  // 只读样式
  if (props.readonly) {
    classes.push('cursor-default')
  }

  // 前缀插槽存在时调整左边距
  if (slots.prefix) {
    classes.push('!pl-10')
  }

  // 后缀插槽存在时调整右边距
  if (slots.suffix || props.clearable || props.showPassword) {
    classes.push('!pr-10')
  }

  return classes.join(' ')
})

// 输入处理
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
  emit('input', value)
}

// 变更处理
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('change', value)
}

// 聚焦处理
const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

// 失焦处理
const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

// 清除处理
const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}

// 切换密码可见性
const togglePassword = () => {
  showPasswordValue.value = !showPasswordValue.value
}

// 键盘事件处理
const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const handleKeyup = (event: KeyboardEvent) => {
  emit('keyup', event)
}

const handleKeypress = (event: KeyboardEvent) => {
  emit('keypress', event)
}
</script>

<template>
  <div class="w-full">
    <!-- 标签 -->
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-neutral-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-semantic-error-dark">*</span>
    </label>

    <!-- 输入框容器 -->
    <div class="relative flex items-center">
      <!-- 前置插槽 -->
      <span
        v-if="$slots.prepend"
        class="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-500 text-sm"
      >
        <slot name="prepend" />
      </span>

      <!-- 前缀插槽 -->
      <span
        v-if="$slots.prefix"
        class="absolute left-3 text-neutral-400"
      >
        <slot name="prefix" />
      </span>

      <!-- 输入框 -->
      <input
        :id="id"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :minlength="minlength"
        :max="max"
        :min="min"
        :step="step"
        :autofocus="autofocus"
        :autocomplete="autocomplete"
        :name="name"
        :class="[
          inputClasses,
          $slots.prepend ? 'rounded-l-none' : '',
          $slots.append ? 'rounded-r-none' : ''
        ]"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
        @keypress="handleKeypress"
      />

      <!-- 清除按钮 -->
      <button
        v-if="clearable && modelValue && !disabled"
        type="button"
        class="absolute right-3 text-neutral-400 hover:text-neutral-600 transition-colors"
        @click="handleClear"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- 密码切换按钮 -->
      <button
        v-else-if="showPassword && type === 'password'"
        type="button"
        class="absolute right-3 text-neutral-400 hover:text-neutral-600 transition-colors"
        @click="togglePassword"
      >
        <svg v-if="showPasswordValue" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

      <!-- 后缀插槽 -->
      <span
        v-else-if="$slots.suffix"
        class="absolute right-3 text-neutral-400"
      >
        <slot name="suffix" />
      </span>

      <!-- 后置插槽 -->
      <span
        v-if="$slots.append"
        class="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-neutral-300 bg-neutral-50 text-neutral-500 text-sm"
      >
        <slot name="append" />
      </span>
    </div>

    <!-- 提示信息 -->
    <p
      v-if="hint && !errorMessage && !successMessage"
      class="mt-1 text-sm text-neutral-500"
    >
      {{ hint }}
    </p>

    <!-- 错误信息 -->
    <p
      v-if="errorMessage"
      class="mt-1 text-sm text-semantic-error-dark"
    >
      {{ errorMessage }}
    </p>

    <!-- 成功信息 -->
    <p
      v-if="successMessage && state === 'success'"
      class="mt-1 text-sm text-semantic-success-dark"
    >
      {{ successMessage }}
    </p>
  </div>
</template>