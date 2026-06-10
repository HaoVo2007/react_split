import { useAuth } from "@/hooks/useAuth"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-display">Dashboard</h1>
              <p className="text-slate-500 mt-2">Xin chào, {user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-[#EEF2FF] rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Thông tin tài khoản</h3>
              <div className="space-y-2">
                <p className="text-slate-600">
                  <span className="text-slate-500">Email: </span>
                  <span className="font-medium">{user?.email}</span>
                </p>
                <p className="text-slate-600">
                  <span className="text-slate-500">ID: </span>
                  <span className="font-medium">{user?.id}</span>
                </p>
                <p className="text-slate-600">
                  <span className="text-slate-500">Role: </span>
                  <span className="font-medium capitalize">{user?.role}</span>
                </p>
              </div>
            </div>

            <div className="bg-[#F0FDF4] rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-700 mb-2">Trạng thái tài khoản</h3>
              <div className="space-y-2">
                <p className="text-slate-600">
                  <span className="text-slate-500">Status: </span>
                  <span className="font-medium capitalize text-emerald-600">{user?.status}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 text-center">
              🚀 Tính năng tiếp theo: Tạo nhóm, thêm chi tiêu, chia sẻ với bạn bè
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
