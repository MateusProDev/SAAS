
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCog } from 'react-icons/fa';
import { useUserSitesFirestore } from '../../src/hooks/useUserSitesFirestore';
import { useFirebaseAuthUser } from '../../src/hooks/useFirebaseAuthUser';
import { deleteSite } from '../../src/hooks/deleteSite';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { user, loading: loadingUser } = useFirebaseAuthUser();
  const router = useRouter();
  const { sites, loading: loadingSites, refreshSites } = useUserSitesFirestore(user?.uid || "");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Função para determinar a rota de edição baseada no template
  const getEditRoute = (siteId: string, template: string) => {
    switch (template) {
      case 'portfolio':
        return `/sites/${siteId}/portfolio`;
      case 'barbearia':
      case 'comercial':
      case 'agencia':
      default:
        return `/sites/${siteId}/edit`;
    }
  };

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
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../../src/utils/firebase');
      await signOut(auth);
      window.location.href = '/login';
    } catch {
      alert('Erro ao deslogar.');
    } finally {
      setLogoutLoading(false);
    }
  }

  return (
    <div className={styles['dashboard-root']}>
      <header className={styles['dashboard-header']}>
        <div className={styles['dashboard-header-content']}>
          <div className={styles['dashboard-logo-section']}>
            <FaCog style={{ fontSize: 40, color: '#6366f1' }} />
            <div className={styles['dashboard-title-group']}>
              <h1>Dashboard MabelSoft</h1>
              <p>Gerencie seus sites com facilidade e estilo</p>
            </div>
          </div>
          <div className={styles['dashboard-user-section']}>
            {user && (
              <div className={styles['dashboard-user-info']}>
                <div className={styles['dashboard-user-avatar']}>
                  {user.displayName ? user.displayName[0] : (user.email ? user.email[0] : '?')}
                </div>
                <div className={styles['dashboard-user-name']}>
                  {user.displayName || user.email}
                </div>
              </div>
            )}
            <button 
              onClick={handleLogout} 
              disabled={logoutLoading} 
              className={styles['dashboard-logout-btn']}
            >
              {logoutLoading ? 'Saindo...' : 'Sair'}
            </button>
          </div>
        </div>
      </header>
      <main className={styles['dashboard-main']}>
        <div className={styles['dashboard-header-section']}>
          <h2 className={styles['dashboard-section-title']}>Seus sites</h2>
          <div className={styles['dashboard-actions']}>
            <Link href="/sites" className={styles['dashboard-link']}>
              Ver sites públicos
            </Link>
            <Link href="/sites/new" className={styles['dashboard-new-site-btn']}>
              + Novo site
            </Link>
          </div>
        </div>
        
        {(loadingUser || loadingSites) && (
          <div className={styles['dashboard-loading']}>
            ⏳ Carregando sites...
          </div>
        )}
        
        {!loadingUser && !loadingSites && sites.length === 0 && (
          <div className={styles['dashboard-empty']}>
            Nenhum site criado ainda. Comece criando seu primeiro site!
          </div>
        )}
        
        {!loadingUser && !loadingSites && sites.length > 0 && (
          <div className={styles['dashboard-sites-grid']}>
            {sites.map(site => (
              <div key={site.id} className={styles['dashboard-site-card']}>
                <div className={styles['dashboard-site-info']}>
                  <h3>{site.name || site.title || site.id}</h3>
                  <p className="description">
                    {site.description && site.description.length > 100 
                      ? `${site.description.substring(0, 100)}...` 
                      : site.description || 'Sem descrição'}
                  </p>
                  <p className="template">Template: <b>{site.template}</b></p>
                </div>
                <div className={styles['dashboard-site-actions']}>
                  <Link 
                    href={`/sites/${site.id}`} 
                    className={`${styles['dashboard-site-btn']} ${styles['dashboard-site-btn-view']}`}
                  >
                    Visualizar
                  </Link>
                  <Link 
                    href={getEditRoute(site.id, site.template)} 
                    className={`${styles['dashboard-site-btn']} ${styles['dashboard-site-btn-edit']}`}
                  >
                    Editar
                  </Link>
                  <button 
                    onClick={() => handleDelete(site.id)} 
                    disabled={deleting === site.id} 
                    className={`${styles['dashboard-site-btn']} ${styles['dashboard-site-btn-delete']}`}
                  >
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


