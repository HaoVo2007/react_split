import { create } from 'zustand'

export interface LoadingState {
  // Global loading states for different operations
  isLoadingLogout: boolean
  isLoadingProfile: boolean
  isLoadingGroups: boolean
  isLoadingExpenses: boolean
  isLoadingDashboard: boolean

  // Global loading blocker - true if any API is in progress
  isAnyLoading: boolean

  // Actions
  setLogoutLoading: (loading: boolean) => void
  setProfileLoading: (loading: boolean) => void
  setGroupsLoading: (loading: boolean) => void
  setExpensesLoading: (loading: boolean) => void
  setDashboardLoading: (loading: boolean) => void

  // Check if any loading is active
  updateGlobalLoading: () => void
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  isLoadingLogout: false,
  isLoadingProfile: false,
  isLoadingGroups: false,
  isLoadingExpenses: false,
  isLoadingDashboard: false,
  isAnyLoading: false,

  setLogoutLoading: (loading) => {
    set({ isLoadingLogout: loading })
    get().updateGlobalLoading()
  },

  setProfileLoading: (loading) => {
    set({ isLoadingProfile: loading })
    get().updateGlobalLoading()
  },

  setGroupsLoading: (loading) => {
    set({ isLoadingGroups: loading })
    get().updateGlobalLoading()
  },

  setExpensesLoading: (loading) => {
    set({ isLoadingExpenses: loading })
    get().updateGlobalLoading()
  },

  setDashboardLoading: (loading) => {
    set({ isLoadingDashboard: loading })
    get().updateGlobalLoading()
  },

  updateGlobalLoading: () => {
    const state = get()
    const isAnyLoading =
      state.isLoadingLogout ||
      state.isLoadingProfile ||
      state.isLoadingGroups ||
      state.isLoadingExpenses ||
      state.isLoadingDashboard
    set({ isAnyLoading })
  }
}))
