import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usePlan } from '../contexts/PlanContext'
import { useSites, useDeleteSite, type Site } from '../hooks'
import Layout from '../components/Layout'
import CreateSiteModal from '../components/CreateSiteModal'
import UpgradeModal from '../components/UpgradeModal'
import PlanBadge from '../components/PlanBadge'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { user } = useAuth()
  const { sites, loading } = useSites()
  const { userProfile, canCreateSite } = usePlan()
  const deleteSiteMutation = useDeleteSite()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)

  const handleCreateSite = () => {
    if (!canCreateSite) {
      setIsUpgradeModalOpen(true)
      return
    }
    setIsCreateModalOpen(true)
  }

  const handleDeleteSite = async (siteId: string, siteTitle: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o site "${siteTitle}"? Esta ação não pode ser desfeita.`)) {
      try {
        await deleteSiteMutation.mutateAsync(siteId)
        alert('Site deletado com sucesso!')
      } catch (error) {
        console.error('Erro ao deletar site:', error)
        alert('Erro ao deletar o site')
      }
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bem-vindo, {user?.email}!
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie seus sites de forma fácil e rápida
              </p>
              <div className="mt-2">
                <PlanBadge showDetails={true} />
              </div>
            </div>
            <button
              onClick={handleCreateSite}
              className={`px-6 py-3 rounded-lg transition-colors ${
                canCreateSite 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {canCreateSite ? '+ Criar Site' : '⚡ Upgrade para criar mais sites'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site: Site) => (
            <div
              key={site.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{site.title}</h3>
              <p className="text-gray-600 mb-4">{site.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Criado em {new Date(site.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`/editor/${site.id}/new`, '_blank')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => window.open(`/preview/${site.id}`, '_blank')}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleDeleteSite(site.id, site.title)}
                    disabled={deleteSiteMutation.isPending}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sites.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum site encontrado
            </h3>
            <p className="text-gray-500 mb-6">
              {canCreateSite 
                ? 'Comece criando seu primeiro site' 
                : `Você atingiu o limite de ${userProfile?.maxSites} sites do plano ${userProfile?.plan?.toUpperCase()}`
              }
            </p>
            <button 
              onClick={handleCreateSite}
              className={`px-6 py-3 rounded-lg transition-colors ${
                canCreateSite 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {canCreateSite ? 'Criar Novo Site' : 'Fazer Upgrade para PRO'}
            </button>
          </div>
        )}
      </div>

      <CreateSiteModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <UpgradeModal 
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </Layout>
  )
}
