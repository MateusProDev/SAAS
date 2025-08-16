
import React, { useState } from 'react';
import { usePlan } from '../contexts/PlanContext';

const checkoutSteps = [
  'Escolha o método de pagamento',
  'Preencha seus dados',
  'Confirme e pague',
];

export const PlanUpgradeCheckout: React.FC<{ plan: 'basic' | 'pro' }> = ({ plan }) => {
  const { plan: userPlan } = usePlan();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixQr, setPixQr] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<'pix' | 'card' | null>(null);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleMethodSelect = (m: 'pix' | 'card') => {
      setMethod(m);
      handleNext();
    };

    const handlePayment = async () => {
      setLoading(true);
      setError(null);
      setPixQr(null);
      try {
        const userId = (window as any).user?.uid || '';
        const res = await fetch('/api/mercadopago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, userId, name, email, cpf, method })
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Erro ao processar pagamento: ${res.status} - ${errText}`);
        }
        const data = await res.json();
        if (!data.id) throw new Error('Erro ao criar preferência Mercado Pago');
        if (method === 'pix' && data.pix_qr) {
          setPixQr(data.pix_qr);
          handleNext();
        } else if (method === 'card') {
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
        padding: '2.5rem 2rem',
        border: 'none',
        borderRadius: 24,
        background: 'linear-gradient(135deg,#fff 60%,#eef2ff 100%)',
        maxWidth: 520,
        boxShadow: '0 12px 40px rgba(99,102,241,0.14)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.2s',
      }}>
        <div style={{width:'100%',marginBottom:24}}>
          <div style={{display:'flex',justifyContent:'center',gap:8,marginBottom:18}}>
            {checkoutSteps.map((label,i)=>(
              <div key={label} style={{
                flex:1,
                textAlign:'center',
                fontWeight:700,
                fontSize:'1rem',
                color: step===i?'#6366f1':'#bbb',
                borderBottom:step===i?'3px solid #6366f1':'2px solid #e5e7eb',
                paddingBottom:6,
                transition:'all 0.2s'
              }}>{label}</div>
            ))}
          </div>
        </div>
        {step===0 && (
          <>
            <h3 style={{marginBottom:18,fontSize:'1.35rem',color:'#6366f1',fontWeight:800,letterSpacing:1}}>Como deseja pagar?</h3>
            <div style={{display:'flex',gap:18,marginBottom:24}}>
              <button onClick={()=>handleMethodSelect('pix')} style={{padding:'16px 38px',background:'#10b981',color:'#fff',border:'none',borderRadius:12,fontWeight:700,fontSize:'1.1rem',cursor:'pointer',boxShadow:'0 2px 8px #10b98133'}}>PIX</button>
              <button onClick={()=>handleMethodSelect('card')} style={{padding:'16px 38px',background:'#6366f1',color:'#fff',border:'none',borderRadius:12,fontWeight:700,fontSize:'1.1rem',cursor:'pointer',boxShadow:'0 2px 8px #6366f133'}}>Cartão</button>
            </div>
          </>
        )}
        {step===1 && (
          <>
            <h3 style={{marginBottom:14,fontSize:'1.25rem',color:'#6366f1',fontWeight:800}}>Preencha seus dados</h3>
            <input type="text" placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} style={{marginBottom:10,padding:12,borderRadius:10,border:'1px solid #e5e7eb',width:'100%',fontSize:'1.05rem'}} />
            <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} style={{marginBottom:10,padding:12,borderRadius:10,border:'1px solid #e5e7eb',width:'100%',fontSize:'1.05rem'}} />
            <input type="text" placeholder="CPF" value={cpf} onChange={e => setCpf(e.target.value)} style={{marginBottom:18,padding:12,borderRadius:10,border:'1px solid #e5e7eb',width:'100%',fontSize:'1.05rem'}} />
            <div style={{display:'flex',gap:12,marginBottom:8}}>
              <button onClick={handleBack} style={{padding:'12px 32px',background:'#e5e7eb',color:'#6366f1',border:'none',borderRadius:10,fontWeight:700,fontSize:'1rem',cursor:'pointer'}}>Voltar</button>
              <button onClick={handleNext} disabled={!name||!email||!cpf} style={{padding:'12px 32px',background:'#6366f1',color:'#fff',border:'none',borderRadius:10,fontWeight:700,fontSize:'1rem',cursor:'pointer'}}>Avançar</button>
            </div>
          </>
        )}
        {step===2 && (
          <>
            <h3 style={{marginBottom:14,fontSize:'1.25rem',color:'#6366f1',fontWeight:800}}>Confirme e pague</h3>
            <div style={{width:'100%',marginBottom:18,padding:'12px',background:'#eef2ff',borderRadius:10,color:'#222',fontWeight:500}}>
              <div>Plano: <b style={{color:'#6366f1'}}>{plan.toUpperCase()}</b></div>
              <div>Nome: <b>{name}</b></div>
              <div>Email: <b>{email}</b></div>
              <div>CPF: <b>{cpf}</b></div>
              <div>Método: <b style={{color:method==='pix'?'#10b981':'#6366f1'}}>{method==='pix'?'PIX':'Cartão'}</b></div>
            </div>
            <button onClick={handlePayment} disabled={loading || userPlan === plan} style={{padding:'16px 48px',background:method==='pix'?'#10b981':'#6366f1',color:'#fff',border:'none',borderRadius:12,fontWeight:800,fontSize:'1.15rem',cursor:'pointer',boxShadow:'0 2px 8px #6366f133',marginBottom:8}}>
              {loading ? 'Processando...' : 'Pagar e Ativar'}
            </button>
            <button onClick={handleBack} style={{padding:'12px 32px',background:'#e5e7eb',color:'#6366f1',border:'none',borderRadius:10,fontWeight:700,fontSize:'1rem',cursor:'pointer',marginTop:8}}>Voltar</button>
          </>
        )}
        {step===3 && pixQr && (
          <div style={{marginTop:18,textAlign:'center',width:'100%'}}>
            <h4 style={{color:'#10b981',fontWeight:700,fontSize:'1.2rem'}}>Pague com PIX</h4>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pixQr)}`} alt="QR Code PIX" style={{margin:'0 auto',borderRadius:12,boxShadow:'0 2px 8px #10b98122'}} />
            <p style={{marginTop:10,fontSize:'1.05rem',color:'#222'}}>Escaneie o QR Code no app do seu banco ou copie o código abaixo:</p>
            <textarea readOnly value={pixQr} style={{width:'100%',fontSize:'1.05rem',padding:10,borderRadius:10,marginTop:8,background:'#f8fafc',border:'1px solid #e5e7eb'}} />
          </div>
        )}
        {error && <div style={{color:'#ef4444',marginTop:16,fontWeight:700,fontSize:'1rem'}}>{error}</div>}
      </div>
    );
};
