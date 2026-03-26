import { api } from './index'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

export async function login(data: LoginRequest): Promise<string> {
  const response = await api.post<AuthResponse>('/auth/login', data)
  return response.data.token
}

export async function register(data: RegisterRequest): Promise<void> {
  await api.post('/auth/register', data)
}

/**
 * 修改密码
 * @param data - 包含旧密码和新密码
 */
export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await api.post('/auth/change-password', data)
}

/**
 * 刷新 Token
 * 使用当前有效的 Token 获取新的 Token
 * @returns 新的 JWT Token
 */
export async function refreshToken(): Promise<string> {
  const response = await api.post<AuthResponse>('/auth/refresh')
  return response.data.token
}