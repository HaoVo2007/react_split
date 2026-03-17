export type PaidByUser = {
  id: string
  email: string
  role: string
  name: string | null
  image: string | null
  image_public_id: string | null
  address: string | null
  phone: string | null
}

export type Expense = {
  id: string
  name: string
  amount: number
  category: string
  image: string
  image_public_id: string
  paid_by: PaidByUser[]
  participants: PaidByUser[]
  created_at: string
  updated_at: string
}

export type ExpensesResponse = {
  success: boolean
  message: string
  data: Expense[]
}

export type CreateExpenseResponse = {
  success: boolean
  message: string
  data?: Expense
}

// Balance API Types
export type BalanceMember = {
  user_id: string
  name: string
  image: string
  email: string
  total_paid: number
  total_owed: number
  balance: number
  status: 'creditor' | 'debtor' | 'settled'
}

export type SettlementUser = {
  id: string
  email: string
  role: string
  name: string
  image: string
  image_public_id: string
  address: string
  phone: string
}

export type Settlement = {
  from_user: SettlementUser
  to_user: SettlementUser
  amount: number
}

export type GroupBalance = {
  group_id: string
  total_expenses: number
  total_owed: number
  total_paid: number
  members: BalanceMember[]
  settlements: Settlement[]
}

export type GroupBalanceResponse = {
  success: boolean
  message: string
  data: GroupBalance
}
