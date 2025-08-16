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
    <div style={{margin:'2rem 0',padding:24,border:'1px solid #e5e7eb',borderRadius:12,background:'#fff'}}>
      <h3 style={{marginBottom:12}}>Pagamento Mercado Pago</h3>
      <p style={{marginBottom:16}}>Plano: <b>{plan.toUpperCase()}</b></p>
      <button onClick={handlePayment} disabled={loading || userPlan === plan} style={{padding:'12px 32px',background:'#6366f1',color:'#fff',border:'none',borderRadius:8,fontWeight:700,fontSize:'1rem',cursor:'pointer'}}>
        {loading ? 'Processando...' : 'Pagar e Ativar'}
      </button>
      {pixQr && (
        <div style={{marginTop:24,textAlign:'center'}}>
          <h4>Pague com PIX</h4>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixQr)}`} alt="QR Code PIX" style={{margin:'0 auto'}} />
          <p style={{marginTop:8,fontSize:'0.95rem'}}>Escaneie o QR Code no app do seu banco ou copie o código abaixo:</p>
          <textarea readOnly value={pixQr} style={{width:'100%',fontSize:'0.95rem',padding:8,borderRadius:8}} />
        </div>
      )}
      {error && <div style={{color:'#ef4444',marginTop:12}}>{error}</div>}
    </div>
  );
};
