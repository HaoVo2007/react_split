import { useState, useCallback } from "react"
import api from "@/lib/api"
import { GroupMember } from "@/types"

export interface SettlementMember {
  user_id: string
  name: string
  image: string | null
  email: string
  total_paid: number
  total_owed: number
  balance: number
  status: "creditor" | "debtor"
}

export interface ExpenseSettlement {
  from_user: GroupMember
  to_user: GroupMember
  amount: number
}

interface ExpenseSettlementData {
  expense_id: string
  amount: number
  members: SettlementMember[]
  settlements: ExpenseSettlement[]
}

interface ExpenseSettlementResponse {
  success: boolean
  message: string
  data: ExpenseSettlementData
}

export function useExpenseSettlement() {
  const [settlement, setSettlement] = useState<ExpenseSettlementData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExpenseSettlement = useCallback(async (expenseId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get<ExpenseSettlementResponse>(`/expenses/${expenseId}/settlement`)
      const data = (response as any) as ExpenseSettlementResponse
      setSettlement(data?.data || null)
      return data?.data || null
    } catch (err) {
      setError("Lấy chi tiết chi phí thất bại")
      console.error("Fetch expense settlement error:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { settlement, isLoading, error, fetchExpenseSettlement }
}
