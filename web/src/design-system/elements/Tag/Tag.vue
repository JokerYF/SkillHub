<script setup lang="ts">
/**
 * Skills Intelligence Hub - Tag 组件
 *
 * 企业级标签组件，用于分类、标记和筛选
 */
import { computed } from 'vue'
import type { TagProps, TagEmits, TagType, TagSize, TagVariant, SkillTagType } from './Tag.types'
import { tagSizeMap, tagStyleMap, skillTagStyleMap } from './Tag.types'

// Props 定义
const props = withDefaults(defineProps<TagProps>(), {
  type: 'default',
  size: 'md',
  variant: 'soft',
  closable: false,
  selectable: false,
  selected: false,
  disabled: false,
})

// Emits 定义
const emit = defineEmits<TagEmits>()

// 计算标签类名
const tagClasses = computed(() => {
  const classes: string[] = [
    'inline-flex items-center justify-center',
    'font-medium',
    'rounded-full',
    'border',
    'transition-all duration-150 ease-in-out',
    'whitespace-nowrap',
  ]

  // 尺寸样式
  const sizeStyles = tagSizeMap[props.size as TagSize]
  classes.push(`text-[${sizeStyles.fontSize}]`)
  classes.push(`h-[${sizeStyles.height}]`)
  classes.push('px-2')

  // 技能类型样式
  if (props.skillType) {
    const skillStyles = skillTagStyleMap[props.skillType as SkillTagType]
    classes.push(skillStyles.bg)
    classes.push(skillStyles.text)
    classes.push(skillStyles.border)
  } else {
    // 普通类型样式
    const typeStyles = tagStyleMap[props.type as TagType][props.variant as TagVariant]
    classes.push(typeStyles.bg)
    classes.push(typeStyles.text)
    classes.push(typeStyles.border)
  }

  // 可选状态
  if (props.selectable && !props.disabled) {
    classes.push('cursor-pointer')
    if (props.selected) {
      classes.push('ring-2 ring-brand-500 ring-offset-1')
    }
  }

  // 禁用状态
  if (props.disabled) {
    classes.push('opacity-50 cursor-not-allowed')
  }

  return classes.join(' ')
})

// 点击处理
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && props.selectable) {
    emit('update:selected', !props.selected)
  }
  if (!props.disabled) {
    emit('click', event)
  }
}

// 关闭处理
const handleClose = (event: MouseEvent) => {
  event.stopPropagation()
  if (!props.disabled) {
    emit('close', event)
  }
}
</script>

<template>
  <span
    :class="tagClasses"
    :role="selectable ? 'checkbox' : undefined"
    :aria-checked="selectable ? selected : undefined"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <!-- 图标 -->
    <span v-if="icon" class="mr-1">
      <component :is="icon" />
    </span>

    <!-- 默认插槽 -->
    <slot>{{ label }}</slot>

    <!-- 关闭按钮 -->
    <button
      v-if="closable && !disabled"
      type="button"
      class="ml-1 -mr-0.5 hover:opacity-70 transition-opacity"
      @click="handleClose"
    >
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </span>
</template>