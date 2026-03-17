export type LoginFormValues = {
  email: string
  password: string
}

export type RegisterFormValues = LoginFormValues & {
  confirm_password: string
}

export type Profile = {
  name?: string
  image?: string
  phone?: string
  address?: string
}

export type CurrentUser = {
  id: string
  email: string
  profile?: Profile | null
}

export type User = {
  id: string
  email: string
  password: string
  role: string
  token: string
  refresh_token: string
  status: string
  profile?: Profile
  is_deleted: boolean
  deleted_at?: string
  created_at: string
  updated_at: string
}

export type SuccessResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
}

export type AuthResponse = User
