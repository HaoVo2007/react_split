import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'
import { Button, type ButtonProps } from './Button'

/**
 * EmptyState Component
 * 
 * Displayed when there's no data to show. Includes icon, title, description,
 * and optional action button.
 * 
 * @example
 * <EmptyState
 *   icon={<FolderIcon />}
 *   title="No projects yet"
 *   description="Create your first project to get started"
 *   action={{ label: "Create Project", onClick: handleCreate }}
 * />
 */

export interface EmptyStateProps {
  /** Icon to display (usually a Lucide icon) */
  icon?: ReactNode
  /** Size of the icon container */
  iconSize?: 'sm' | 'md' | 'lg'
  /** Main heading */
  title: string
  /** Description text */
  description?: string
  /** Primary action button */
  action?: {
    label: string
    onClick: () => void
    variant?: ButtonProps['variant']
  }
  /** Secondary action (link or button) */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** Compact version for inline use */
  compact?: boolean
  /** Additional class names */
  className?: string
}

const iconSizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-20 h-20',
}

const iconSizeIconClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
}

export const EmptyState = ({
  icon,
  iconSize = 'md',
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className,
}: EmptyStateProps) => {
  if (compact) {
    return (
      <div className={cn('flex items-center gap-3 py-4', className)}>
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            <div className="w-5 h-5">{icon}</div>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-slate-900">{title}</p>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12',
        className
      )}
    >
      {icon && (
        <div
          className={cn(
            'bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4',
            iconSizeClasses[iconSize]
          )}
        >
          <div className={iconSizeIconClasses[iconSize]}>{icon}</div>
        </div>
      )}

      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      )}

      {action && (
        <Button
          variant={action.variant || 'primary'}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}

      {secondaryAction && (
        <button
          onClick={secondaryAction.onClick}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {secondaryAction.label}
        </button>
      )}
    </div>
  )
}

EmptyState.displayName = 'EmptyState'

// Preset empty states for common scenarios
export const EmptySearchResults = ({
  searchTerm,
  onClear,
}: {
  searchTerm: string
  onClear: () => void
}) => (
  <EmptyState
    icon={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    }
    title="Không tìm thấy kết quả"
    description={`Không có kết quả cho "${searchTerm}". Hãy thử tìm kiếm khác.`}
    action={{ label: 'Xóa tìm kiếm', onClick: onClear, variant: 'secondary' }}
  />
)

export const EmptyExpenses = ({ onCreate }: { onCreate: () => void }) => (
  <EmptyState
    icon={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
        />
      </svg>
    }
    title="Chưa có chi phí nào"
    description="Thêm chi phí đầu tiên để bắt đầu theo dõi"
    action={{ label: 'Thêm chi phí', onClick: onCreate, variant: 'primary' }}
  />
)

export const EmptyGroups = ({ onCreate }: { onCreate: () => void }) => (
  <EmptyState
    icon={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        />
      </svg>
    }
    title="Chưa có nhóm nào"
    description="Tạo nhóm đầu tiên để bắt đầu chia sẻ chi phí với bạn bè"
    action={{ label: 'Tạo nhóm', onClick: onCreate, variant: 'primary' }}
  />
)
