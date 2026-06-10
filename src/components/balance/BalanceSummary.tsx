import { GroupBalance } from "@/types"
import { TrendingUp, TrendingDown, DollarSign, ArrowLeft } from "lucide-react"

interface BalanceSummaryProps {
  balance: GroupBalance
  onBack: () => void
  onViewDetails: () => void
}

export function BalanceSummary({ balance, onBack, onViewDetails }: BalanceSummaryProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const netBalance = balance.total_paid - balance.total_owed

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Header with Back & Details Buttons */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 -ml-2"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <button
          onClick={onViewDetails}
          className="px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0"
        >
          Xem chi tiết
        </button>
      </div>

      {/* Balance Total */}
            {/* Total Expenses */}
            <div className="mb-6 p-4 bg-slate-50 rounded-xl">
        <p className="text-sm font-medium text-slate-700 mb-2">Tổng chi phí nhóm</p>
        <p className="text-2xl font-bold text-slate-900 font-display">
          {formatMoney(balance.total_expenses)}
        </p>
      </div>
      
      <div className="mb-6">
        <p className="text-slate-600 text-sm font-medium mb-2">Tổng số dư</p>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-3xl font-bold font-display ${netBalance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {netBalance >= 0 ? "+" : "-"}
              {formatMoney(Math.abs(netBalance))}
            </p>
          </div>
        </div>
      </div>

      {/* Paid & Owed Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Bạn được nợ */}
        <div className="p-4 bg-emerald-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700">Bạn được nợ</p>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-emerald-600 font-display">
            {formatMoney(balance.total_paid)}
          </p>
        </div>

        {/* Bạn nợ */}
        <div className="p-4 bg-red-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700">Bạn nợ</p>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-lg font-bold text-red-500 font-display">
            {formatMoney(balance.total_owed)}
          </p>
        </div>
      </div>
    </div>
  )
}
