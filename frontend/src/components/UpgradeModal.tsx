import React from 'react';
import { usePlan } from '../contexts/PlanContext';

export const UpgradeModal: React.FC = () => {
  const { plan, upgrade, isTrialActive } = usePlan();

  return (
    <div style={{padding:32,background:'#fff',borderRadius:16,maxWidth:400,margin:'2rem auto',boxShadow:'0 4px 24px rgba(0,0,0,0.12)'}}>
      <h2 style={{fontWeight:900,fontSize:'1.5rem',marginBottom:16}}>Faça upgrade de plano</h2>
      <p style={{marginBottom:16}}>Seu plano atual: <b>{plan.toUpperCase()}</b></p>
      {plan === 'pro' && isTrialActive && (
        <p style={{color:'#6366f1'}}>Você está no período de teste grátis do Pro!</p>
      )}
      <button onClick={() => upgrade('basic')} style={{margin:'8px 0',padding:'12px 24px',borderRadius:8,background:'#6366f1',color:'#fff',fontWeight:700,border:'none',cursor:'pointer'}}>Migrar para BASIC</button>
      <button onClick={() => upgrade('pro')} style={{margin:'8px 0',padding:'12px 24px',borderRadius:8,background:'#10b981',color:'#fff',fontWeight:700,border:'none',cursor:'pointer'}}>Migrar para PRO (7 dias grátis)</button>
      <p style={{marginTop:16,fontSize:'0.95rem',color:'#555'}}>O plano PRO libera domínios personalizados, sites ilimitados e recursos premium.</p>
    </div>
  );
};
