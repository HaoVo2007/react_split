import { COLORS } from "@/lib/design-tokens"

interface UserAvatarProps {
  src?: string
  name: string
  size?: "sm" | "md" | "lg"
}

export function UserAvatar({ src, name, size = "md" }: UserAvatarProps) {
  const sizeClass = {
    sm: "w-6 h-6 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  }[size]

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center font-semibold bg-[${COLORS.primaryLight}] text-[${COLORS.primary}]`}
      style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}
    >
      {initials}
    </div>
  )
}
