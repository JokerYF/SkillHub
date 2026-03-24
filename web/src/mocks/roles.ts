/**
 * Mock 数据 - 角色模块
 *
 * 基于 docs/api-spec.yaml 生成
 * 用于前端开发时模拟后端 API 响应
 */

import type { Role } from '@/api/roles'

export const mockRoles: Role[] = [
  {
    id: '1',
    name: 'admin',
    description: '系统管理员，拥有所有权限',
    is_system: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'user',
    description: '普通用户，拥有基本权限',
    is_system: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'moderator',
    description: '内容管理员，管理技能审核',
    is_system: false,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
]