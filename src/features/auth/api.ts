import { api } from '../../api/axios'
import type { AuthResponse, LoginFormValues, RegisterFormValues, SuccessResponse, User, CurrentUser } from './types'

export const loginUser = async (payload: LoginFormValues): Promise<AuthResponse> => {
  try {
    const response = await api.post<SuccessResponse<User>>('/users/auth/login', payload)

    if (response.data.success && response.data.data) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('refresh_token', response.data.data.refresh_token)

      return response.data.data
    } else {
      throw new Error(response.data.message || 'Login failed')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const registerUser = async (payload: RegisterFormValues): Promise<AuthResponse> => {
  try {
    const response = await api.post<SuccessResponse<User>>('/users/auth/register', payload)

    if (response.data.success && response.data.data) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('refresh_token', response.data.data.refresh_token)

      return response.data.data
    } else {
      throw new Error(response.data.message || 'Registration failed')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
  try {
    const response = await api.get<SuccessResponse<CurrentUser>>('/users/auth/current-user')

    if (response.data.success && response.data.data) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch user')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const logoutUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/users/auth/logout')

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Logout failed')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const updateProfile = async (formData: FormData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/users/auth/update-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Profile update failed')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

// Re-export the axios instance for other API calls
export { api } from '../../api/axios'
