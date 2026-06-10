// Design Tokens — Source of Truth

export const COLORS = {
  // Brand
  primary: "#4F7CFF",
  primaryHover: "#3D6AEE",
  primaryLight: "#EEF2FF",

  // Semantic
  success: "#22C55E",
  successLight: "#F0FDF4",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",

  // Neutral
  background: "#F8FAFF",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  borderHover: "#CBD5E1",

  // Text
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textInverse: "#FFFFFF",
} as const;

export const TYPOGRAPHY = {
  fontDisplay: "'Plus Jakarta Sans', sans-serif",
  fontBody: "'DM Sans', sans-serif",
} as const;

export const RADIUS = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
} as const;

export const SHADOW = {
  card: "shadow-sm",
  modal: "shadow-xl",
  hover: "shadow-md",
} as const;
