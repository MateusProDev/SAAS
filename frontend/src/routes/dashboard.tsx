import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSites, type Site } from '../hooks'
import Layout from '../components/Layout'
import CreateSiteModal from '../components/CreateSiteModal'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

function DashboardComponent() {
  const { user } = useAuth()
  const { sites, loading } = useSites()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              + Criar Site
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
                <button
                  onClick={() => window.open(`/editor/${site.id}`, '_blank')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Editar
                </button>
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
              Comece criando seu primeiro site
            </p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Criar Novo Site
            </button>
          </div>
        )}
      </div>

      <CreateSiteModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Layout>
  )
}
