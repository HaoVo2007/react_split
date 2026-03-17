import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { getCurrentUser } from '../features/auth/api'

export const useInitializeUser = () => {
  const { isAuthenticated, setCurrentUser } = useAuthStore()

  useEffect(() => {
    const initUser = async () => {
      if (isAuthenticated) {
        try {
          const user = await getCurrentUser()
          setCurrentUser(user)
        } catch (error) {
          console.error('Failed to fetch current user:', error)
          // Don't show error toast for initial load, just log it
        }
      }
    }

    initUser()
  }, [isAuthenticated, setCurrentUser])
}
