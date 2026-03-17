import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function for merging Tailwind CSS classes
 * 
 * Combines clsx and tailwind-merge to handle:
 * - Conditional classes
 * - Array/object syntax
 * - Tailwind class conflicts (e.g., px-4 px-6 -> px-6)
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', className)
 * cn(['px-4', 'py-2'], { 'bg-blue-500': isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
