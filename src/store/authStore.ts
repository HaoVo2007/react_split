import { create } from 'zustand'
import type { AuthResponse, CurrentUser } from '../features/auth/types'

type AuthState = {
  user: AuthResponse | null
  currentUser: CurrentUser | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: AuthResponse | null) => void
  setCurrentUser: (user: CurrentUser | null) => void
  setToken: (token: string | null) => void
  clearAuth: () => void
  login: (user: AuthResponse) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  currentUser: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  setUser: (user) => set({ user }),

  setCurrentUser: (user) => set({ currentUser: user }),

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    set({ token, isAuthenticated: !!token })
  },

  clearAuth: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    set({ user: null, currentUser: null, token: null, isAuthenticated: false })
  },

  login: (user) => {
    set({
      user,
      token: user.token,
      isAuthenticated: true
    })
    localStorage.setItem('token', user.token)
    localStorage.setItem('refresh_token', user.refresh_token)
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    set({ user: null, currentUser: null, token: null, isAuthenticated: false })
  },
}))
