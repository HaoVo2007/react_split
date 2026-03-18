import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { loginUser, registerUser, logoutUser, updateProfile, getCurrentUser } from './api'
import type { LoginFormValues, RegisterFormValues } from './types'
import { useAuthStore } from '../../store/authStore'
import { useLoadingStore } from '../../store/loadingStore'
import toast from 'react-hot-toast'

// Query keys for caching
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
}

// Hook for login with loading state
export const useLogin = () => {
  const login = useAuthStore((state) => state.login)
  const setLoading = useLoadingStore((state) => state.setProfileLoading)
  const navigate = useNavigate()
  
  return useMutation({
    mutationFn: (credentials: LoginFormValues) => loginUser(credentials),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      login(data)
      toast.success('Đăng nhập thành công!')
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Đăng nhập thất bại')
    },
    onSettled: () => {
      setLoading(false)
    }
  })
}

// Hook for register with loading state
export const useRegister = () => {
  const login = useAuthStore((state) => state.login)
  const setLoading = useLoadingStore((state) => state.setProfileLoading)
  const navigate = useNavigate()
  
  return useMutation({
    mutationFn: (credentials: RegisterFormValues) => registerUser(credentials),
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (data) => {
      login(data)
      toast.success('Đăng ký thành công!')
      navigate('/dashboard')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Đăng ký thất bại')
    },
    onSettled: () => {
      setLoading(false)
    }
  })
}

// Hook for fetching current user with loading state
export const useCurrentUser = () => {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser)
  const setLoading = useLoadingStore((state) => state.setProfileLoading)
  
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      setLoading(true)
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
        return user
      } finally {
        setLoading(false)
      }
    },
    enabled: !!localStorage.getItem('token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for logout with loading state - BLOCKS ALL UI INTERACTION
export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout)
  const setLogoutLoading = useLoadingStore((state) => state.setLogoutLoading)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: logoutUser,
    onMutate: () => {
      // Set logout loading to true - this will block all UI interactions
      setLogoutLoading(true)
      toast.loading('Đang đăng xuất...', { id: 'logout' })
    },
    onSuccess: () => {
      // Clear all queries and auth state
      queryClient.clear()
      logout()
      toast.success('Đăng xuất thành công!', { id: 'logout' })
      navigate('/auth/login')
    },
    onError: (error: Error) => {
      // Even on error, we still logout locally
      queryClient.clear()
      logout()
      toast.error(error.message || 'Đăng xuất thất bại, nhưng đã đăng xuất cục bộ', { id: 'logout' })
      navigate('/auth/login')
    },
    onSettled: () => {
      // Always set loading to false when done
      setLogoutLoading(false)
    }
  })
}

// Hook for update profile with loading state
export const useUpdateProfile = () => {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser)
  const setLoading = useLoadingStore((state) => state.setProfileLoading)
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // First update the profile
      const response = await updateProfile(formData)
      // Then fetch the updated user data
      const userData = await getCurrentUser()
      setCurrentUser(userData)
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
      return { ...response, userData }
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      toast.success('Cập nhật hồ sơ thành công!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Cập nhật hồ sơ thất bại')
    },
    onSettled: () => {
      setLoading(false)
    }
  })
}

// Combined auth actions hook with loading states
export const useAuthActions = () => {
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const logoutMutation = useLogout()
  const updateProfileMutation = useUpdateProfile()
  
  return {
    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    
    // Actions
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    updateProfile: updateProfileMutation.mutateAsync,
  }
}

// Hook to check if any auth operation is loading
export const useAuthLoading = () => {
  return useLoadingStore((state) => ({
    isLoadingLogout: state.isLoadingLogout,
    isLoadingProfile: state.isLoadingProfile,
    isAnyLoading: state.isAnyLoading
  }))
}

// Form state management hook
export const useAuthForm = <T extends Record<string, string>>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState)
  const initialRef = useRef(initialState)

  const setField = useCallback((field: keyof T, value: string) => {
    setValues((prev: T) => ({ ...prev, [field]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialRef.current)
  }, [])

  return { values, setField, resetForm }
}
