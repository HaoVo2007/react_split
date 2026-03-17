/**
 * Design System Tokens for TravelSplit
 * 
 * This file contains all design tokens used throughout the application.
 * Import these instead of using hard-coded values.
 */

// ============================================
// COLORS
// ============================================
export const colors = {
  // Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb', // Main primary
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
  },
  
  // Neutral Colors (Slate)
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Background Colors
  background: {
    primary: '#f8fafc',    // slate-50
    secondary: '#f1f5f9',  // slate-100
    gradient: 'bg-gradient-to-br from-slate-50 to-blue-50',
  },
  
  // Text Colors
  text: {
    primary: '#0f172a',    // slate-900
    secondary: '#475569', // slate-600
    muted: '#64748b',     // slate-500
    placeholder: '#94a3b8', // slate-400
  },
}

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  // Font Family
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  },
  
  // Font Sizes (in rem)
  size: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',      // 18px
    xl: '1.25rem',       // 20px
    '2xl': '1.5rem',     // 24px
    '3xl': '1.875rem',   // 30px
    '4xl': '2.25rem',    // 36px
  },
  
  // Font Weights
  weight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line Heights
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
  },
}

// ============================================
// SPACING
// ============================================
export const spacing = {
  // Base scale (in rem, 1rem = 16px)
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
}

// ============================================
// BORDER RADIUS
// ============================================
export const borderRadius = {
  none: '0',
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
}

// ============================================
// SHADOWS
// ============================================
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  // Custom primary shadow for primary buttons
  primary: '0 12px 30px rgba(37, 99, 235, 0.35)',
}

// ============================================
// Z-INDEX SCALE
// ============================================
export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
}

// ============================================
// TRANSITIONS
// ============================================
export const transitions = {
  default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
}

// ============================================
// COMPONENT-SPECIFIC TOKENS
// ============================================

// Card Component
export const card = {
  padding: spacing[6],
  borderRadius: borderRadius['2xl'],
  shadow: shadows.lg,
  background: 'bg-white',
  border: 'border border-slate-200',
}

// Button Component
export const button = {
  borderRadius: borderRadius.xl,
  padding: {
    sm: `${spacing[2]} ${spacing[3]}`,
    md: `${spacing[3]} ${spacing[4]}`,
    lg: `${spacing[4]} ${spacing[6]}`,
  },
  fontSize: typography.size.sm,
  fontWeight: typography.weight.medium,
}

// Input Component
export const input = {
  borderRadius: borderRadius.xl,
  padding: `${spacing[3]} ${spacing[4]}`,
  border: 'border border-slate-200',
  focusRing: 'focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
}

// Modal Component
export const modal = {
  overlay: 'bg-black bg-opacity-50',
  background: 'bg-white',
  borderRadius: {
    mobile: 'rounded-t-2xl',
    desktop: 'rounded-2xl',
  },
  shadow: shadows.xl,
  maxWidth: 'max-w-lg',
  maxHeight: 'max-h-[90vh]',
}

// Container
export const container = {
  maxWidth: 'max-w-7xl',
  padding: `${spacing[4]} ${spacing[6]}`,
}

// ============================================
// UTILITY CLASSES (Pre-built Tailwind combinations)
// ============================================
export const utilities = {
  // Page Container
  pageContainer: 'max-w-7xl mx-auto px-4 sm:px-6 py-6',
  
  // Card Styles
  card: 'bg-white rounded-2xl shadow-lg border border-slate-200',
  cardHover: 'hover:shadow-xl transition-shadow duration-200',
  
  // Button Base
  btnBase: 'inline-flex items-center justify-center font-medium transition-colors duration-200',
  btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
  btnSecondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  btnGhost: 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700',
  btnDanger: 'bg-red-50 hover:bg-red-100 text-red-600',
  
  // Form Input
  input: 'w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors text-sm',
  
  // Section Header
  sectionHeader: 'flex items-center justify-between mb-6',
  sectionTitle: 'text-xl font-semibold text-slate-900',
  
  // Empty State
  emptyState: 'flex flex-col items-center justify-center py-12 text-center',
  emptyStateIcon: 'w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4',
  emptyStateTitle: 'text-lg font-semibold text-slate-900 mb-2',
  emptyStateText: 'text-slate-500',
}

// ============================================
// BREAKPOINTS
// ============================================
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
