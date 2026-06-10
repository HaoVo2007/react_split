import { useAuthStore } from "@/store/authStore"

export function useAuth() {
  const { user, token, isLoading, isAuthenticated, login, register, logout, clearError, error } =
    useAuthStore()

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    clearError,
  }
}
