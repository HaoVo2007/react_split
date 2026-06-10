import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Group, GroupsResponse, ApiResponse } from "@/types"

interface GroupStats {
  total_groups: number
  total_paid: number
  total_owed: number
}

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([])
  const [stats, setStats] = useState<GroupStats>({
    total_groups: 0,
    total_paid: 0,
    total_owed: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGroups = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get<ApiResponse<GroupsResponse>>("/groups")
      const responseData = (response as any).data || response
      const { total_groups, total_paid, total_owed, groups: groupsList } = responseData

      setGroups(groupsList || [])
      setStats({ total_groups: total_groups || 0, total_paid: total_paid || 0, total_owed: total_owed || 0 })
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi khi tải danh sách nhóm")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return { groups, stats, isLoading, error, refetch: fetchGroups }
}
