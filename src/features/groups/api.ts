import { api } from '../../api/axios'
import type { GroupsResponse, GroupMembersResponse } from './types'

export const getGroups = async (): Promise<GroupsResponse> => {
  try {
    const response = await api.get('/groups')

    if (response.data.success && response.data.data) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch groups')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const createGroup = async (formData: FormData): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post('/groups', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Failed to create group')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const getGroupMembers = async (groupId: string): Promise<GroupMembersResponse> => {
  try {
    const response = await api.get(`/groups/${groupId}/members`)

    if (response.data.success && response.data.data) {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to fetch group members')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}

export const addGroupMember = async (groupId: string, email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post(`/groups/${groupId}/members`, { email })

    if (response.data.success) {
      return response.data
    } else {
      throw new Error(response.data.message || 'Failed to add member')
    }
  } catch (error: unknown) {
    const axiosError = error as { response?: { data?: { message?: string } } }
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message)
    }
    throw new Error('Network error. Please try again.')
  }
}