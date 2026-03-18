import { api } from '../../api/axios'
import type { DashboardSummaryResponse } from './types'

export const getDashboardSummary = async (): Promise<DashboardSummaryResponse['data']> => {
  try {
    const response = await api.get<DashboardSummaryResponse>('/users/auth/dashboard/summary')

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch dashboard summary')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}
