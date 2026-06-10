import { Users } from "lucide-react"

interface EmptyGroupsProps {
  onCreateGroup?: () => void
}

export function EmptyGroups({ onCreateGroup }: EmptyGroupsProps) {

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Chưa có nhóm nào</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-xs">
          Tạo nhóm mới để bắt đầu chia sẻ chi phí với bạn bè hoặc đồng nghiệp.
        </p>
        <button
          onClick={onCreateGroup}
          className="bg-[#4F7CFF] hover:bg-[#3D6AEE] text-white font-semibold py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <span>+</span>
          Tạo nhóm mới
        </button>
      </div>
    </div>
  )
}
