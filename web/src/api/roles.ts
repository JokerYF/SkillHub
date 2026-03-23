import { api } from './index'

export interface Role {
  id: string
  name: string
  description?: string
  permissions: string[]
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