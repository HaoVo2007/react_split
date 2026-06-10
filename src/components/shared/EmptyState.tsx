import { ReactNode } from "react"
import type { LucideIcon as LucideIconType } from "lucide-react"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-[#4F7CFF] rounded-full animate-spin" />
    </div>
  )
}

interface EmptyStateProps {
  icon?: LucideIconType
  title: string
  description: string
  action?: () => void
  actionLabel?: string
  children?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-slate-400" />
        </div>
      )}
      <p className="text-slate-900 font-semibold mb-1">{title}</p>
      <p className="text-slate-500 text-sm mb-6">{description}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-6 py-2.5 bg-[#4F7CFF] hover:bg-[#3D6AEE] text-white rounded-lg font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
      {children}
    </div>
  )
}
