import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

/**
 * Button Component
 * 
 * A versatile button component with multiple variants and sizes.
 * Uses class-variance-authority for type-safe variant handling.
 * 
 * @example
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="secondary" leftIcon={<PlusIcon />}>Add Item</Button>
 * <Button variant="danger" isLoading>Deleting...</Button>
 */

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: [
          'bg-blue-600 hover:bg-blue-700 text-white',
          'shadow-sm hover:shadow-md',
          'focus-visible:ring-blue-500',
        ],
        secondary: [
          'bg-slate-100 hover:bg-slate-200 text-slate-700',
          'focus-visible:ring-slate-500',
        ],
        ghost: [
          'bg-transparent hover:bg-slate-100 text-slate-700',
          'focus-visible:ring-slate-500',
        ],
        outline: [
          'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700',
          'focus-visible:ring-slate-500',
        ],
        danger: [
          'bg-red-50 hover:bg-red-100 text-red-600',
          'focus-visible:ring-red-500',
        ],
        success: [
          'bg-green-50 hover:bg-green-100 text-green-600',
          'focus-visible:ring-green-500',
        ],
        // Gradient variant for special CTAs
        gradient: [
          'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600',
          'text-white shadow-md hover:shadow-lg',
          'focus-visible:ring-blue-500',
        ],
      },
      size: {
        xs: 'px-2.5 py-1.5 text-xs rounded-lg',
        sm: 'px-3 py-2 text-sm rounded-xl',
        md: 'px-4 py-2.5 text-sm rounded-xl',
        lg: 'px-6 py-3 text-base rounded-xl',
        xl: 'px-8 py-4 text-lg rounded-2xl',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

// Loading spinner component
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin h-4 w-4', className)}
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

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Content inside the button */
  children: ReactNode
  /** Icon to display before the text */
  leftIcon?: ReactNode
  /** Icon to display after the text */
  rightIcon?: ReactNode
  /** Show loading state */
  isLoading?: boolean
  /** Loading text to display instead of children */
  loadingText?: string
  /** Additional class names */
  className?: string
}

export const Button = ({
  children,
  variant,
  size,
  fullWidth,
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingText,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || isLoading

  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <LoadingSpinner className={cn(children && 'mr-2')} />}
      {!isLoading && leftIcon}
      {isLoading && loadingText ? loadingText : children}
      {!isLoading && rightIcon}
    </button>
  )
}

// Export for compound component pattern if needed
Button.displayName = 'Button'

// Preset buttons for common use cases
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="primary" {...props} />
)

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="secondary" {...props} />
)

export const GhostButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="ghost" {...props} />
)

export const DangerButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button variant="danger" {...props} />
)

export const IconButton = ({
  children,
  className,
  ...props
}: Omit<ButtonProps, 'variant' | 'size' | 'fullWidth'>) => (
  <Button
    variant="ghost"
    size="sm"
    className={cn('p-2', className)}
    {...props}
  >
    {children}
  </Button>
)
