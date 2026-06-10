import { useState } from "react"
import { UserPlus, Loader } from "lucide-react"
import api from "@/lib/api"

interface AddMemberCardProps {
  groupId: string
  onMemberAdded?: () => void
}

export function AddMemberCard({ groupId, onMemberAdded }: AddMemberCardProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError("Vui lòng nhập email")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await api.post(`/groups/${groupId}/members`, { email })
      setSuccess(true)
      setEmail("")
      
      setTimeout(() => {
        setSuccess(false)
      }, 3000)

      onMemberAdded?.()
    } catch (err: any) {
      const message = err.response?.data?.message || "Không thể thêm thành viên"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-[#4F7CFF]" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">Thêm thành viên</h3>
      </div>

      <form onSubmit={handleAddMember} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            placeholder="Nhập email thành viên"
            className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#4F7CFF] focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !email.trim()}
            className="px-4 py-2.5 bg-[#4F7CFF] hover:bg-[#3D6AEE] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {!isLoading && <span>Thêm</span>}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-xs font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-700 text-xs font-medium">Thêm thành viên thành công</p>
          </div>
        )}
      </form>
    </div>
  )
}
