import { create } from "zustand"
import { User, AuthResponse, ApiResponse } from "@/types"
import api from "@/lib/api"

interface AuthStore {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, confirm_password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refresh_token"),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/users/auth/login",
        { email, password }
      )

      const authData = (response as any).data || response
      const { token, refresh_token, ...userData } = authData

      localStorage.setItem("token", token)
      localStorage.setItem("refresh_token", refresh_token)

      // Save profile to localStorage
      if (userData.profile) {
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            name: userData.profile?.name || null,
            image: userData.profile?.image || null,
          })
        )
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        profile: userData.profile,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      }

      set({
        user,
        token,
        refreshToken: refresh_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng nhập thất bại"
      set({ error: message, isLoading: false })
      throw error
    }
  },

  register: async (email: string, password: string, confirm_password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/users/auth/register",
        { email, password, confirm_password }
      )

      const authData = (response as any).data || response
      const { token, refresh_token, ...userData } = authData

      localStorage.setItem("token", token)
      localStorage.setItem("refresh_token", refresh_token)

      // Save profile to localStorage
      if (userData.profile) {
        localStorage.setItem(
          "userProfile",
          JSON.stringify({
            name: userData.profile?.name || null,
            image: userData.profile?.image || null,
          })
        )
      }

      const user: User = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        profile: userData.profile,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      }

      set({
        user,
        token,
        refreshToken: refresh_token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error: any) {
      const message = error.response?.data?.message || "Đăng ký thất bại"
      set({ error: message, isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("userProfile")
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  },

  clearError: () => {
    set({ error: null })
  },
}))
