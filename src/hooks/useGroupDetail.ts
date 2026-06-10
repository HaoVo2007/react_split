import { useState, useCallback } from "react"
import api from "@/lib/api"
import { Group, ApiResponse } from "@/types"

export function useGroupDetail() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGroupDetail = useCallback(async (groupId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get<ApiResponse<Group>>(`/groups/${groupId}`)
      return response.data
    } catch (err: any) {
      const message = err.response?.data?.message || "Lỗi khi tải chi tiết nhóm"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    fetchGroupDetail,
    isLoading,
    error,
    clearError,
  }
}
