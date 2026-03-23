<script setup lang="ts">
/**
 * Skills Intelligence Hub - Button 组件
 *
 * 企业级按钮组件，支持多种类型、尺寸和状态
 */
import { computed } from 'vue'
import type { ButtonProps, ButtonEmits, ButtonSize, ButtonType } from './Button.types'
import { buttonSizeMap, buttonTypeMap } from './Button.types'

// Props 定义
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'md',
  shape: 'default',
  disabled: false,
  loading: false,
  block: false,
  nativeType: 'button',
  iconPosition: 'left',
})

// Emits 定义
const emit = defineEmits<ButtonEmits>()

// 计算是否可点击
const isDisabled = computed(() => props.disabled || props.loading)

// 计算按钮类名
const buttonClasses = computed(() => {
  const classes: string[] = [
    // 基础样式
    'inline-flex items-center justify-center',
    'font-medium',
    'transition-all duration-150 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
    'select-none',
  ]

  // 尺寸样式
  const sizeStyles = buttonSizeMap[props.size as ButtonSize]
  classes.push(`h-[${sizeStyles.height}]`)
  classes.push(`text-[${sizeStyles.fontSize}]`)

  // 类型样式
  const typeStyles = buttonTypeMap[props.type as ButtonType]
  classes.push(typeStyles.base)

  // 禁用样式
  if (isDisabled.value) {
    classes.push(typeStyles.disabled)
  }

  // 块级样式
  if (props.block) {
    classes.push('w-full')
  }

  // 形状样式
  if (props.shape === 'circle') {
    classes.push('rounded-full')
    classes.push('aspect-square')
    classes.push('!p-0')
  } else if (props.shape === 'square') {
    classes.push('rounded-lg')
    classes.push('aspect-square')
    classes.push('!p-0')
  } else {
    classes.push('rounded-lg')
    classes.push(`px-[${sizeStyles.padding}]`)
  }

  return classes.join(' ')
})

// 点击处理
const handleClick = (event: MouseEvent) => {
  if (!isDisabled.value) {
    emit('click', event)
  }
}
</script>

<template>
  <!-- 渲染为链接 -->
  <a
    v-if="href"
    :href="disabled ? undefined : href"
    :target="target"
    :class="buttonClasses"
    :aria-disabled="isDisabled"
    @click="handleClick"
  >
    <!-- 加载图标 -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- 左侧图标插槽 -->
    <span
      v-if="$slots['icon-left'] && !loading"
      :class="['inline-flex items-center', $slots.default ? 'mr-2' : '']"
    >
      <slot name="icon-left" />
    </span>

    <!-- 默认插槽 -->
    <slot />

    <!-- 右侧图标插槽 -->
    <span
      v-if="$slots['icon-right']"
      :class="['inline-flex items-center', $slots.default ? 'ml-2' : '']"
    >
      <slot name="icon-right" />
    </span>
  </a>

  <!-- 渲染为按钮 -->
  <button
    v-else
    :type="nativeType"
    :disabled="isDisabled"
    :class="buttonClasses"
    :aria-disabled="isDisabled"
    @click="handleClick"
  >
    <!-- 加载图标 -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- 左侧图标插槽 -->
    <span
      v-if="$slots['icon-left'] && !loading"
      :class="['inline-flex items-center', $slots.default ? 'mr-2' : '']"
    >
      <slot name="icon-left" />
    </span>

    <!-- 默认插槽 -->
    <slot />

    <!-- 右侧图标插槽 -->
    <span
      v-if="$slots['icon-right']"
      :class="['inline-flex items-center', $slots.default ? 'ml-2' : '']"
    >
      <slot name="icon-right" />
    </span>
  </button>
</template>

<style scoped>
/* 自定义样式可以在这里添加 */
</style>