import React from 'react'
import { usePlan } from '../contexts/PlanContext'

interface PlanBadgeProps {
  showDetails?: boolean
}

const PlanBadge: React.FC<PlanBadgeProps> = ({ showDetails = false }) => {
  const { userProfile, loading } = usePlan()

  if (loading || !userProfile) {
    return (
      <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
    )
  }

  const isProPlan = userProfile.plan === 'pro'
  const sitesUsed = userProfile.currentSites
  const sitesLimit = userProfile.maxSites

  return (
    <div className="flex items-center space-x-2">
      <span 
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isProPlan 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {isProPlan ? 'PRO' : 'FREE'}
      </span>
      
      {showDetails && (
        <div className="text-sm text-gray-600">
          <span>
            {sitesUsed}/{sitesLimit === -1 ? '∞' : sitesLimit} sites
          </span>
          {!isProPlan && sitesUsed >= sitesLimit && (
            <span className="text-red-500 ml-1">• Limite atingido</span>
          )}
        </div>
      )}
    </div>
  )
}

export default PlanBadge
