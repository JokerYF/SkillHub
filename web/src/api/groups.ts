import { api } from './index'

export interface Group {
  id: string
  name: string
  description?: string
  parent_id: string | null
  created_at: string
  updated_at: string
}

export interface GroupMember {
  user_id: string
  username: string
  email: string
  role: 'admin' | 'member'
  joined_at: string
}

export interface CreateGroupRequest {
  name: string
  description?: string
  parent_id?: string | null
}

export interface UpdateGroupRequest {
  name?: string
  description?: string
  parent_id?: string | null
}

export interface AddMemberRequest {
  user_id: string
  role?: 'admin' | 'member'
}

export async function listGroups(): Promise<Group[]> {
  const { data } = await api.get<Group[]>('/groups')
  return data
}

export async function getGroup(id: string): Promise<Group> {
  const { data } = await api.get<Group>(`/groups/${id}`)
  return data
}

export async function createGroup(group: CreateGroupRequest): Promise<Group> {
  const { data } = await api.post<Group>('/groups', group)
  return data
}

export async function updateGroup(id: string, group: UpdateGroupRequest): Promise<Group> {
  const { data } = await api.put<Group>(`/groups/${id}`, group)
  return data
}

export async function deleteGroup(id: string): Promise<void> {
  await api.delete(`/groups/${id}`)
}

export async function getGroupMembers(id: string): Promise<GroupMember[]> {
  const { data } = await api.get<GroupMember[]>(`/groups/${id}/members`)
  return data
}

export async function addGroupMember(id: string, member: AddMemberRequest): Promise<void> {
  await api.post(`/groups/${id}/members`, member)
}

export async function removeGroupMember(id: string, userId: string): Promise<void> {
  await api.delete(`/groups/${id}/members/${userId}`)
}