import React from 'react'
import { usePlan, PLANS } from '../contexts/PlanContext'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, upgradeToProPlan, loading } = usePlan()

  const handleUpgrade = async () => {
    try {
      await upgradeToProPlan()
      onClose()
    } catch (error) {
      console.error('Erro ao fazer upgrade:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Escolha seu Plano</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Plano FREE */}
          <div className={`border-2 rounded-lg p-6 ${userProfile?.plan === 'free' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">FREE</h3>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                R$ 0<span className="text-sm font-normal">/mês</span>
              </div>
              {userProfile?.plan === 'free' && (
                <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm mt-2">
                  Plano Atual
                </span>
              )}
            </div>
            
            <ul className="space-y-3 mb-6">
              {PLANS.free.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="text-center">
              {userProfile?.plan === 'free' ? (
                <button disabled className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded cursor-not-allowed">
                  Plano Atual
                </button>
              ) : (
                <button disabled className="w-full bg-gray-200 text-gray-500 py-2 px-4 rounded cursor-not-allowed">
                  Downgrade não disponível
                </button>
              )}
            </div>
          </div>

          {/* Plano PRO */}
          <div className={`border-2 rounded-lg p-6 relative ${userProfile?.plan === 'pro' ? 'border-green-500 bg-green-50' : 'border-blue-500'}`}>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                Mais Popular
              </span>
            </div>
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">PRO</h3>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                R$ 49,99<span className="text-sm font-normal">/mês</span>
              </div>
              {userProfile?.plan === 'pro' && (
                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm mt-2">
                  Plano Atual
                </span>
              )}
            </div>
            
            <ul className="space-y-3 mb-6">
              {PLANS.pro.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="text-center">
              {userProfile?.plan === 'pro' ? (
                <button disabled className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded cursor-not-allowed">
                  Plano Atual
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processando...' : 'Fazer Upgrade'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>💳 Todos os planos incluem 7 dias de teste grátis</p>
          <p>🔒 Pagamento seguro via Stripe</p>
          <p>🚫 Cancele a qualquer momento</p>
        </div>
      </div>
    </div>
  )
}

export default UpgradeModal
