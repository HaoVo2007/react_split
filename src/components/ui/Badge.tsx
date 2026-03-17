import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import type { HTMLAttributes } from 'react'

/**
 * Badge Component
 * 
 * Small status indicators for labels, categories, and statuses.
 * 
 * @example
 * <Badge variant="primary">New</Badge>
 * <Badge variant="success" size="lg">Active</Badge>
 * <Badge variant="outline" dot>Online</Badge>
 */

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-100 text-blue-700',
        secondary: 'bg-slate-100 text-slate-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-cyan-100 text-cyan-700',
        outline: 'bg-white border border-slate-200 text-slate-700',
        ghost: 'bg-transparent text-slate-500',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px] rounded-full',
        md: 'px-2.5 py-1 text-xs rounded-full',
        lg: 'px-3 py-1.5 text-sm rounded-full',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  }
)

const dotVariants = cva('w-1.5 h-1.5 rounded-full', {
  variants: {
    variant: {
      primary: 'bg-blue-500',
      secondary: 'bg-slate-500',
      success: 'bg-green-500',
      warning: 'bg-amber-500',
      danger: 'bg-red-500',
      info: 'bg-cyan-500',
      outline: 'bg-slate-400',
      ghost: 'bg-slate-400',
    },
  },
  defaultVariants: {
    variant: 'secondary',
  },
})

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a dot indicator */
  dot?: boolean
  /** Dot color variant (defaults to badge variant) */
  dotColor?: VariantProps<typeof dotVariants>['variant']
  /** Remove padding for inline use */
  isInline?: boolean
}

export const Badge = ({
  children,
  variant,
  size,
  dot = false,
  dotColor,
  isInline = false,
  className,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={cn(
        badgeVariants({ variant, size }),
        isInline && 'px-0 py-0',
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(dotVariants({ variant: dotColor || variant }))}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}

Badge.displayName = 'Badge'

// Status badge presets
export const StatusBadge = ({
  status,
  children,
  ...props
}: Omit<BadgeProps, 'variant'> & { status: 'active' | 'inactive' | 'pending' | 'error' }) => {
  const statusMap = {
    active: { variant: 'success' as const, label: 'Đang hoạt động' },
    inactive: { variant: 'secondary' as const, label: 'Không hoạt động' },
    pending: { variant: 'warning' as const, label: 'Đang chờ' },
    error: { variant: 'danger' as const, label: 'Lỗi' },
  }

  const { variant, label } = statusMap[status]

  return (
    <Badge variant={variant} dot {...props}>
      {children || label}
    </Badge>
  )
}

StatusBadge.displayName = 'StatusBadge'
