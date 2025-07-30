
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useUserSitesFirestore } from '../../src/hooks/useUserSitesFirestore';
import { useFirebaseAuthUser } from '../../src/hooks/useFirebaseAuthUser';
import { deleteSite } from '../../src/hooks/deleteSite';

export default function DashboardPage() {
  const { user, loading: loadingUser } = useFirebaseAuthUser();
  const { sites, loading: loadingSites } = useUserSitesFirestore(user?.uid || "");

  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(siteId: string) {
    if (!user?.uid) return;
    if (!window.confirm('Tem certeza que deseja excluir este site? Essa ação não pode ser desfeita.')) return;
    setDeleting(siteId);
    await deleteSite(user.uid, siteId);
    setDeleting(null);
    window.location.reload();
  }

  return (
    <div style={{
      padding: 0,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f6fa 0%, #e0e7ff 100%)',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <header style={{ background: '#22223b', color: '#fff', padding: '32px 0', textAlign: 'center', boxShadow: '0 2px 8px #0002' }}>
        <h1 style={{ fontSize: 40, margin: 0 }}>Dashboard SaaS</h1>
        <p style={{ fontSize: 18, margin: 0 }}>Gerencie seus sites com facilidade e estilo</p>
      </header>
      <main style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0002', padding: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 style={{ color: '#22223b', margin: 0 }}>Seus sites</h2>
          <div>
            <Link href="/sites" style={{ marginRight: 16, color: '#4a4e69', textDecoration: 'none', fontWeight: 500 }}>Ver sites públicos</Link>
            <Link href="/sites/new" style={{ background: '#4a4e69', color: '#fff', padding: '8px 18px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>+ Novo site</Link>
          </div>
        </div>
        {(loadingUser || loadingSites) && <p>Carregando sites...</p>}
        {!loadingUser && !loadingSites && sites.length === 0 && <p>Nenhum site criado ainda.</p>}
        {!loadingUser && !loadingSites && sites.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {sites.map(site => (
              <div key={site.id} style={{ background: '#f8f9fa', borderRadius: 10, boxShadow: '0 1px 6px #0001', padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220 }}>
                <div>
                  <h3 style={{ color: '#4a4e69', margin: 0 }}>{site.name || site.title || site.id}</h3>
                  <p style={{ color: '#222', margin: '8px 0 0 0', fontSize: 15 }}>{site.description}</p>
                  <p style={{ color: '#888', fontSize: 13, margin: '8px 0 0 0' }}>Template: <b>{site.template}</b></p>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                  <Link href={`/sites/${site.id}`} style={{ background: '#22223b', color: '#fff', padding: '8px 14px', borderRadius: 5, textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>Visualizar</Link>
                  <Link href={`/sites/${site.id}/edit`} style={{ background: '#4a4e69', color: '#fff', padding: '8px 14px', borderRadius: 5, textDecoration: 'none', fontWeight: 500, fontSize: 15 }}>Editar</Link>
                  <button onClick={() => handleDelete(site.id)} disabled={deleting === site.id} style={{ background: '#e63946', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 5, fontWeight: 500, fontSize: 15, cursor: 'pointer', opacity: deleting === site.id ? 0.6 : 1 }}>
                    {deleting === site.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


