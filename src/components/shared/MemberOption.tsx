import type { GroupMember } from "@/types"

interface MemberOptionProps {
  member: GroupMember
  showInitials?: boolean
}

function getInitials(name: string): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function MemberOption({ member, showInitials = true }: MemberOptionProps) {
  const displayName = member.name || member.email
  const initials = getInitials(member.name || member.email)

  return (
    <div className="flex items-center gap-2.5">
      {member.image ? (
        <img
          src={member.image}
          alt={displayName}
          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        showInitials && (
          <div className="w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-[#4F7CFF]">{initials}</span>
          </div>
        )
      )}
      <span className="text-sm truncate">{displayName}</span>
    </div>
  )
}
