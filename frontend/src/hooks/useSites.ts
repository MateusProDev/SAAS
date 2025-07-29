import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { usePlan } from '../contexts/PlanContext'
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
  slug?: string
  isPublished?: boolean
}

export interface CreateSiteData {
  title: string
  description: string
  content?: string
  isPublished?: boolean
  slug?: string
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

export function useCreateSite() {
  const { user } = useAuth()
  const { canCreateSite, userProfile, refreshUserProfile } = usePlan()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateSiteData) => {
      if (!user) throw new Error('User not authenticated')
      
      // Verificar se pode criar site
      if (!canCreateSite) {
        throw new Error(`Limite de sites atingido. Seu plano ${userProfile?.plan} permite até ${userProfile?.maxSites} sites.`)
      }
      
      const response = await api.post('/sites', {
        title: data.title,
        description: data.description,
        content: data.content || `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bem-vindo ao ${data.title}</h1>
        <p>${data.description}</p>
        <p>Este é seu novo site! Você pode editá-lo no painel de controle.</p>
    </div>
</body>
</html>`,
        published: false
      })
      return response.data
    },
    onSuccess: () => {
      // Invalidar e refetch a lista de sites
      queryClient.invalidateQueries({ queryKey: ['sites', user?.uid] })
      // Atualizar perfil do usuário para refletir novo número de sites
      refreshUserProfile()
    },
  })
}

export function useUpdateSite() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ siteId, data }: { siteId: string; data: Partial<CreateSiteData> }) => {
      if (!user) throw new Error('User not authenticated')
      
      const response = await api.put(`/sites/${siteId}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      // Invalidar e refetch a lista de sites e o site específico
      queryClient.invalidateQueries({ queryKey: ['sites', user?.uid] })
      queryClient.invalidateQueries({ queryKey: ['site', variables.siteId] })
    },
  })
}

export function useDeleteSite() {
  const { user } = useAuth()
  const { refreshUserProfile } = usePlan()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (siteId: string) => {
      if (!user) throw new Error('User not authenticated')
      
      const response = await api.delete(`/sites/${siteId}`)
      return response.data
    },
    onSuccess: () => {
      // Invalidar e refetch a lista de sites
      queryClient.invalidateQueries({ queryKey: ['sites', user?.uid] })
      // Atualizar perfil do usuário para refletir novo número de sites
      refreshUserProfile()
    },
  })
}
