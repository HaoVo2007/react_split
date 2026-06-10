import { useState } from "react"
import api from "@/lib/api"
import { Group, ApiResponse, CreateGroupRequest, UpdateGroupRequest } from "@/types"

export function useGroupActions() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createGroup = async (data: CreateGroupRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description || "")
      if (data.image) {
        formData.append("image", data.image)
      }

      const response = await api.post<ApiResponse<Group>>(
        "/groups",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      return response.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Tạo nhóm thất bại"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateGroup = async (groupId: string, data: UpdateGroupRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description || "")
      if (data.image) {
        formData.append("image", data.image)
      }

      const response = await api.put<ApiResponse<Group>>(
        `/groups/${groupId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      return response.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Chỉnh sửa nhóm thất bại"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteGroup = async (groupId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await api.delete(`/groups/${groupId}`)
    } catch (err: any) {
      const message = err.response?.data?.message || "Xóa nhóm thất bại"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => setError(null)

  return {
    createGroup,
    updateGroup,
    deleteGroup,
    isLoading,
    error,
    clearError,
  }
}
