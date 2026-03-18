import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { useAuthActions } from '../../../features/auth/hooks'
import { Home, Users, User, SplitSquareHorizontal, LogOut, X } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation()
  const { currentUser } = useAuthStore()
  const { logout } = useAuthActions()

  const isActive = (path: string) => location.pathname === path

  const menuItems = [
    { label: 'Trang chủ', path: '/dashboard', icon: Home },
    { label: 'Nhóm của bạn', path: '/groups', icon: Users },
    { label: 'Hồ sơ', path: '/profile', icon: User },
  ]

  // Determine display name
  const displayName = currentUser?.profile?.name || currentUser?.email || 'Người dùng'

  // Determine avatar
  const avatarUrl = currentUser?.profile?.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName)

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-gradient-to-b from-white to-slate-50 shadow-lg border-r border-slate-200/60 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <SplitSquareHorizontal className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            TravelSplit
          </h1>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-[1.02]'
                  : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-900 hover:transform hover:scale-[1.01]'
              }`}
            >
              <IconComponent
                className={`w-5 h-5 transition-colors duration-200 ${
                  active ? 'text-white' : 'text-slate-500 group-hover:text-blue-500'
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white shadow-sm"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {currentUser?.email}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 transition-colors duration-200" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
