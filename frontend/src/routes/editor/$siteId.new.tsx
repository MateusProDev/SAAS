import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useSite } from '../../hooks'
import Layout from '../../components/Layout'

export const Route = createFileRoute('/editor/$siteId/new')({
  component: EditorComponent,
})

function EditorComponent() {
  const { siteId } = Route.useParams()
  const { site, loading } = useSite(siteId as string)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Atualizar estado quando o site carregar
  useEffect(() => {
    if (site) {
      setContent(site.content || '')
      setTitle(site.title || '')
      setDescription(site.description || '')
    }
  }, [site])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  if (!site) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Site não encontrado</h1>
            <p className="text-gray-600 mb-6">
              O site que você está tentando editar não existe ou você não tem permissão para acessá-lo.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const handleSave = async () => {
    try {
      // TODO: Implementar lógica de salvamento
      console.log('Salvando site:', { title, description, content })
      alert('Site salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar o site')
    }
  }

  const handlePreview = () => {
    // TODO: Implementar preview em nova aba
    console.log('Preview do site:', site)
    alert('Preview em desenvolvimento')
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editor de Site</h1>
              <p className="text-gray-600">Editando: {site.title}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePreview}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                Preview
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de Propriedades */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Propriedades do Site</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Editor de Conteúdo */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Conteúdo HTML</h3>
              
              <textarea
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Digite o HTML do seu site aqui..."
              />
              
              <div className="mt-4 text-sm text-gray-500">
                <p>💡 Dica: Use HTML padrão para criar seu site. CSS inline é suportado.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Área de Preview */}
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50 min-h-64">
              <div 
                dangerouslySetInnerHTML={{ __html: content || '<p>Seu conteúdo aparecerá aqui...</p>' }}
                className="prose max-w-none"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
