import React from 'react';
import { usePlan } from '../contexts/PlanContext';

export const UpgradeModal: React.FC = () => {
  const { plan, upgrade, isTrialActive } = usePlan();

  return (
    <div style={{
      padding: '2.5rem 2rem',
      background: 'linear-gradient(135deg,#f8fafc 60%,#e0e7ff 100%)',
      borderRadius: 20,
      maxWidth: 480,
      margin: '2.5rem auto',
      boxShadow: '0 8px 32px rgba(99,102,241,0.10)',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h2 style={{fontWeight:900,fontSize:'2rem',marginBottom:18,color:'#6366f1',letterSpacing:1}}>Faça upgrade de plano</h2>
      <p style={{marginBottom:18,fontSize:'1.1rem',color:'#222'}}>Seu plano atual: <b style={{color:'#6366f1'}}>{plan.toUpperCase()}</b></p>
      {plan === 'pro' && isTrialActive && (
        <p style={{color:'#6366f1',background:'#eef2ff',padding:'8px 16px',borderRadius:8,marginBottom:12}}>Você está no período de teste grátis do Pro!</p>
      )}
      <div style={{display:'flex',gap:12,marginBottom:18}}>
        <button onClick={() => upgrade('basic')} style={{padding:'12px 32px',borderRadius:10,background:'#6366f1',color:'#fff',fontWeight:700,border:'none',cursor:'pointer',fontSize:'1rem',boxShadow:'0 2px 8px #6366f133'}}>Migrar para BASIC</button>
        <button onClick={() => upgrade('pro')} style={{padding:'12px 32px',borderRadius:10,background:'#10b981',color:'#fff',fontWeight:700,border:'none',cursor:'pointer',fontSize:'1rem',boxShadow:'0 2px 8px #10b98133'}}>Migrar para PRO (7 dias grátis)</button>
      </div>
      <p style={{marginTop:8,fontSize:'1rem',color:'#555',textAlign:'center'}}>O plano <b>PRO</b> libera domínios personalizados, sites ilimitados e recursos premium.</p>
    </div>
  );
};
