/**
 * Mock 数据 - 用户模块
 *
 * 基于 docs/api-spec.yaml 生成
 * 用于前端开发时模拟后端 API 响应
 */

import type { User } from '@/api/users'

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    is_active: true,
    roles: ['admin', 'user'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
  {
    id: '2',
    username: 'developer',
    email: 'developer@example.com',
    is_active: true,
    roles: ['user'],
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-02-15T12:00:00Z',
  },
  {
    id: '3',
    username: 'tester',
    email: 'tester@example.com',
    is_active: false,
    roles: ['user'],
    created_at: '2024-03-01T10:00:00Z',
    updated_at: '2024-03-10T15:00:00Z',
  },
]

export const mockCurrentUser: User = mockUsers[0]