import { useState, useCallback } from "react"
import api from "@/lib/api"
import { Expense, CreateExpenseRequest } from "@/types"

interface ExpensesResponse {
  success: boolean
  message: string
  data: {
    expenses: Expense[]
    pagination: {
      page_size: number
      page_index: number
      total_items: number
      total_pages: number
    }
  }
}

interface ExpenseDetailResponse {
  success: boolean
  message: string
  data: Expense
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchExpenses = useCallback(
    async (groupId: string, pageIndex: number = 1, shouldAppend: boolean = false) => {
      if (pageIndex === 1) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }
      setError(null)
      try {
        const response = await api.get<ExpensesResponse>(
          `/expenses/group/${groupId}?page_index=${pageIndex}&page_size=${pageSize}`
        )
        const data = (response as any) as ExpensesResponse
        const expensesList = data?.data?.expenses || []
        const pagination = data?.data?.pagination

        if (shouldAppend && pageIndex > 1) {
          setExpenses((prev) => [...prev, ...expensesList])
        } else {
          setExpenses(expensesList)
        }

        if (pagination) {
          setCurrentPage(pagination.page_index)
          setTotalPages(pagination.total_pages)
          setHasMore(pagination.page_index < pagination.total_pages)
        }
      } catch (err) {
        setError("Lấy danh sách chi tiêu thất bại")
        if (pageIndex === 1) {
          setExpenses([])
        }
        console.error("Fetch expenses error:", err)
      } finally {
        if (pageIndex === 1) {
          setIsLoading(false)
        } else {
          setIsLoadingMore(false)
        }
      }
    },
    [pageSize]
  )

  const loadMore = useCallback(
    async (groupId: string) => {
      if (isLoadingMore || !hasMore) return
      await fetchExpenses(groupId, currentPage + 1, true)
    },
    [currentPage, isLoadingMore, hasMore, fetchExpenses]
  )

  const fetchExpenseById = useCallback(async (expenseId: string): Promise<Expense | null> => {
    try {
      const response = await api.get<ExpenseDetailResponse>(`/expenses/${expenseId}`)
      const data = (response as any) as ExpenseDetailResponse
      return data?.data || null
    } catch (err) {
      console.error("Fetch expense detail error:", err)
      throw err
    }
  }, [])

  const createExpense = useCallback(async (data: CreateExpenseRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("amount", String(data.amount))
      formData.append("category", data.category)
      formData.append("group_id", data.group_id)
      formData.append("paid_by", data.paid_by)
      formData.append("date", data.date)
      
      data.participants.forEach((participantId) => {
        formData.append("participants", participantId)
      })

      if (data.participant_splits) {
        formData.append("participant_splits", JSON.stringify(data.participant_splits))
      }

      if (data.image) {
        formData.append("image", data.image)
      }

      const response = await api.post<any>("/expenses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      const newExpense = response as any as Expense
      setExpenses((prev) => [newExpense, ...prev])
      return newExpense
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Tạo chi tiêu thất bại"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateExpense = useCallback(async (expenseId: string, data: CreateExpenseRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("amount", String(data.amount))
      formData.append("category", data.category)
      formData.append("group_id", data.group_id)
      formData.append("paid_by", data.paid_by)
      formData.append("date", data.date)
      
      data.participants.forEach((participantId) => {
        formData.append("participants", participantId)
      })

      if (data.participant_splits) {
        formData.append("participant_splits", JSON.stringify(data.participant_splits))
      }

      if (data.image instanceof File) {
        formData.append("image", data.image)
      }

      const response = await api.put<any>(`/expenses/${expenseId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      const updatedExpense = response as any as Expense
      setExpenses((prev) =>
        prev.map((exp) => (exp.id === expenseId ? updatedExpense : exp))
      )
      return updatedExpense
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Cập nhật chi tiêu thất bại"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteExpense = useCallback(async (expenseId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await api.delete(`/expenses/${expenseId}`)
      setExpenses((prev) => prev.filter((exp) => exp.id !== expenseId))
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Xóa chi tiêu thất bại"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { 
    expenses, 
    isLoading, 
    isLoadingMore,
    error, 
    hasMore,
    currentPage,
    totalPages,
    fetchExpenses, 
    loadMore,
    fetchExpenseById, 
    createExpense, 
    updateExpense, 
    deleteExpense 
  }
}
