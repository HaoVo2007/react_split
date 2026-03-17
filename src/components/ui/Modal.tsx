import { useEffect, useCallback } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

/**
 * Modal Component
 * 
 * A flexible modal component with responsive mobile-first design.
 * Slides up from bottom on mobile, centers on desktop.
 * 
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose} title="Modal Title">
 *   <ModalBody>Content here</ModalBody>
 *   <ModalFooter>
 *     <Button variant="ghost" onClick={handleClose}>Cancel</Button>
 *     <Button onClick={handleConfirm}>Confirm</Button>
 *   </ModalFooter>
 * </Modal>
 */

const overlayVariants = cva(
  'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
  {
    variants: {
      isOpen: {
        true: 'opacity-100',
        false: 'opacity-0 pointer-events-none',
      },
    },
  }
)

const modalContainerVariants = cva(
  'fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4',
  {
    variants: {
      isOpen: {
        true: 'pointer-events-auto',
        false: 'pointer-events-none',
      },
    },
  }
)

const modalContentVariants = cva(
  'bg-white shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4',
      },
      isOpen: {
        true: 'translate-y-0 sm:scale-100 opacity-100',
        false: 'translate-y-full sm:scale-95 sm:translate-y-0 opacity-0',
      },
    },
    defaultVariants: {
      size: 'md',
      isOpen: true,
    },
  }
)

// ============================================
// Modal Main Component
// ============================================
export interface ModalProps extends VariantProps<typeof modalContentVariants> {
  /** Whether the modal is visible */
  isOpen: boolean
  /** Callback when modal should close */
  onClose: () => void
  /** Modal content */
  children: ReactNode
  /** Modal title (optional) */
  title?: string
  /** Modal subtitle/description */
  description?: string
  /** Additional class names for content */
  className?: string
  /** Whether to close on backdrop click */
  closeOnBackdropClick?: boolean
  /** Whether to close on Escape key */
  closeOnEscape?: boolean
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  size,
  className,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) => {
  // Handle escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    },
    [closeOnEscape, onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose()
    }
  }

  return (
    <div
      className={cn(modalContainerVariants({ isOpen }))}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div className={cn(overlayVariants({ isOpen }))} aria-hidden="true" />

      {/* Modal Content */}
      <div
        className={cn(
          modalContentVariants({ size, isOpen }),
          // Mobile: rounded top only, Desktop: fully rounded
          'rounded-t-2xl sm:rounded-2xl',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {children}
      </div>
    </div>
  )
}

Modal.displayName = 'Modal'

// ============================================
// Modal Header
// ============================================
export interface ModalHeaderProps {
  title?: string
  description?: string
  onClose?: () => void
  showCloseButton?: boolean
  className?: string
}

export const ModalHeader = ({
  title,
  description,
  onClose,
  showCloseButton = true,
  className,
}: ModalHeaderProps) => {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-slate-100',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        {title && (
          <h2
            id="modal-title"
            className="text-lg sm:text-xl font-semibold text-slate-900"
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            id="modal-description"
            className="text-sm text-slate-500 mt-1"
          >
            {description}
          </p>
        )}
      </div>
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

ModalHeader.displayName = 'ModalHeader'

// ============================================
// Modal Body
// ============================================
export interface ModalBodyProps {
  children: ReactNode
  className?: string
  scrollable?: boolean
}

export const ModalBody = ({
  children,
  className,
  scrollable = true,
}: ModalBodyProps) => {
  return (
    <div
      className={cn(
        'p-4 sm:p-6',
        scrollable && 'overflow-y-auto',
        className
      )}
    >
      {children}
    </div>
  )
}

ModalBody.displayName = 'ModalBody'

// ============================================
// Modal Footer
// ============================================
export interface ModalFooterProps {
  children: ReactNode
  className?: string
  divider?: boolean
}

export const ModalFooter = ({
  children,
  className,
  divider = true,
}: ModalFooterProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 p-4 sm:p-6',
        divider && 'border-t border-slate-100',
        className
      )}
    >
      {children}
    </div>
  )
}

ModalFooter.displayName = 'ModalFooter'

// ============================================
// Simple Modal Preset (All-in-one)
// ============================================
export interface SimpleModalProps extends Omit<ModalProps, 'children'> {
  /** Content body */
  children: ReactNode
  /** Footer actions (buttons) */
  footer?: ReactNode
  /** Whether to show the close button */
  showCloseButton?: boolean
}

export const SimpleModal = ({
  children,
  footer,
  title,
  description,
  showCloseButton = true,
  ...props
}: SimpleModalProps) => {
  return (
    <Modal {...props} title={title} description={description}>
      <ModalHeader
        title={title}
        description={description}
        onClose={props.onClose}
        showCloseButton={showCloseButton}
      />
      <ModalBody>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </Modal>
  )
}

SimpleModal.displayName = 'SimpleModal'
