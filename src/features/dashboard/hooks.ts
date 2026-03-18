import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from './api'
import type { DashboardData } from './types'

const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
}

/**
 * Hook to fetch dashboard summary data
 */
export const useDashboardSummary = () => {
  return useQuery<DashboardData, Error>({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
