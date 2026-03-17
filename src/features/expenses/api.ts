import { api } from '../../api/axios'
import type { ExpensesResponse, Expense, CreateExpenseResponse, GroupBalanceResponse, GroupBalance } from './types'
import type { ExpenseSettlementResponse } from './settlementTypes'

export const getExpensesByGroupId = async (groupId: string): Promise<Expense[]> => {
  try {
    const response = await api.get<ExpensesResponse>(`/expenses/group/${groupId}`)

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch expenses')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const addExpense = async (formData: FormData): Promise<CreateExpenseResponse> => {
  try {
    const response = await api.post('/expenses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Failed to create expense')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const updateExpense = async (expenseId: string, formData: FormData): Promise<CreateExpenseResponse> => {
  try {
    const response = await api.put(`/expenses/${expenseId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Failed to update expense')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const deleteExpense = async (expenseId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/expenses/${expenseId}`)

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Failed to delete expense')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const getExpenseSettlement = async (expenseId: string): Promise<ExpenseSettlementResponse> => {
  try {
    const response = await api.get(`/expenses/${expenseId}/settlement`)

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch settlement')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const getGroupBalance = async (groupId: string): Promise<GroupBalance> => {
  try {
    const response = await api.get<GroupBalanceResponse>(`/expenses/group/${groupId}/balance`)

    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch group balance')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}
