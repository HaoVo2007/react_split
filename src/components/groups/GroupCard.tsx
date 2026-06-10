import { Group, ApiResponse } from "@/types"
import { Users, Edit, Trash2, Loader } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useGroupDetail } from "@/hooks/useGroupDetail"

interface GroupCardProps {
  group: Group
  onEdit?: (group: Group) => void
  onDelete?: (group: Group) => void
}

export function GroupCard({ group, onEdit, onDelete }: GroupCardProps) {
  const navigate = useNavigate()
  const [loadingDetail, setLoadingDetail] = useState(false)
  const { fetchGroupDetail } = useGroupDetail()

  const handleEditClick = async () => {
    setLoadingDetail(true)
    try {
      const response = await fetchGroupDetail(group.id)
      const detailedGroup = (response as unknown as ApiResponse<Group>).data || response
      onEdit?.(detailedGroup as Group)
    } catch (error) {
      console.error("Failed to fetch group details:", error)
    } finally {
      setLoadingDetail(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow group">
      <div className="flex items-start gap-4">
        {/* Group Image */}
        <div className="relative flex-shrink-0">
          {group.image ? (
            <img
              src={group.image}
              alt={group.name}
              className="w-16 h-16 rounded-2xl object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/64?text=" + encodeURIComponent(group.name.charAt(0))
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
              <span className="text-2xl font-bold text-[#4F7CFF] font-display">
                {group.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => navigate(`/groups/${group.id}`)}
            >
              <h3 className="text-base font-semibold text-slate-900 truncate hover:text-[#4F7CFF] transition-colors">
                {group.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {group.description || "Không có mô tả"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-2">
              {onEdit && (
                <button
                  onClick={handleEditClick}
                  disabled={loadingDetail}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Edit group"
                >
                  {loadingDetail ? (
                    <Loader className="w-4 h-4 animate-spin text-slate-600" />
                  ) : (
                    <Edit className="w-4 h-4 text-slate-600" />
                  )}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(group)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete group"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          </div>

          {/* Members */}
          <div className="flex items-center gap-1 text-xs text-slate-600 mt-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {group.total_members} thành viên
              {group.total_members > 1 && ` (+${group.total_members - 1})`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
