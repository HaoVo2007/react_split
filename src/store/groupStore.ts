import { create } from "zustand"
import { Group, ApiResponse } from "@/types"
import api from "@/lib/api"

interface GroupStore {
  groups: Group[]
  activeGroup: Group | null
  isLoading: boolean
  error: string | null
  fetchGroups: () => Promise<void>
  setActiveGroup: (group: Group) => void
  createGroup: (name: string, description?: string) => Promise<void>
}

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  activeGroup: null,
  isLoading: false,
  error: null,

  fetchGroups: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<ApiResponse<Group[]>>("/groups")
      const groupsData = (response as any).data || response
      set({ groups: Array.isArray(groupsData) ? groupsData : groupsData.groups || [], isLoading: false })
    } catch (error) {
      set({ error: "Lấy danh sách nhóm thất bại", isLoading: false })
    }
  },

  setActiveGroup: (group: Group) => {
    set({ activeGroup: group })
  },

  createGroup: async (name: string, description?: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post<ApiResponse<Group>>("/groups", {
        name,
        description,
      })
      const groupData = (response as any).data || response
      set((state) => ({
        groups: [...state.groups, groupData],
        isLoading: false,
      }))
    } catch (error) {
      set({ error: "Tạo nhóm thất bại", isLoading: false })
    }
  },
}))
