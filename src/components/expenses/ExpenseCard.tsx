import { useState } from "react"
import { Calendar, User, Tag, Image as ImageIcon, Edit, Trash2 } from "lucide-react"
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"
import { ExpenseSettlementModal } from "./ExpenseSettlementModal"
import { useExpenseSettlement } from "@/hooks/useExpenseSettlement"
import type { Expense, GroupMember } from "@/types"

interface ExpenseCardProps {
  expense: Expense
  groupMembers: GroupMember[]
  onEdit?: (expense: Expense) => void
  onDelete?: (expenseId: string) => Promise<void>
  isDeleting?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  hotel: "Khách sạn",
  food: "Ăn uống",
  transport: "Vận chuyển",
  activity: "Hoạt động",
  shopping: "Mua sắm",
  other: "Khác",
}

const CATEGORY_COLORS: Record<string, string> = {
  hotel: "bg-blue-50 text-blue-700",
  food: "bg-orange-50 text-orange-700",
  transport: "bg-green-50 text-green-700",
  activity: "bg-purple-50 text-purple-700",
  shopping: "bg-pink-50 text-pink-700",
  other: "bg-gray-50 text-gray-700",
}

export function ExpenseCard({ expense, onEdit, onDelete, isDeleting = false }: ExpenseCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false)
  const { settlement, isLoading: isLoadingSettlement, fetchExpenseSettlement } = useExpenseSettlement()

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
    setDeleteError(null)
  }

  const handleConfirmDelete = async () => {
    if (!onDelete) return
    try {
      await onDelete(expense.id)
      setIsDeleteDialogOpen(false)
    } catch (err: any) {
      setDeleteError(err.response?.data?.message || "Xóa chi phí thất bại")
    }
  }

  const handleDetailsClick = async () => {
    try {
      await fetchExpenseSettlement(expense.id)
      setIsSettlementModalOpen(true)
    } catch (err) {
      console.error("Failed to fetch settlement:", err)
    }
  }

  const paidByMember = expense.paid_by[0]
  const paidByName = paidByMember?.name || paidByMember?.email || "Unknown"

  const categoryLabel = CATEGORY_LABELS[expense.category] || expense.category
  const categoryColor = CATEGORY_COLORS[expense.category] || "bg-gray-50 text-gray-700"

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <>
      <div 
        onClick={handleDetailsClick}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-start gap-4">
          {/* Image or Placeholder */}
          {expense.image ? (
            <img
              src={expense.image}
              alt={expense.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-base font-semibold text-slate-900 truncate">
                {expense.name}
              </h3>
              <span className="text-base font-bold text-emerald-600 flex-shrink-0">
                +{formatMoney(expense.amount)}
              </span>
            </div>

            {/* Meta Info */}
            <div className="space-y-2">
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
                  {categoryLabel}
                </span>
              </div>

              {/* Paid By */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4 text-slate-400" />
                <span>Thanh toán bởi <span className="font-medium">{paidByName}</span></span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{formatDate(expense.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(expense)
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Edit expense"
              >
                <Edit className="w-4 h-4 text-slate-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteClick()
                }}
                disabled={isDeleting}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Delete expense"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settlement Modal */}
      <ExpenseSettlementModal
        isOpen={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
        expenseName={expense.name}
        totalAmount={expense.amount}
        members={settlement?.members || []}
        settlements={settlement?.settlements || []}
        isLoading={isLoadingSettlement}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xóa chi phí"
        description="Hành động này không thể hoàn tác. Chi phí này sẽ bị xóa vĩnh viễn."
        itemName={expense.name}
        isLoading={isDeleting}
        error={deleteError}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
