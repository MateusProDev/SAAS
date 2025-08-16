import React from 'react';
import { usePlan } from '../contexts/PlanContext';

export const PlanBadge: React.FC = () => {
  const { plan, isTrialActive } = usePlan();
  let color = '#94a3b8';
  if (plan === 'basic') color = '#6366f1';
  if (plan === 'pro') color = isTrialActive ? '#f59e0b' : '#10b981';
  return (
    <span style={{padding:'4px 12px',borderRadius:999,background:color,color:'#fff',fontWeight:700,fontSize:'0.85rem',marginLeft:8}}>
      {plan === 'pro' && isTrialActive ? 'PRO (Teste)' : plan.toUpperCase()}
    </span>
  );
};
