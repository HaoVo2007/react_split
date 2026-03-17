import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import type { HTMLAttributes, ReactNode } from 'react'

/**
 * Card Component
 * 
 * A flexible card component with various padding, shadow, and hover variants.
 * 
 * @example
 * <Card>
 *   <CardHeader title="Title" subtitle="Subtitle" />
 *   <CardBody>Content</CardBody>
 *   <CardFooter>Footer</CardFooter>
 * </Card>
 * 
 * <Card variant="outline" hoverable>
 *   <CardBody>Hoverable outlined card</CardBody>
 * </Card>
 */

const cardVariants = cva(
  // Base styles
  'bg-white rounded-2xl transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'shadow-lg border border-slate-200',
        outline: 'border border-slate-200 shadow-none',
        filled: 'bg-slate-50 border border-slate-200',
        elevated: 'shadow-xl border border-slate-200',
        flat: 'border-0 shadow-none bg-white',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      hoverable: {
        true: 'hover:shadow-xl cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hoverable: false,
    },
  }
)

// ============================================
// Card Main Component
// ============================================
export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: ReactNode
  className?: string
}

export const Card = ({
  children,
  variant,
  padding,
  hoverable,
  className,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(cardVariants({ variant, padding, hoverable, className }))}
      {...props}
    >
      {children}
    </div>
  )
}

Card.displayName = 'Card'

// ============================================
// Card Header
// ============================================
export interface CardHeaderProps {
  title?: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

export const CardHeader = ({
  title,
  subtitle,
  action,
  icon,
  className,
}: CardHeaderProps) => {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-4', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

CardHeader.displayName = 'CardHeader'

// ============================================
// Card Body
// ============================================
export interface CardBodyProps {
  children: ReactNode
  className?: string
}

export const CardBody = ({ children, className }: CardBodyProps) => {
  return <div className={cn('', className)}>{children}</div>
}

CardBody.displayName = 'CardBody'

// ============================================
// Card Footer
// ============================================
export interface CardFooterProps {
  children: ReactNode
  className?: string
  divider?: boolean
}

export const CardFooter = ({
  children,
  className,
  divider = true,
}: CardFooterProps) => {
  return (
    <div
      className={cn(
        'mt-4 pt-4',
        divider && 'border-t border-slate-100',
        className
      )}
    >
      {children}
    </div>
  )
}

CardFooter.displayName = 'CardFooter'

// ============================================
// Stats Card (Preset for dashboard stats)
// ============================================
export interface StatsCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export const StatsCard = ({
  title,
  value,
  icon,
  trend,
  variant = 'default',
}: StatsCardProps) => {
  const variantColors = {
    default: { bg: 'bg-blue-50', text: 'text-blue-600' },
    success: { bg: 'bg-green-50', text: 'text-green-600' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-600' },
    danger: { bg: 'bg-red-50', text: 'text-red-600' },
  }

  const colors = variantColors[variant]

  return (
    <Card variant="default" padding="md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <p
              className={cn(
                'text-xs mt-1 flex items-center gap-1',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}
            >
              <svg
                className={cn('w-3 h-3', trend.isPositive ? '' : 'rotate-180')}
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
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              colors.bg
            )}
          >
            <div className={colors.text}>{icon}</div>
          </div>
        )}
      </div>
    </Card>
  )
}

StatsCard.displayName = 'StatsCard'
