import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getExpensesByGroupId,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseSettlement,
  getGroupBalance
} from './api'
import { getGroupMembers, addGroupMember } from '../groups/api'
import type { Expense, GroupBalance } from './types'
import type { ExpenseSettlementResponse } from './settlementTypes'
import type { GroupMemberWithProfile } from '../groups/types'
import toast from 'react-hot-toast'

// Query keys for caching
const expensesKeys = {
  all: ['expenses'] as const,
  byGroup: (groupId: string) => ['expenses', 'group', groupId] as const,
  settlement: (expenseId: string) => ['expenses', 'settlement', expenseId] as const,
}

const membersKeys = {
  all: ['members'] as const,
  byGroup: (groupId: string) => ['members', 'group', groupId] as const,
}

const balanceKeys = {
  all: ['balance'] as const,
  byGroup: (groupId: string) => ['balance', 'group', groupId] as const,
}

// Dashboard keys for invalidation
const dashboardKeys = {
  all: ['dashboard'] as const,
}

/**
 * Hook to fetch expenses by group ID
 */
export const useExpenses = (groupId: string) => {
  return useQuery<Expense[], Error>({
    queryKey: expensesKeys.byGroup(groupId),
    queryFn: () => getExpensesByGroupId(groupId),
    enabled: !!groupId,
  })
}

/**
 * Hook to fetch group members
 */
export const useGroupMembers = (groupId: string) => {
  return useQuery<GroupMemberWithProfile[], Error>({
    queryKey: membersKeys.byGroup(groupId),
    queryFn: () => getGroupMembers(groupId),
    enabled: !!groupId,
  })
}

/**
 * Hook to create a new expense
 */
export const useCreateExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => addExpense(formData),
    onSuccess: (_, variables) => {
      toast.success('Expense added successfully!')
      // Invalidate all expense queries to refetch
      queryClient.invalidateQueries({ queryKey: expensesKeys.all })
      // Invalidate dashboard to update overview stats
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
      // Invalidate balance queries
      queryClient.invalidateQueries({ queryKey: balanceKeys.all })
      
      // Get groupId from formData for targeted balance invalidation
      const groupId = variables.get('group_id')
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: balanceKeys.byGroup(groupId as string) })
      }
    },
    // Error toast is already shown by API interceptor
  })
}

/**
 * Hook to update an expense
 */
export const useUpdateExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ expenseId, formData }: { expenseId: string; formData: FormData }) =>
      updateExpense(expenseId, formData),
    onSuccess: (_, variables) => {
      toast.success('Expense updated successfully!')
      // Invalidate all expense queries to refetch
      queryClient.invalidateQueries({ queryKey: expensesKeys.all })
      // Invalidate dashboard to update overview stats
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
      // Invalidate balance queries
      queryClient.invalidateQueries({ queryKey: balanceKeys.all })
      
      // Get groupId from formData for targeted balance invalidation
      const groupId = variables.formData.get('group_id')
      if (groupId) {
        queryClient.invalidateQueries({ queryKey: balanceKeys.byGroup(groupId as string) })
      }
    },
    // Error toast is already shown by API interceptor
  })
}

/**
 * Hook to delete an expense
 */
export const useDeleteExpense = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (expenseId: string) => deleteExpense(expenseId),
    onSuccess: () => {
      toast.success('Expense deleted successfully!')
      // Invalidate all expense queries to refetch
      queryClient.invalidateQueries({ queryKey: expensesKeys.all })
    },
    // Error toast is already shown by API interceptor
  })
}

/**
 * Hook to fetch expense settlement
 */
export const useExpenseSettlement = (expenseId: string) => {
  return useQuery<ExpenseSettlementResponse, Error>({
    queryKey: expensesKeys.settlement(expenseId),
    queryFn: () => getExpenseSettlement(expenseId),
    enabled: !!expenseId,
  })
}

/**
 * Hook to add a member to the group
 */
export const useAddGroupMember = (groupId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (email: string) => addGroupMember(groupId, email),
    onSuccess: () => {
      toast.success('Member added successfully!')
      // Invalidate members query to refetch the list
      queryClient.invalidateQueries({ queryKey: membersKeys.byGroup(groupId) })
    },
    // Error toast is already shown by API interceptor
  })
}

/**
 * Hook to fetch group balance (overview data)
 */
export const useGroupBalance = (groupId: string) => {
  return useQuery<GroupBalance, Error>({
    queryKey: balanceKeys.byGroup(groupId),
    queryFn: () => getGroupBalance(groupId),
    enabled: !!groupId,
  })
}
