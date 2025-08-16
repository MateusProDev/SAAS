import React, { useState } from 'react';
import { usePlan } from '../contexts/PlanContext';

export const PlanUpgradeCheckout: React.FC<{ plan: 'basic' | 'pro' }> = ({ plan }) => {
  const { plan: userPlan } = usePlan();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixQr, setPixQr] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    setPixQr(null);
    try {
      const userId = (window as any).user?.uid || '';
      const res = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId })
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Erro ao processar pagamento: ${res.status} - ${errText}`);
      }
      const data = await res.json();
      if (!data.id) throw new Error('Erro ao criar preferência Mercado Pago');
      if (data.pix_qr) {
        setPixQr(data.pix_qr);
      } else {
        // Mercado Pago JS SDK
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => {
          // @ts-ignore
          const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY, {
            locale: 'pt-BR'
          });
          // @ts-ignore
          mp.checkout({ preference: { id: data.id }, autoOpen: true });
        };
      }
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      margin: '2.5rem auto',
      padding: '2rem 1.5rem',
      border: '1px solid #e5e7eb',
      borderRadius: 18,
      background: 'linear-gradient(135deg,#fff 60%,#eef2ff 100%)',
      maxWidth: 480,
      boxShadow: '0 8px 32px rgba(99,102,241,0.10)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h3 style={{marginBottom:14,fontSize:'1.35rem',color:'#6366f1',fontWeight:800,letterSpacing:1}}>Pagamento Mercado Pago</h3>
      <p style={{marginBottom:18,fontSize:'1.1rem',color:'#222'}}>Plano: <b style={{color:'#6366f1'}}>{plan.toUpperCase()}</b></p>
      <button onClick={handlePayment} disabled={loading || userPlan === plan} style={{padding:'14px 40px',background:'#6366f1',color:'#fff',border:'none',borderRadius:10,fontWeight:700,fontSize:'1.1rem',cursor:'pointer',boxShadow:'0 2px 8px #6366f133',marginBottom:8}}>
        {loading ? 'Processando...' : 'Pagar e Ativar'}
      </button>
      {pixQr && (
        <div style={{marginTop:28,textAlign:'center',width:'100%'}}>
          <h4 style={{color:'#10b981',fontWeight:700}}>Pague com PIX</h4>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixQr)}`} alt="QR Code PIX" style={{margin:'0 auto',borderRadius:12,boxShadow:'0 2px 8px #10b98122'}} />
          <p style={{marginTop:10,fontSize:'1rem',color:'#222'}}>Escaneie o QR Code no app do seu banco ou copie o código abaixo:</p>
          <textarea readOnly value={pixQr} style={{width:'100%',fontSize:'1rem',padding:10,borderRadius:10,marginTop:8,background:'#f8fafc',border:'1px solid #e5e7eb'}} />
        </div>
      )}
      {error && <div style={{color:'#ef4444',marginTop:16,fontWeight:700,fontSize:'1rem'}}>{error}</div>}
    </div>
  );
};
