import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGroups, createGroup } from './api'
import type { GroupsResponse } from './types'
import toast from 'react-hot-toast'

// Query keys for caching
const groupsKeys = {
  all: ['groups'] as const,
}

/**
 * Hook to manage groups (fetch and create)
 */
export const useGroups = () => {
  const queryClient = useQueryClient()

  // Query for fetching groups
  const { data, isLoading, error, refetch } = useQuery<GroupsResponse, Error>({
    queryKey: groupsKeys.all,
    queryFn: () => getGroups(),
  })

  // Mutation for creating a group
  const createGroupMutation = useMutation({
    mutationFn: (formData: FormData) => createGroup(formData),
    onSuccess: () => {
      toast.success('Group created successfully!')
      // Invalidate groups query to refetch the list
      queryClient.invalidateQueries({ queryKey: groupsKeys.all })
    },
    // Error toast is already shown by API interceptor
  })

  return {
    groupsData: data,
    isLoading,
    error,
    fetchGroups: refetch,
    createGroup: createGroupMutation.mutateAsync,
  }
}

/**
 * Hook to fetch all groups (simple version)
 */
export const useGroupsQuery = () => {
  return useQuery<GroupsResponse, Error>({
    queryKey: groupsKeys.all,
    queryFn: () => getGroups(),
  })
}

/**
 * Hook to create a new group
 */
export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => createGroup(formData),
    onSuccess: () => {
      toast.success('Group created successfully!')
      // Invalidate groups query to refetch the list
      queryClient.invalidateQueries({ queryKey: groupsKeys.all })
    },
    // Error toast is already shown by API interceptor
  })
}
