import { api } from './index'

export interface Permission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
}

export interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
  is_system?: boolean
  created_at: string
  updated_at: string
}

export interface CreateRoleRequest {
  name: string
  description?: string
  permissions: string[]
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissions?: string[]
}

export async function listRoles(): Promise<Role[]> {
  const { data } = await api.get<Role[]>('/roles')
  return data
}

export async function getRole(id: string): Promise<Role> {
  const { data } = await api.get<Role>(`/roles/${id}`)
  return data
}

export async function createRole(role: CreateRoleRequest): Promise<Role> {
  const { data } = await api.post<Role>('/roles', role)
  return data
}

export async function updateRole(id: string, role: UpdateRoleRequest): Promise<Role> {
  const { data } = await api.put<Role>(`/roles/${id}`, role)
  return data
}

export async function deleteRole(id: string): Promise<void> {
  await api.delete(`/roles/${id}`)
}

/**
 * 获取所有权限列表
 * @returns 权限列表
 */
export async function listPermissions(): Promise<Permission[]> {
  const { data } = await api.get<Permission[]>('/permissions')
  return data
}

/**
 * 获取角色的权限名称列表
 * @param roleId - 角色 ID
 * @returns 权限名称列表
 */
export async function getRolePermissions(roleId: string): Promise<string[]> {
  const { data } = await api.get<string[]>(`/roles/${roleId}/permissions`)
  return data
}

/**
 * 为角色添加权限
 * @param roleId - 角色 ID
 * @param permissionId - 权限 ID
 */
export async function addRolePermission(roleId: string, permissionId: string): Promise<void> {
  await api.post(`/roles/${roleId}/permissions`, { permission_id: permissionId })
}

/**
 * 从角色移除权限
 * @param roleId - 角色 ID
 * @param permissionId - 权限 ID
 */
export async function removeRolePermission(roleId: string, permissionId: string): Promise<void> {
  await api.delete(`/roles/${roleId}/permissions/${permissionId}`)
}