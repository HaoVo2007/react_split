import { formatMoney } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface BalanceSummaryProps {
  totalPaid: number
  totalOwed: number
}

export function BalanceSummary({ totalPaid, totalOwed }: BalanceSummaryProps) {
  const balance = totalPaid - totalOwed

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      {/* Balance Total */}
      <div className="mb-6">
        <p className="text-slate-600 text-sm font-medium mb-2">Tổng số dư</p>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-3xl font-bold font-display ${balance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
              {balance >= 0 ? "+" : "-"}
              {formatMoney(Math.abs(balance))}
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
          <p className="text-xl font-bold text-emerald-600 font-display">
            {formatMoney(totalPaid)}
          </p>
        </div>

        {/* Bạn nợ */}
        <div className="p-4 bg-red-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700">Bạn nợ</p>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-xl font-bold text-red-500 font-display">
            {formatMoney(totalOwed)}
          </p>
        </div>
      </div>
    </div>
  )
}
