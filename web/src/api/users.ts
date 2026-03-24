import { api } from './index'

export interface User {
  id: string
  username: string
  email: string
  is_active: boolean
  roles: string[]
  created_at: string
  updated_at: string
}

export interface UpdateUserRequest {
  username?: string
  email?: string
  is_active?: boolean
}

// User Management API - Backend now implements full user management

export async function listUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users')
  return data
}

export async function getUser(id: string): Promise<User> {
  const { data } = await api.get<User>(`/users/${id}`)
  return data
}

export async function updateUser(id: string, user: UpdateUserRequest): Promise<User> {
  const { data } = await api.put<User>(`/users/${id}`, user)
  return data
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`)
}

/**
 * Assign a role to a user
 * @param userId - The user's UUID
 * @param roleName - The role name (e.g., 'admin', 'user')
 */
export async function assignRole(userId: string, roleName: string): Promise<void> {
  await api.post(`/users/${userId}/roles`, { role: roleName })
}

/**
 * Remove a role from a user
 * @param userId - The user's UUID
 * @param roleName - The role name (e.g., 'admin', 'user')
 */
export async function removeRole(userId: string, roleName: string): Promise<void> {
  await api.delete(`/users/${userId}/roles/${roleName}`)
}