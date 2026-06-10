import { formatMoney } from "@/lib/utils"

interface AmountBadgeProps {
  amount: number
  type?: "income" | "expense"
}

export function AmountBadge({ amount, type = "expense" }: AmountBadgeProps) {
  const isIncome = type === "income"

  const colors = isIncome
    ? {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        sign: "+",
      }
    : {
        bg: "bg-red-50",
        text: "text-red-500",
        sign: "-",
      }

  return (
    <span className={`${colors.bg} ${colors.text} font-semibold text-sm px-2 py-0.5 rounded-full`}>
      {colors.sign}
      {formatMoney(Math.abs(amount))}
    </span>
  )
}
