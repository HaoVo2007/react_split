import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

interface UserProfile {
  name: string | null
  image: string | null
}

export function AppHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  // Load profile on mount
  useEffect(() => {
    const loadProfile = () => {
      const stored = localStorage.getItem("userProfile")
      if (stored) {
        setUserProfile(JSON.parse(stored))
      }
    }

    loadProfile()

    // Listen for profile updates from ProfilePage
    const handleProfileUpdate = () => {
      loadProfile()
    }

    window.addEventListener("profileUpdated", handleProfileUpdate)
    return () => window.removeEventListener("profileUpdated", handleProfileUpdate)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const displayName = userProfile?.name || user?.email
  const displayInitial = displayName?.charAt(0).toUpperCase() || "U"
  const avatarImage = userProfile?.image

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center">
            <img src="/images/common/logo.png" alt="SplitTrip Logo" className="w-16 h-16 object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">SplitTrip</h1>
          </div>
        </div>

        {/* Right - User Profile & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {/* Avatar */}
            {avatarImage ? (
              <img
                src={avatarImage}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center font-semibold text-[#4F7CFF] font-display">
                {displayInitial}
              </div>
            )}

            {/* User Name (Desktop only) */}
            <div className="hidden sm:flex flex-col items-start">
              <p className="text-sm font-semibold text-slate-900">{displayName}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-slate-200 z-50 overflow-hidden">
              {/* Profile Info */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  {avatarImage ? (
                    <img
                      src={avatarImage}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center font-semibold text-[#4F7CFF] font-display text-lg">
                      {displayInitial}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    navigate("/profile")
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  Hồ sơ cá nhân
                </button>
                <button
                  onClick={() => {
                    navigate("/settings")
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium border-b border-slate-100"
                >
                  Cài đặt
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
