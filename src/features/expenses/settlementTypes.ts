export interface SettlementUser {
  id: string
  name: string
  image: string
  email: string
}

export interface SettlementMember {
  user_id: string
  name: string
  image: string
  email: string
  total_paid: number
  total_owed: number
  balance: number
  status: 'creditor' | 'debtor' | 'settled'
}

export interface Settlement {
  from_user: SettlementUser
  to_user: SettlementUser
  amount: number
}

export interface ExpenseSettlementResponse {
  expense_id: string
  amount: number
  members: SettlementMember[]
  settlements: Settlement[]
}
