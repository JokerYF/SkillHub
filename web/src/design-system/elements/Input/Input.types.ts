/**
 * Skills Intelligence Hub - Input 组件类型定义
 */

// 输入框尺寸
export type InputSize = 'sm' | 'md' | 'lg'

// 输入框状态
export type InputState = 'default' | 'hover' | 'focus' | 'disabled' | 'error' | 'success'

// 输入框属性接口
export interface InputProps {
  /** 绑定值 */
  modelValue?: string | number
  /** 输入框类型 */
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
  /** 输入框尺寸 */
  size?: InputSize
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只读 */
  readonly?: boolean
  /** 是否必填 */
  required?: boolean
  /** 是否可清除 */
  clearable?: boolean
  /** 是否显示密码切换按钮 */
  showPassword?: boolean
  /** 最大长度 */
  maxlength?: number
  /** 最小长度 */
  minlength?: number
  /** 最大值 (number 类型) */
  max?: number
  /** 最小值 (number 类型) */
  min?: number
  /** 步长 (number 类型) */
  step?: number
  /** 自动聚焦 */
  autofocus?: boolean
  /** 自动完成 */
  autocomplete?: string
  /** 名称 */
  name?: string
  /** ID */
  id?: string
  /** 校验状态 */
  state?: InputState
  /** 错误信息 */
  errorMessage?: string
  /** 成功信息 */
  successMessage?: string
  /** 提示信息 */
  hint?: string
  /** 标签 */
  label?: string
}

// 输入框事件接口
export interface InputEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'input', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'keyup', event: KeyboardEvent): void
  (e: 'keypress', event: KeyboardEvent): void
}

// 输入框插槽接口
export interface InputSlots {
  prefix?: () => unknown
  suffix?: () => unknown
  'prepend'?: () => unknown
  'append'?: () => unknown
}

// 尺寸对应的样式映射
export const inputSizeMap: Record<InputSize, {
  height: string
  padding: string
  fontSize: string
}> = {
  sm: {
    height: '2rem',       // 32px
    padding: '0.5rem',    // 8px
    fontSize: '0.875rem', // 14px
  },
  md: {
    height: '2.5rem',     // 40px
    padding: '0.75rem',   // 12px
    fontSize: '0.875rem', // 14px
  },
  lg: {
    height: '3rem',       // 48px
    padding: '1rem',      // 16px
    fontSize: '1rem',     // 16px
  },
}

// 状态对应的样式映射
export const inputStateMap: Record<InputState, {
  border: string
  ring: string
  bg: string
}> = {
  default: {
    border: 'border-neutral-300',
    ring: 'focus:ring-brand-500 focus:border-brand-500',
    bg: 'bg-white',
  },
  hover: {
    border: 'border-neutral-400',
    ring: '',
    bg: 'bg-white',
  },
  focus: {
    border: 'border-brand-500',
    ring: 'ring-2 ring-brand-500 ring-opacity-30',
    bg: 'bg-white',
  },
  disabled: {
    border: 'border-neutral-200',
    ring: '',
    bg: 'bg-neutral-50 cursor-not-allowed',
  },
  error: {
    border: 'border-semantic-error-dark',
    ring: 'focus:ring-semantic-error-dark',
    bg: 'bg-white',
  },
  success: {
    border: 'border-semantic-success-dark',
    ring: 'focus:ring-semantic-success-dark',
    bg: 'bg-white',
  },
}