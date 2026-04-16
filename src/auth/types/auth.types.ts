export interface User {
  uid: string
  names: string
  surnames: string
  email: string
  phone: string
  uidRol: string
  attemptCount: number
  status: boolean
  activatedAccount: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  msg: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}
