import { useState, useCallback } from "react"
import api from "@/lib/api"
import { GroupBalance, GroupBalanceResponse } from "@/types"

interface BalanceApiResponse {
  success: boolean
  message: string
  data: GroupBalance
}

export function useGroupBalance() {
  const [balance, setBalance] = useState<GroupBalance | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGroupBalance = useCallback(async (groupId: string): Promise<GroupBalance | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get<BalanceApiResponse>(`/expenses/group/${groupId}/balance`)
      const balanceData = response?.data || null
      setBalance(balanceData)
      return balanceData
    } catch (err: any) {
      const message = err.response?.data?.message || "Lỗi khi tải dữ liệu số dư"
      setError(message)
      console.error("Fetch group balance error:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    balance,
    isLoading,
    error,
    fetchGroupBalance,
  }
}
