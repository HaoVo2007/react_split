import { MemberBalance } from "@/types"
import { UserAvatar } from "@/components/shared/UserAvatar"

interface MembersBalanceProps {
  members: MemberBalance[]
}

export function MembersBalance({ members }: MembersBalanceProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Chi tiết thành viên</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
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
                className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1`}
              >
                Số dư
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
