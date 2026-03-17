export type GroupMember = {
  id: string
  email: string
  role: string
  name: string | null
  image: string | null
  image_public_id: string | null
  address: string | null
  phone: string | null
}

export type Group = {
  id: string
  name: string
  image: string | null
  image_public_id: string | null
  members: GroupMember[]
  total_members: number
  description: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type GroupsResponse = {
  total_groups: number
  total_paid: number
  total_owed: number
  groups: Group[]
}

export type GroupMemberWithProfile = {
  id: string
  email: string
  role: string
  status: string
  profile: {
    name: string | null
    image: string | null
    address: string | null
    phone: string | null
    image_public_id: string | null
  }
}

export type GroupMembersResponse = GroupMemberWithProfile[]