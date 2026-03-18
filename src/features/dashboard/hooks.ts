import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getDashboardSummary } from './api'
import type { DashboardData } from './types'

// Query keys for caching
export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
}

/**
 * Hook to fetch dashboard summary
 */
export const useDashboardSummary = () => {
  return useQuery<DashboardData, Error>({
    queryKey: dashboardKeys.summary(),
    queryFn: () => getDashboardSummary(),
  })
}

/**
 * Hook to manually refetch dashboard
 */
export const useRefetchDashboard = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: dashboardKeys.all })
  }
}
