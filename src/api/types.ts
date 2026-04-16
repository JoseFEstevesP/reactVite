export interface ApiResponse<TData> {
  data: TData
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface RequestConfig {
  params?: Record<string, string | number | boolean>
  headers?: Record<string, string>
}
