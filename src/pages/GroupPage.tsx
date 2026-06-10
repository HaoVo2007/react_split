import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Plus, ArrowLeft } from "lucide-react"
import { useGroupDetail } from "@/hooks/useGroupDetail"
import { useExpenses } from "@/hooks/useExpenses"
import { useGroupMembers } from "@/hooks/useGroupMembers"
import { useGroupBalance } from "@/hooks/useGroupBalance"
import { AppHeader } from "@/components/layout/AppHeader"
import { BottomNavigation } from "@/components/layout/BottomNavigation"
import { CreateExpenseModal } from "@/components/expenses/CreateExpenseModal"
import { ExpenseCard } from "@/components/expenses/ExpenseCard"
import { BalanceSummary } from "@/components/balance/BalanceSummary"
import { DetailsModal } from "@/components/balance/DetailsModal"
import { AddMemberCard } from "@/components/groups/AddMemberCard"
import { EmptyState } from "@/components/shared/EmptyState"
import { Skeleton } from "@/components/shared/Skeleton"
import type { Group, GroupMember, Expense, GroupBalance } from "@/types"

export function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const { fetchGroupDetail, isLoading: isGroupLoading, error: groupError } = useGroupDetail()
  const { expenses, isLoading: isExpensesLoading, isLoadingMore, error: expensesError, hasMore, fetchExpenses, loadMore, fetchExpenseById, createExpense, updateExpense, deleteExpense } = useExpenses()
  const { fetchGroupMembers } = useGroupMembers()
  const { isLoading: isBalanceLoading, fetchGroupBalance: fetchGroupBalanceHook } = useGroupBalance()
  
  const [group, setGroup] = useState<Group | null>(null)
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
  const [groupBalance, setGroupBalance] = useState<GroupBalance | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isLoadingExpense, setIsLoadingExpense] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!groupId) return

    const loadData = async () => {
      try {
        const groupData = await fetchGroupDetail(groupId)
        setGroup(groupData as unknown as Group)
        await fetchExpenses(groupId)
        const balanceData = await fetchGroupBalanceHook(groupId)
        setGroupBalance(balanceData)
        const membersList = await fetchGroupMembers(groupId)
        setGroupMembers(membersList || [])
      } catch (err) {
        console.error("Failed to load group:", err)
      }
    }

    loadData()
  }, [groupId])

  const handleCreateExpense = async (formData: any) => {
    if (!groupId) return

    setIsSubmitting(true)
    try {
      console.log("Creating expense with data:", formData)
      await createExpense({
        ...formData,
        group_id: groupId,
      })
      console.log("Expense created successfully")
      // Refetch expenses and balance after creation
      await fetchExpenses(groupId)
      const balanceData = await fetchGroupBalanceHook(groupId)
      setGroupBalance(balanceData)
      // Close modal after successful creation
      setIsModalOpen(false)
      setEditingExpense(null)
    } catch (err: any) {
      console.error("Failed to create expense:", err?.message || err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditExpense = async (expense: Expense) => {
    setIsLoadingExpense(true)
    try {
      const detailData = await fetchExpenseById(expense.id)
      setEditingExpense(detailData || null)
      setIsModalOpen(true)
    } catch (err) {
      console.error("Failed to load expense:", err)
    } finally {
      setIsLoadingExpense(false)
    }
  }

  const handleUpdateExpense = async (formData: any) => {
    if (!editingExpense || !groupId) return

    setIsSubmitting(true)
    try {
      console.log("Updating expense with data:", formData)
      await updateExpense(editingExpense.id, {
        ...formData,
        group_id: groupId,
      })
      console.log("Expense updated successfully")
      // Refetch expenses and balance after update
      await fetchExpenses(groupId)
      const balanceData = await fetchGroupBalanceHook(groupId)
      setGroupBalance(balanceData)
      // Close modal after successful update
      setIsModalOpen(false)
      setEditingExpense(null)
    } catch (err: any) {
      console.error("Failed to update expense:", err?.message || err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    if (!groupId) return

    setIsSubmitting(true)
    try {
      console.log("Deleting expense:", expenseId)
      await deleteExpense(expenseId)
      console.log("Expense deleted successfully")
      // Refetch expenses and balance after deletion
      await fetchExpenses(groupId)
      const balanceData = await fetchGroupBalanceHook(groupId)
      setGroupBalance(balanceData)
    } catch (err: any) {
      console.error("Failed to delete expense:", err?.message || err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingExpense(null)
  }

  // Infinite scroll effect
  useEffect(() => {
    if (!groupId) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore(groupId)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [groupId, hasMore, isLoadingMore, loadMore])

  if (isGroupLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] pb-24 md:pb-8">
        <AppHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <Skeleton className="h-48 rounded-2xl mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
        <BottomNavigation />
      </div>
    )
  }

  if (groupError || !group) {
    return (
      <div className="min-h-screen bg-[#F8FAFF] pb-24 md:pb-8">
        <AppHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <EmptyState
            icon={ArrowLeft}
            title="Không tìm thấy nhóm"
            description="Nhóm này có thể đã bị xóa"
            action={() => navigate("/groups")}
            actionLabel="Quay lại danh sách"
          />
        </div>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] pb-24 md:pb-8">
      <AppHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Balance Summary with Header - Loading or Display */}
        {isBalanceLoading ? (
          <Skeleton className="h-32 rounded-2xl" />
        ) : groupBalance ? (
          <BalanceSummary
            balance={groupBalance}
            onBack={() => navigate("/groups")}
            onViewDetails={() => setIsDetailsModalOpen(true)}
          />
        ) : null}

        {/* Details Modal */}
        <DetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          balance={groupBalance}
        />

        {/* Add Member Card */}
        <AddMemberCard 
          groupId={groupId!}
          onMemberAdded={() => {
            // Optionally refresh members list
            if (groupId) {
              fetchGroupMembers(groupId).then(members => {
                setGroupMembers(members || [])
              })
            }
          }}
        />

        {/* Create Expense Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full px-4 py-3 bg-[#4F7CFF] hover:bg-[#3D6AEE] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm chi phí mới
        </button>

        {/* Error State */}
        {expensesError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{expensesError}</p>
          </div>
        )}

        {/* Expenses Section */}
        {isExpensesLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : !expenses || expenses.length === 0 ? (
          <EmptyState
            title="Chưa có chi phí nào"
            description="Hãy thêm chi phí đầu tiên cho nhóm này"
            action={() => setIsModalOpen(true)}
            actionLabel="Thêm chi phí"
          />
        ) : (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Danh sách chi phí</h2>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  groupMembers={group.members}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                  isDeleting={isSubmitting}
                />
              ))}
            </div>

            {/* Load More Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="py-8 flex justify-center">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#4F7CFF] animate-bounce" />
                    <p className="text-slate-600 text-sm font-medium">Đang tải thêm...</p>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Cuộn xuống để xem thêm</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Expense Modal */}
      <CreateExpenseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        groupMembers={groupMembers.length > 0 ? groupMembers : group.members}
        onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
        isSubmitting={isSubmitting || isLoadingExpense}
        expense={editingExpense}
        isEdit={!!editingExpense}
      />

      <BottomNavigation />
    </div>
  )
}
