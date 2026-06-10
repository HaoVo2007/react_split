import { useState, useCallback } from "react"
import api from "@/lib/api"
import type { GroupMember } from "@/types"

interface UserProfile {
  name?: string
  image?: string
  address?: string
  phone?: string
  image_public_id?: string
}

interface ApiGroupMember {
  id: string
  email: string
  role: string
  status: string
  profile?: UserProfile | null
}

interface GroupMembersResponse {
  success: boolean
  message: string
  data: ApiGroupMember[]
}

export function useGroupMembers() {
  const [members, setMembers] = useState<GroupMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGroupMembers = useCallback(async (groupId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get<GroupMembersResponse>(`/groups/${groupId}/members`)
      const apiMembers = ((response as any).data?.data || (response as any).data || []) as ApiGroupMember[]
      
      // Transform API response to GroupMember format
      const membersList: GroupMember[] = apiMembers.map((member: ApiGroupMember) => ({
        id: member.id,
        email: member.email,
        role: member.role,
        name: member.profile?.name || null,
        image: member.profile?.image || null,
        image_public_id: member.profile?.image_public_id || null,
        address: member.profile?.address || null,
        phone: member.profile?.phone || null,
      }))
      
      setMembers(membersList)
      return membersList
    } catch (err) {
      setError("Lấy danh sách thành viên thất bại")
      setMembers([])
      console.error("Fetch group members error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    members,
    isLoading,
    error,
    fetchGroupMembers,
    clearError,
  }
}
