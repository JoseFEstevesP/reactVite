import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import http from '@/api/http'
import type { AuthState, LoginPayload } from '../types/auth.types'

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const payload: LoginPayload = { email, password }
          await http.post('/auth/login', payload)
          
          set({ 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          })
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Login failed' 
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        
        try {
          await http.post('/auth/logout')
        } catch {
          // Continue with local cleanup even if API call fails
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
