import { useEffect, useState } from 'react'
import { X, ArrowRight, Receipt, Users, Wallet, ArrowLeftRight } from 'lucide-react'
import type { ExpenseSettlementResponse} from '../../features/expenses/settlementTypes'
import { getExpenseSettlement } from '../../features/expenses/api'

interface ExpenseDetailModalProps {
  expenseId: string
  expenseName: string
  isOpen: boolean
  onClose: () => void
}

const ExpenseDetailModal = ({ expenseId, expenseName, isOpen, onClose }: ExpenseDetailModalProps) => {
  const [settlementData, setSettlementData] = useState<ExpenseSettlementResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && expenseId) {
      fetchSettlement()
    }
  }, [isOpen, expenseId])

  const fetchSettlement = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getExpenseSettlement(expenseId)
      setSettlementData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin thanh toán')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number): string => {
    const vndAmount = Math.round(amount * 1000)
    const formatted = vndAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `${formatted} VND`
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600'
    if (balance < 0) return 'text-red-600'
    return 'text-slate-600'
  }

  const getBalanceBg = (balance: number) => {
    if (balance > 0) return 'bg-green-50'
    if (balance < 0) return 'bg-red-50'
    return 'bg-slate-50'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'creditor':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Được trả</span>
      case 'debtor':
        return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">Nợ</span>
      default:
        return <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">Đã xong</span>
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal Header - Sticky */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl sm:rounded-t-2xl z-10">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">Chi tiết chi phí</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 truncate">{expenseName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={fetchSettlement}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Thử lại
              </button>
            </div>
          ) : settlementData ? (
            <>
              {/* Section 1 - Expense Summary */}
              <div className="bg-blue-50 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Tổng quan</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Tổng số tiền</p>
                    <p className="text-sm sm:text-lg font-bold text-slate-900">{formatCurrency(settlementData.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Mã chi phí</p>
                    <p className="text-xs sm:text-sm font-mono text-slate-700 truncate">{settlementData.expense_id.slice(-8)}</p>
                  </div>
                </div>
              </div>

              {/* Section 2 - Members Breakdown - Mobile Card Layout */}
              <div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Thành viên</h3>
                </div>
                
                {/* Mobile: Card Layout */}
                <div className="sm:hidden space-y-2">
                  {settlementData.members.map((member) => (
                    <div
                      key={member.user_id}
                      className={`p-3 rounded-xl ${getBalanceBg(member.balance)}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                          alt={member.name}
                          className="w-10 h-10 rounded-full border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{member.name}</p>
                          <div className="mt-0.5">{getStatusBadge(member.status)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs text-slate-500">Trả</p>
                          <p className="text-xs font-medium text-slate-700">{formatCurrency(member.total_paid)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Nợ</p>
                          <p className="text-xs font-medium text-slate-700">{formatCurrency(member.total_owed)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Cân bằng</p>
                          <p className={`text-xs font-bold ${getBalanceColor(member.balance)}`}>
                            {member.balance > 0 ? '+' : ''}{formatCurrency(member.balance)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Table Layout */}
                <div className="hidden sm:block border border-slate-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 text-xs font-medium text-slate-500">
                    <div className="col-span-4">Thành viên</div>
                    <div className="col-span-2 text-right">Trả</div>
                    <div className="col-span-2 text-right">Nợ</div>
                    <div className="col-span-4 text-right">Cân bằng</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {settlementData.members.map((member) => (
                      <div
                        key={member.user_id}
                        className={`grid grid-cols-12 gap-2 px-4 py-3 items-center ${getBalanceBg(member.balance)}`}
                      >
                        <div className="col-span-4 flex items-center gap-2">
                          <img
                            src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                            alt={member.name}
                            className="w-8 h-8 rounded-full border border-slate-200"
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{member.name}</p>
                            <div className="mt-0.5">{getStatusBadge(member.status)}</div>
                          </div>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="text-xs font-medium text-slate-700">{formatCurrency(member.total_paid)}</p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="text-xs font-medium text-slate-700">{formatCurrency(member.total_owed)}</p>
                        </div>
                        <div className="col-span-4 text-right">
                          <p className={`text-xs font-bold ${getBalanceColor(member.balance)}`}>
                            {member.balance > 0 ? '+' : ''}{formatCurrency(member.balance)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3 - Settlement */}
              {settlementData.settlements.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Thanh toán</h3>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {settlementData.settlements.map((settlement, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center p-2 sm:p-4 bg-slate-50 rounded-xl gap-2 sm:gap-4"
                      >
                        {/* From User */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <img
                            src={settlement.from_user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(settlement.from_user.name)}&background=random`}
                            alt={settlement.from_user.name}
                            className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-slate-200"
                          />
                          <div className="text-left">
                            <p className="text-xs sm:text-sm font-medium text-slate-900 leading-tight">{settlement.from_user.name}</p>
                            <p className="text-[10px] sm:text-xs text-slate-500">Trả</p>
                          </div>
                        </div>

                        {/* Amount & Arrow */}
                        <div className="flex items-center justify-center gap-1 sm:gap-2 px-2 flex-shrink-0">
                          <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 text-slate-400 hidden sm:block" />
                          <span className="text-xs sm:text-base font-bold text-slate-900 whitespace-nowrap">
                            {formatCurrency(settlement.amount)}
                          </span>
                          <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 text-slate-400 sm:hidden" />
                        </div>

                        {/* To User */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className="text-xs sm:text-sm font-medium text-slate-900 leading-tight">{settlement.to_user.name}</p>
                            <p className="text-[10px] sm:text-xs text-slate-500">Nhận</p>
                          </div>
                          <img
                            src={settlement.to_user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(settlement.to_user.name)}&background=random`}
                            alt={settlement.to_user.name}
                            className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border border-slate-200"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 4 - Visual Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Phân chia</h3>
                </div>
                <div className="space-y-2">
                  {settlementData.members.map((member) => (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={member.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
                          alt={member.name}
                          className="w-6 h-6 rounded-full border border-slate-200 flex-shrink-0"
                        />
                        <span className="text-sm font-medium text-slate-700 truncate">{member.name}</span>
                      </div>
                      <span className="text-xs text-slate-600 flex-shrink-0 ml-2">
                        {member.balance > 0 ? (
                          <span className="text-green-600">Nhận: {formatCurrency(member.balance)}</span>
                        ) : member.balance < 0 ? (
                          <span className="text-red-600">Nợ: {formatCurrency(Math.abs(member.balance))}</span>
                        ) : (
                          <span className="text-slate-500">Đã xong</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 sm:p-6 border-t border-slate-200 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExpenseDetailModal
