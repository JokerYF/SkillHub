/**
 * Skills Intelligence Hub - 基础组件导出
 */

// Button 组件
export * from './Button'

// Input 组件
export * from './Input'

// Tag 组件
export * from './Tag'

// 统一导入所有组件
import { Button } from './Button'
import { Input } from './Input'
import { Tag } from './Tag'

export const elements = {
  Button,
  Input,
  Tag,
}

export default elements