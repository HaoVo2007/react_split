export interface User {
  id: string
  email: string
  role: string
  status: "active" | "inactive"
  profile?: {
    name?: string
    avatar?: string
  } | null
  created_at: string
  updated_at: string
}

export interface GroupMember {
  id: string
  email: string
  role: string
  name: null | string
  image: null | string
  image_public_id: null | string
  address: null | string
  phone: null | string
}

export interface Group {
  id: string
  name: string
  image: string
  image_public_id: string
  members: GroupMember[]
  total_members: number
  description: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface CreateGroupRequest {
  name: string
  description?: string
  image?: File
}

export interface UpdateGroupRequest {
  name: string
  description?: string
  image?: File
}

export interface GroupsResponse {
  total_groups: number
  total_paid: number
  total_owed: number
  groups: Group[]
}

export interface ParticipantSplit {
  user: GroupMember
  amount: number
}

export interface Expense {
  id: string
  name: string
  amount: number
  category: string
  image?: string
  image_public_id?: string
  paid_by: GroupMember[]
  participants: GroupMember[]
  participant_splits: ParticipantSplit[]
  created_at: string
  updated_at: string
}

export interface CreateExpenseRequest {
  name: string
  amount: number
  category: string
  group_id: string
  paid_by: string[]
  participants: string[]
  date: string
  image?: File
  participant_splits?: Array<{ user_id: string; amount: number }>
}

export interface Debt {
  from: User
  to: User
  amount: number
}

export interface Message {
  id: string
  groupId: string
  sender: User
  content: string
  createdAt: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface AuthResponse {
  id: string
  email: string
  role: string
  token: string
  refresh_token: string
  status: "active" | "inactive"
  profile: null | any
  is_deleted: boolean
  deleted_at: null | string
  created_at: string
  updated_at: string
}

export interface MemberBalance {
  user_id: string
  name: string
  image: string | null
  email: string
  total_paid: number
  total_owed: number
  balance: number
  status: "debtor" | "creditor"
}

export interface Settlement {
  from_user: GroupMember
  to_user: GroupMember
  amount: number
}

export interface GroupBalance {
  group_id: string
  total_expenses: number
  total_owed: number
  total_paid: number
  members: MemberBalance[]
  settlements: Settlement[]
}

export interface GroupBalanceResponse {
  success: boolean
  message: string
  data: GroupBalance
}
