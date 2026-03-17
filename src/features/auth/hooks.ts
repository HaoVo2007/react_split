import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser, logoutUser, updateProfile, getCurrentUser } from './api'
import type { LoginFormValues, RegisterFormValues, CurrentUser } from './types'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export const useAuthActions = () => {
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser)
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser()
      logout()
      toast.success('Logged out successfully!')
      navigate('/auth/login')
    } catch {
      // Even if API call fails, still clear local state and redirect
      // Error toast is already shown by API interceptor
      logout()
      navigate('/auth/login')
    }
  }, [logout, navigate])

  const handleUpdateProfile = useCallback(async (formData: FormData): Promise<{ success: boolean; message: string; userData?: CurrentUser }> => {
    try {
      const response = await updateProfile(formData)

      // Fetch updated user data after successful profile update
      const userData = await getCurrentUser()
      setCurrentUser(userData)

      toast.success('Profile updated successfully!')

      return { ...response, userData }
    } catch (error) {
      // Error toast is already shown by API interceptor
      throw error
    }
  }, [setCurrentUser])

  const handleLogin = useCallback(
    async (credentials: LoginFormValues) => {
      try {
        const response = await loginUser(credentials)
        login(response)
        toast.success('Login successful! Welcome back.')
        navigate('/dashboard')
        return response
      } catch (error) {
        // Error toast is already shown by API interceptor
        throw error
      }
    },
    [login, navigate],
  )

  const handleRegister = useCallback(
    async (credentials: RegisterFormValues) => {
      try {
        const response = await registerUser(credentials)
        login(response)
        toast.success('Account created successfully! Welcome aboard.')
        navigate('/dashboard')
        return response
      } catch (error) {
        // Error toast is already shown by API interceptor
        throw error
      }
    },
    [login, navigate],
  )

  return { login: handleLogin, register: handleRegister, logout: handleLogout, updateProfile: handleUpdateProfile }
}

type FormState<T extends Record<string, string>> = {
  values: T
  setField: (field: keyof T, value: string) => void
  resetForm: () => void
}

export const useAuthForm = <T extends Record<string, string>>(initialState: T): FormState<T> => {
  const [values, setValues] = useState(initialState)
  const initialRef = useRef(initialState)

  const setField = useCallback((field: keyof T, value: string) => {
    setValues((prev: T) => ({ ...prev, [field]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialRef.current)
  }, [])

  return { values, setField, resetForm }
}
