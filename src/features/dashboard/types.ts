export type Balance = {
  you_owed: number
  you_paid: number
  balance: number
}

export type Overview = {
  total_groups: number
  total_transactions: number
  total_friends: number
}

export type Expenses = {
  total_paid: number
  total_shared: number
}

export type TopGroup = {
  id: string
  name: string
  total_spend: number
}

export type TopFriend = {
  id: string
  name: string
  total_transactions: number
}

export type TopStatistics = {
  top_group: TopGroup
  top_friend: TopFriend
}

export type DashboardData = {
  balance: Balance
  overview: Overview
  expenses: Expenses
  top_statistics: TopStatistics
}

export type DashboardSummaryResponse = {
  success: boolean
  message: string
  data: DashboardData
}
