import { Users, Bell, MessageSquare, Settings } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const tabs = [
    { path: "/groups", icon: Users, label: "Nhóm", color: "#4F7CFF" },
    { path: "/activity", icon: Bell, label: "Hoạt động", color: "#94A3B8" },
    { path: "/chat", icon: MessageSquare, label: "Chat", color: "#94A3B8" },
    { path: "/profile", icon: Settings, label: "Hồ sơ", color: "#94A3B8" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex justify-around items-center md:hidden">
      {tabs.map(({ path, icon: Icon, label }) => {
        const active = isActive(path)
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors"
            style={{
              backgroundColor: active ? "rgba(79, 124, 255, 0.1)" : "transparent",
            }}
          >
            <Icon
              className="w-6 h-6"
              style={{ color: active ? "#4F7CFF" : "#94A3B8" }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: active ? "#4F7CFF" : "#94A3B8" }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
