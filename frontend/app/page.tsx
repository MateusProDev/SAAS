import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: 32 }}>
      <h1>Bem-vindo ao SaaS Website Builder</h1>
      <p>Monte seu site profissional em minutos!</p>
      <Link href="/dashboard" style={{ marginTop: 24, display: 'inline-block' }}>
        Ir para o Dashboard
      </Link>
    </div>
  ); 
}
// ...código limpo acima...
// Removeu todo o código residual e erros. Página inicial pronta para SaaS.
