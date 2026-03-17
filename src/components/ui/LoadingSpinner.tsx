import { cn } from '../../utils/cn'

/**
 * LoadingSpinner Component
 * 
 * A spinning loading indicator with various sizes and colors.
 * 
 * @example
 * <LoadingSpinner size="md" color="blue" />
 * <LoadingSpinner size="lg" fullScreen label="Đang tải dữ liệu..." />
 */

export interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Color variant */
  color?: 'blue' | 'white' | 'slate' | 'green' | 'red'
  /** Full screen centered overlay */
  fullScreen?: boolean
  /** Label text below spinner */
  label?: string
  /** Additional class names */
  className?: string
}

const sizeClasses = {
  xs: 'w-4 h-4 border-2',
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
  xl: 'w-16 h-16 border-4',
}

const colorClasses = {
  blue: 'border-blue-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  slate: 'border-slate-600 border-t-transparent',
  green: 'border-green-600 border-t-transparent',
  red: 'border-red-600 border-t-transparent',
}

export const LoadingSpinner = ({
  size = 'md',
  color = 'blue',
  fullScreen = false,
  label,
  className,
}: LoadingSpinnerProps) => {
  const spinner = (
    <div
      className={cn(
        'inline-block rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
        {label && (
          <p className="mt-4 text-sm text-slate-600 font-medium">{label}</p>
        )}
      </div>
    )
  }

  if (label) {
    return (
      <div className="flex flex-col items-center gap-3">
        {spinner}
        <span className="text-sm text-slate-500">{label}</span>
      </div>
    )
  }

  return spinner
}

LoadingSpinner.displayName = 'LoadingSpinner'

// Inline loading for buttons/forms
export const InlineLoading = ({
  size = 'sm',
  color = 'currentColor',
}: {
  size?: 'xs' | 'sm' | 'md'
  color?: string
}) => (
  <svg
    className={cn('animate-spin', sizeClasses[size].split(' ')[0])}
    style={{ color }}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

InlineLoading.displayName = 'InlineLoading'

// Page loading state
export const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <LoadingSpinner size="lg" />
  </div>
)

PageLoader.displayName = 'PageLoader'

// Skeleton loader for cards/content
export interface SkeletonProps {
  /** Height of the skeleton */
  height?: string | number
  /** Width of the skeleton */
  width?: string | number
  /** Show as circle */
  circle?: boolean
  /** Number of lines for text skeleton */
  lines?: number
  /** Additional class names */
  className?: string
}

export const Skeleton = ({
  height = '1rem',
  width,
  circle = false,
  lines = 1,
  className,
}: SkeletonProps) => {
  const renderSkeleton = (key?: number) => (
    <div
      key={key}
      className={cn(
        'animate-pulse bg-slate-200',
        circle ? 'rounded-full' : 'rounded-lg',
        className
      )}
      style={{
        height: typeof height === 'number' ? `${height}px` : height,
        width: width
          ? typeof width === 'number'
            ? `${width}px`
            : width
          : circle
            ? height
            : '100%',
      }}
    />
  )

  if (lines > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => renderSkeleton(i))}
      </div>
    )
  }

  return renderSkeleton()
}

Skeleton.displayName = 'Skeleton'

// Card skeleton preset
export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton height={48} width={48} circle />
      <div className="flex-1 space-y-2">
        <Skeleton height={16} width="60%" />
        <Skeleton height={12} width="40%" />
      </div>
    </div>
    <Skeleton height={12} />
    <Skeleton height={12} width="80%" />
  </div>
)

CardSkeleton.displayName = 'CardSkeleton'
