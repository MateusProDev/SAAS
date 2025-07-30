
"use client";
import React from 'react';
import Link from 'next/link';
import { useSites } from '../../src/hooks/useSites';

export default function DashboardPage() {
  const { sites, loading, error } = useSites();

  return (
    <div style={{ padding: 32 }}>
      <h1>Dashboard SaaS</h1>
      <p>Bem-vindo ao seu painel SaaS! Escolha uma ação:</p>
      <ul style={{ marginTop: 24 }}>
        <li><Link href="/sites">Ver sites públicos</Link></li>
        <li><Link href="/sites/new">Criar novo site</Link></li>
      </ul>

      <h2 style={{ marginTop: 40 }}>Seus sites</h2>
      {loading && <p>Carregando sites...</p>}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      {!loading && !error && sites.length === 0 && <p>Nenhum site criado ainda.</p>}
      {!loading && !error && sites.length > 0 && (
        <ul style={{ marginTop: 16 }}>
          {sites.map(site => (
            <li key={site.id}>
              <Link href={`/sites/${site.id}`}>{site.name || site.id}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

