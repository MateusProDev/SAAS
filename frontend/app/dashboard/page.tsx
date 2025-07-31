
"use client";

import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import { useUserSitesFirestore } from '../../src/hooks/useUserSitesFirestore';
import { useFirebaseAuthUser } from '../../src/hooks/useFirebaseAuthUser';
import { deleteSite } from '../../src/hooks/deleteSite';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading: loadingUser } = useFirebaseAuthUser();
  const router = useRouter();
  const { sites, loading: loadingSites, refreshSites } = useUserSitesFirestore(user?.uid || "");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Protege a rota: se não autenticado e não carregando, redireciona para login
  useEffect(() => {
    if (!loadingUser && !user) {
      router.replace('/login');
    }
  }, [user, loadingUser, router]);

  async function handleDelete(siteId: string) {
    if (!user?.uid) return;
    if (!window.confirm('Tem certeza que deseja excluir este site? Essa ação não pode ser desfeita.')) return;
    setDeleting(siteId);
    await deleteSite(user.uid, siteId);
    setDeleting(null);
    await refreshSites();
  }

  async function handleLogout() {
    setLogoutLoading(true);
    try {
      const auth = getAuth();
      await signOut(auth);
      window.location.href = '/login';
    } catch {
      alert('Erro ao deslogar.');
    } finally {
      setLogoutLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f6fa 0%, #e0e7ff 100%)',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <header style={{
        background: '#22223b',
        color: '#fff',
        padding: '0',
        boxShadow: '0 2px 8px #0002',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1100,
          margin: '0 auto',
          padding: '24px 32px 16px 32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <img src="/window.svg" alt="Logo" style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', boxShadow: '0 1px 4px #0001' }} />
            <div>
              <h1 style={{ fontSize: 32, margin: 0, color: '#fff', letterSpacing: 1 }}>Dashboard SaaS</h1>
              <p style={{ fontSize: 15, margin: 0, color: '#c9c9e6' }}>Gerencie seus sites com facilidade e estilo</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#4a4e69',
                  fontSize: 18,
                  boxShadow: '0 1px 4px #0001',
                  textTransform: 'uppercase'
                }}>
                  {user.displayName ? user.displayName[0] : (user.email ? user.email[0] : '?')}
                </div>
                <div style={{ color: '#fff', fontSize: 15, fontWeight: 500, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName || user.email}
                </div>
              </div>
            )}
            <button onClick={handleLogout} disabled={logoutLoading} style={{
              background: 'linear-gradient(90deg, #e63946 0%, #ff758f 100%)',
              color: '#fff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #0002',
              opacity: logoutLoading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}>
              {logoutLoading ? 'Saindo...' : 'Sair'}
            </button>
          </div>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0002', padding: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <h2 style={{ color: '#22223b', margin: 0, fontSize: 26, letterSpacing: 0.5 }}>Seus sites</h2>
          <div>
            <Link href="/sites" style={{ marginRight: 18, color: '#4a4e69', textDecoration: 'none', fontWeight: 500, fontSize: 16 }}>Ver sites públicos</Link>
            <Link href="/sites/new" style={{ background: 'linear-gradient(90deg, #4a4e69 0%, #9f86c0 100%)', color: '#fff', padding: '10px 22px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 16, boxShadow: '0 1px 4px #0001' }}>+ Novo site</Link>
          </div>
        </div>
        {(loadingUser || loadingSites) && <p style={{ color: '#4a4e69', fontWeight: 500, fontSize: 18 }}>Carregando sites...</p>}
        {!loadingUser && !loadingSites && sites.length === 0 && <p style={{ color: '#888', fontSize: 17 }}>Nenhum site criado ainda.</p>}
        {!loadingUser && !loadingSites && sites.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
            {sites.map(site => (
              <div key={site.id} style={{ background: '#f8f9fa', borderRadius: 14, boxShadow: '0 1px 8px #0001', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220, border: '1px solid #e0e7ff' }}>
                <div>
                  <h3 style={{ color: '#4a4e69', margin: 0, fontSize: 22 }}>{site.name || site.title || site.id}</h3>
                  <p style={{ color: '#222', margin: '10px 0 0 0', fontSize: 16 }}>{site.description}</p>
                  <p style={{ color: '#888', fontSize: 14, margin: '10px 0 0 0' }}>Template: <b>{site.template}</b></p>
                </div>
                <div style={{ display: 'flex', gap: 14, marginTop: 22 }}>
                  <Link href={`/sites/${site.id}`} style={{ background: '#22223b', color: '#fff', padding: '10px 18px', borderRadius: 7, textDecoration: 'none', fontWeight: 600, fontSize: 16 }}>Visualizar</Link>
                  <Link href={`/sites/${site.id}/edit`} style={{ background: 'linear-gradient(90deg, #4a4e69 0%, #9f86c0 100%)', color: '#fff', padding: '10px 18px', borderRadius: 7, textDecoration: 'none', fontWeight: 600, fontSize: 16 }}>Editar</Link>
                  <button onClick={() => handleDelete(site.id)} disabled={deleting === site.id} style={{ background: 'linear-gradient(90deg, #e63946 0%, #ff758f 100%)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 7, fontWeight: 600, fontSize: 16, cursor: 'pointer', opacity: deleting === site.id ? 0.6 : 1, boxShadow: '0 1px 4px #0001' }}>
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


