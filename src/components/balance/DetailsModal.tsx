import { X } from "lucide-react"
import { GroupBalance } from "@/types"
import { MembersBalance } from "./MembersBalance"
import { Settlements } from "./Settlements"

interface DetailsModalProps {
  isOpen: boolean
  onClose: () => void
  balance: GroupBalance | null
}

export function DetailsModal({ isOpen, onClose, balance }: DetailsModalProps) {
  if (!isOpen || !balance) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0 bg-white">
          <h2 className="text-xl font-bold text-slate-900 font-display">Chi tiết nhóm</h2>
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
            {/* Members Balance Section */}
            {balance.members.length > 0 && (
              <div>
                <MembersBalance members={balance.members} />
              </div>
            )}

            {/* Settlements Section */}
            {balance.settlements && balance.settlements.length >= 0 && (
              <div>
                <Settlements settlements={balance.settlements} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
