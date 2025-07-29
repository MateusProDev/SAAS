import React, { useState } from 'react'
import { useSitesFirestore } from '../hooks/useSitesFirestore'
import { templates } from '../templates'
// ...existing code...
// ...existing code...

interface CreateSiteModalProps {
  isOpen: boolean
  onClose: () => void
}

const CreateSiteModal: React.FC<CreateSiteModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [templateId, setTemplateId] = useState(templates[0].id)
  const [loading, setLoading] = useState(false)
  const { createSite } = useSitesFirestore()
  // ...existing code...
  // ...existing code...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      alert('Por favor, preencha todos os campos')
      return
    }
    setLoading(true)
    try {
      const template = templates.find(t => t.id === templateId)
      let html = template?.html || ''
      html = html.replace(/\{\{title\}\}/g, title.trim())
                 .replace(/\{\{description\}\}/g, description.trim())
                 .replace(/\{\{year\}\}/g, new Date().getFullYear().toString())
      await createSite(title.trim(), description.trim(), html)
      setTitle('')
      setDescription('')
      setTemplateId(templates[0].id)
      onClose()
    } catch (error) {
      console.error('Erro ao criar site no Firestore:', error)
      alert('Erro ao criar site. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Criar Novo Site</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <div className="flex gap-3">
              {templates.map(t => (
                <button
                  type="button"
                  key={t.id}
                  className={`border rounded p-2 flex flex-col items-center w-28 h-28 ${templateId === t.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}`}
                  onClick={() => setTemplateId(t.id)}
                >
                  <img src={t.thumbnail} alt={t.name} className="w-10 h-10 mb-2" />
                  <span className="text-xs text-center">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título do Site
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Minha Empresa"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva sobre o que é seu site"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar Site'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSiteModal
