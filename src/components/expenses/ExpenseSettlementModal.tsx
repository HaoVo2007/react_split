import { X, ArrowRight } from "lucide-react"
import { UserAvatar } from "@/components/shared/UserAvatar"
import type { SettlementMember, ExpenseSettlement } from "@/hooks/useExpenseSettlement"

interface ExpenseSettlementModalProps {
  isOpen: boolean
  onClose: () => void
  expenseName: string
  totalAmount: number
  members: SettlementMember[]
  settlements: ExpenseSettlement[]
  isLoading?: boolean
}

export function ExpenseSettlementModal({
  isOpen,
  onClose,
  expenseName,
  totalAmount,
  members,
  settlements,
  isLoading = false,
}: ExpenseSettlementModalProps) {
  if (!isOpen) return null

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0 bg-white">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 font-display">Chi tiết chi phí</h2>
            <p className="text-sm text-slate-500 mt-1">{expenseName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p className="text-slate-500">Đang tải...</p>
              </div>
            ) : (
              <>
                {/* Total Amount */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm font-medium text-slate-700 mb-2">Tổng chi phí</p>
                  <p className="text-2xl font-bold text-slate-900 font-display">
                    {formatMoney(totalAmount)}
                  </p>
                </div>

                {/* Members Balance */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <h3 className="text-base font-semibold text-slate-900 mb-4">Chi tiết thành viên</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {members.map((member) => (
                      <div
                        key={member.user_id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <UserAvatar
                            src={member.image || undefined}
                            name={member.name || member.email}
                            size="sm"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {member.name || member.email}
                            </p>
                            <p className="text-xs text-slate-500 truncate">{member.email}</p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 ml-2">
                          <div
                            className={`text-sm font-semibold ${
                              member.balance > 0 ? "text-emerald-600" : "text-red-500"
                            }`}
                          >
                            {member.balance > 0 ? "+" : ""}
                            {formatMoney(member.balance)}
                          </div>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 $`}
                          >
                            Số dư
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settlements */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <h3 className="text-base font-semibold text-slate-900 mb-4">Cách thanh toán</h3>
                  {settlements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                        <span className="text-2xl">✓</span>
                      </div>
                      <p className="text-slate-600 font-medium">Không cần thanh toán thêm!</p>
                      <p className="text-slate-500 text-sm mt-1">Tất cả đã được chia đều</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {settlements.map((settlement, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          {/* From User */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <UserAvatar
                              src={settlement.from_user.image || undefined}
                              name={settlement.from_user.name || settlement.from_user.email}
                              size="sm"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {settlement.from_user.name || settlement.from_user.email}
                              </p>
                            </div>
                          </div>

                          {/* Arrow */}
                          <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />

                          {/* To User */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <UserAvatar
                              src={settlement.to_user.image || undefined}
                              name={settlement.to_user.name || settlement.to_user.email}
                              size="sm"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-slate-900 truncate">
                                {settlement.to_user.name || settlement.to_user.email}
                              </p>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="flex-shrink-0 text-right">
                            <p className="text-sm font-semibold text-emerald-600 whitespace-nowrap">
                              {formatMoney(settlement.amount)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
