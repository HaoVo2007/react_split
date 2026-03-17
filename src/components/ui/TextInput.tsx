import type { InputHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

/**
 * TextInput Component
 * 
 * A form input component with label, hint text, and error handling.
 * Supports various sizes and states.
 * 
 * @example
 * <TextInput label="Email" type="email" placeholder="Enter your email" />
 * <TextInput label="Password" type="password" hint="Must be at least 8 characters" />
 * <TextInput label="Name" error="Name is required" />
 */

const inputVariants = cva(
  // Base styles
  'w-full border bg-white text-slate-900 outline-none transition-all duration-200',
  {
    variants: {
      variant: {
        default: [
          'border-slate-200',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
          'placeholder:text-slate-400',
        ],
        error: [
          'border-red-300 bg-red-50/30',
          'focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
          'placeholder:text-red-300',
        ],
        success: [
          'border-green-300 bg-green-50/30',
          'focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
        ],
      },
      size: {
        sm: 'px-3 py-2 text-sm rounded-lg',
        md: 'px-4 py-3 text-sm rounded-xl',
        lg: 'px-4 py-3.5 text-base rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// Label variant
const labelVariants = cva('block font-medium', {
  variants: {
    size: {
      sm: 'text-xs mb-1',
      md: 'text-sm mb-1.5',
      lg: 'text-sm mb-2',
    },
    required: {
      true: 'after:content-["*"] after:ml-0.5 after:text-red-500',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    required: false,
  },
})

export interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Input label */
  label?: string
  /** Hint text displayed below the input */
  hint?: string
  /** Error message - shows error state when provided */
  error?: string
  /** Success message - shows success state when provided */
  success?: string
  /** Whether the field is required */
  required?: boolean
  /** Icon to display at the start of the input */
  leftIcon?: ReactNode
  /** Icon to display at the end of the input */
  rightIcon?: ReactNode
  /** Additional class names */
  className?: string
  /** Container class names */
  containerClassName?: string
}

// Utility to create a slug from text
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const TextInput = ({
  label,
  hint,
  error,
  success,
  required = false,
  leftIcon,
  rightIcon,
  className,
  containerClassName,
  id,
  size,
  variant,
  disabled,
  ...props
}: TextInputProps) => {
  // Generate ID from label, name, or provided id
  const finalId = id ?? props.name ?? (label ? slugify(label) : undefined)
  
  // Determine variant based on error/success state
  const inputVariant = error ? 'error' : success ? 'success' : variant

  return (
    <div className={cn('flex flex-col', containerClassName)}>
      {label && (
        <label
          htmlFor={finalId}
          className={cn(labelVariants({ size, required }))}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          id={finalId}
          disabled={disabled}
          className={cn(
            inputVariants({ variant: inputVariant, size }),
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            disabled && 'opacity-60 cursor-not-allowed bg-slate-100',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            hint ? `${finalId}-hint` : error ? `${finalId}-error` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {/* Hint text */}
      {hint && !error && (
        <span id={`${finalId}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </span>
      )}
      
      {/* Error message */}
      {error && (
        <span id={`${finalId}-error`} className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
      
      {/* Success message */}
      {success && !error && (
        <span className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </span>
      )}
    </div>
  )
}

TextInput.displayName = 'TextInput'

// Textarea variant
export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  rows?: number
  className?: string
}

export const TextArea = ({
  label,
  hint,
  error,
  required = false,
  rows = 4,
  className,
  id,
  ...props
}: TextAreaProps) => {
  const finalId = id ?? props.name ?? (label ? slugify(label) : undefined)
  
  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={finalId}
          className={cn(
            'text-sm font-medium text-slate-700 mb-1.5',
            required && 'after:content-["*"] after:ml-0.5 after:text-red-500'
          )}
        >
          {label}
        </label>
      )}
      
      <textarea
        id={finalId}
        rows={rows}
        className={cn(
          'w-full px-4 py-3 border rounded-xl bg-white text-slate-900 outline-none',
          'transition-all duration-200 resize-none',
          'placeholder:text-slate-400',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
          className
        )}
        {...props}
      />
      
      {(hint || error) && (
        <span className={cn('mt-1.5 text-xs', error ? 'text-red-500' : 'text-slate-500')}>
          {error || hint}
        </span>
      )}
    </div>
  )
}

TextArea.displayName = 'TextArea'
