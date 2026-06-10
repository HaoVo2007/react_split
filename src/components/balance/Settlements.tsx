import { Settlement } from "@/types"
import { UserAvatar } from "@/components/shared/UserAvatar"
import { ArrowRight } from "lucide-react"

interface SettlementsProps {
  settlements: Settlement[]
}

export function Settlements({ settlements }: SettlementsProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  if (settlements.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Thanh toán cần thực hiện</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-slate-600 font-medium">Tất cả đều thanh toán xong!</p>
          <p className="text-slate-500 text-sm mt-1">Không có khoản nợ nào cần giải quyết</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Thanh toán cần thực hiện</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {settlements.map((settlement, index) => (
          <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
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
    </div>
  )
}
