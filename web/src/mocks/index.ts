/**
 * Mock 数据 - 入口文件
 *
 * 使用方式：
 * 1. 开发时：设置 VITE_USE_MOCK=true 启用 Mock
 * 2. 测试时：直接导入 mock 数据进行测试
 */

export * from './skills'
export * from './users'
export * from './roles'

/**
 * 检查是否启用 Mock
 */
export function isMockEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCK === 'true'
}

/**
 * Mock 延迟（模拟网络延迟）
 */
export async function mockDelay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}