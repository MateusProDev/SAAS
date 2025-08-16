"use client";
import React from 'react';
import { UpgradeModal } from '../../src/components/UpgradeModal';
import { PlanUpgradeCheckout } from '../../src/components/PlanUpgradeCheckout';


export default function UpgradePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#f8fafc 60%,#e0e7ff 100%)',
        padding: '3rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <header style={{textAlign:'center',marginBottom:32}}>
        <h1 style={{fontSize:'2.3rem',fontWeight:900,color:'#6366f1',letterSpacing:1,marginBottom:10}}>Upgrade de Plano</h1>
        <p style={{fontSize:'1.15rem',color:'#555',maxWidth:480,margin:'0 auto'}}>Escolha o plano ideal para seu negócio e desbloqueie recursos premium, domínios personalizados e sites ilimitados.</p>
      </header>
      <UpgradeModal />
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2.5rem',
          marginTop: '2.5rem',
          maxWidth: 1000,
          width: '100%',
        }}
      >
        <PlanUpgradeCheckout plan="basic" />
        <PlanUpgradeCheckout plan="pro" />
      </section>
    </main>
  );
}
