import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { refreshToken } from './auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30秒超时
})

// Token 刷新状态
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: Error) => void
}> = []

// 处理等待队列
function processQueue(error: Error | null, token: string | null) {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

// 请求拦截器 - 添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一错误处理 + Token 自动刷新
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 如果是 401 错误且不是刷新 Token 的请求
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 如果是刷新 Token 的请求本身失败了，直接登出
      if (originalRequest.url?.includes('/auth/refresh')) {
        localStorage.removeItem('token')
        window.dispatchEvent(new CustomEvent('auth:logout'))
        return Promise.reject(error)
      }

      // 如果正在刷新，将请求加入队列等待
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // 尝试刷新 Token
        const newToken = await refreshToken()
        localStorage.setItem('token', newToken)

        // 处理等待队列
        processQueue(null, newToken)

        // 重试原请求
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // 刷新失败，处理等待队列并登出
        processQueue(refreshError as Error, null)
        localStorage.removeItem('token')
        window.dispatchEvent(new CustomEvent('auth:logout'))
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export interface ApiError {
  error: {
    code: string
    message: string
  }
}

// 提取错误信息的工具函数
export function extractErrorMessage(error: unknown, defaultMessage: string = '操作失败'): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined
    return apiError?.error?.message || error.message || defaultMessage
  }
  if (error instanceof Error) {
    return error.message || defaultMessage
  }
  return defaultMessage
}