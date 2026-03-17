import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'
import { Button } from './Button'

/**
 * SectionHeader Component
 * 
 * A consistent header for page sections with title, subtitle,
 * and optional action button.
 * 
 * @example
 * <SectionHeader
 *   title="Groups"
 *   subtitle="Manage your travel groups"
 *   action={{ label: "Create Group", onClick: handleCreate }}
 * />
 * 
 * <SectionHeader title="Settings" align="center" />
 */

export interface SectionHeaderProps {
  /** Section title */
  title: string
  /** Optional subtitle/description */
  subtitle?: string
  /** Alignment of the header content */
  align?: 'left' | 'center'
  /** Primary action button */
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
    variant?: 'primary' | 'secondary' | 'outline'
  }
  /** Additional content on the right side */
  rightContent?: ReactNode
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Additional class names */
  className?: string
}

const sizeClasses = {
  sm: {
    title: 'text-lg',
    subtitle: 'text-xs',
  },
  md: {
    title: 'text-xl',
    subtitle: 'text-sm',
  },
  lg: {
    title: 'text-2xl',
    subtitle: 'text-base',
  },
}

export const SectionHeader = ({
  title,
  subtitle,
  align = 'left',
  action,
  rightContent,
  size = 'md',
  className,
}: SectionHeaderProps) => {
  const sizes = sizeClasses[size]

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center gap-4 mb-6',
        align === 'center' && 'sm:flex-col text-center',
        className
      )}
    >
      <div className={cn('flex-1', align === 'center' && 'flex flex-col items-center')}>
        <h2 className={cn('font-semibold text-slate-900', sizes.title)}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn('text-slate-500 mt-0.5', sizes.subtitle)}>
            {subtitle}
          </p>
        )}
      </div>

      {(action || rightContent) && (
        <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
          {action && (
            <Button
              variant={action.variant || 'primary'}
              size="sm"
              onClick={action.onClick}
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          )}
          {rightContent}
        </div>
      )}
    </div>
  )
}

SectionHeader.displayName = 'SectionHeader'

// Page header with larger title and breadcrumb support
export interface PageHeaderProps extends Omit<SectionHeaderProps, 'size'> {
  /** Breadcrumb items */
  breadcrumbs?: Array<{ label: string; href?: string }>
  /** Back button handler */
  onBack?: () => void
  /** Badge to show next to title */
  badge?: ReactNode
}

export const PageHeader = ({
  title,
  subtitle,
  action,
  rightContent,
  breadcrumbs,
  onBack,
  badge,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn('mb-8', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className={cn(index === breadcrumbs.length - 1 && 'text-slate-900 font-medium')}>
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Quay lại
        </button>
      )}

      {/* Main content */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>

        {(action || rightContent) && (
          <div className="flex items-center gap-3">
            {action && (
              <Button
                variant={action.variant || 'primary'}
                onClick={action.onClick}
                leftIcon={action.icon}
              >
                {action.label}
              </Button>
            )}
            {rightContent}
          </div>
        )}
      </div>
    </div>
  )
}

PageHeader.displayName = 'PageHeader'

// Stats row for dashboard headers
export interface StatsRowProps {
  stats: Array<{
    label: string
    value: string | number
    trend?: {
      value: number
      isPositive: boolean
    }
  }>
  className?: string
}

export const StatsRow = ({ stats, className }: StatsRowProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8',
        className
      )}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-slate-200 p-4"
        >
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
            {stat.label}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            {stat.trend && (
              <span
                className={cn(
                  'text-xs font-medium flex items-center',
                  stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                <svg
                  className={cn(
                    'w-3 h-3',
                    !stat.trend.isPositive && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {stat.trend.value}%
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

StatsRow.displayName = 'StatsRow'
