import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import api from '../lib/api'

export interface Site {
  id: string
  title: string
  description: string
  content: string
  published: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export function useSites() {
  const { user } = useAuth()

  const {
    data: sites = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sites', user?.uid],
    queryFn: async () => {
      if (!user) return []
      
      const response = await api.get('/sites')
      return response.data
    },
    enabled: !!user,
  })

  return {
    sites: sites as Site[],
    loading,
    error,
    refetch,
  }
}

export function useSite(siteId: string) {
  const { user } = useAuth()

  const {
    data: site,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['site', siteId],
    queryFn: async () => {
      const response = await api.get(`/sites/${siteId}`)
      return response.data
    },
    enabled: !!user && !!siteId,
  })

  return {
    site: site as Site | undefined,
    loading,
    error,
    refetch,
  }
}
