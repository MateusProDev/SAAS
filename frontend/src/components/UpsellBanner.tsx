import React from 'react';
import { usePlan } from '../contexts/PlanContext';
import Link from 'next/link';

export const UpsellBanner: React.FC = () => {
  const { plan } = usePlan();
  if (plan === 'pro') return null;
  return (
    <div style={{background:'#f59e0b',color:'#fff',padding:'1rem',borderRadius:12,margin:'1rem 0',textAlign:'center',fontWeight:600}}>
      <span>Desbloqueie recursos premium e domínios personalizados com o plano PRO!</span>
      <Link href="/upgrade" style={{marginLeft:16,padding:'8px 18px',background:'#fff',color:'#f59e0b',borderRadius:8,fontWeight:700,textDecoration:'none'}}>Fazer upgrade</Link>
    </div>
  );
};
