"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSettings, FiPlus, FiGlobe, FiEdit2, FiEye, FiTrash2, FiLogOut } from 'react-icons/fi';
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
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.brand}>
            <FiSettings className={styles.logoIcon} />
            <div className={styles.brandText}>
              <h1>MabelSoft Dashboard</h1>
              <p>Gerencie seus sites com facilidade</p>
            </div>
          </div>
          
          <div className={styles.userActions}>
            {user && (
              <div className={styles.userProfile}>
                <div className={styles.avatar}>
                  {user.displayName ? user.displayName[0] : (user.email ? user.email[0] : '?')}
                </div>
                <span className={styles.userName}>
                  {user.displayName || user.email}
                </span>
              </div>
            )}
            
            <button 
              onClick={handleLogout} 
              disabled={logoutLoading}
              className={styles.logoutButton}
            >
              <FiLogOut />
              <span>{logoutLoading ? 'Saindo...' : 'Sair'}</span>
            </button>
            
            <Link href="/sites/new" className={styles.primaryButton}>
              <FiPlus />
              <span>Criar site</span>
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          <div className={styles.pageHeader}>
            <h2>Meus Sites</h2>
            <p>Gerencie todos os seus sites em um só lugar</p>
          </div>

          {(loadingUser || loadingSites) && (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Carregando seus sites...</p>
            </div>
          )}

          {!loadingUser && !loadingSites && sites.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIllustration}>
                <FiGlobe size={48} />
              </div>
              <h3>Nenhum site criado ainda</h3>
              <p>Comece criando seu primeiro site para aparecer aqui</p>
              <Link href="/sites/new" className={styles.primaryButton}>
                <FiPlus />
                <span>Criar primeiro site</span>
              </Link>
            </div>
          )}

          {!loadingUser && !loadingSites && sites.length > 0 && (
            <div className={styles.sitesGrid}>
              {sites.map((site) => (
                <div key={site.id} className={styles.siteCard}>
                  <div className={styles.cardHeader}>
                    <h3>{site.name || site.title || site.id}</h3>
                    <span className={styles.templateBadge}>{site.template}</span>
                  </div>
                  
                  <div className={styles.cardBody}>
                    <p className={styles.siteDescription}>
                      {site.description && site.description.length > 120 
                        ? `${site.description.substring(0, 120)}...` 
                        : site.description || 'Sem descrição'}
                    </p>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <div className={styles.actions}>
                      <Link 
                        href={`/sites/${site.id}`} 
                        className={`${styles.actionButton} ${styles.viewButton}`}
                      >
                        <FiGlobe />
                        <span>Visualizar</span>
                      </Link>
                      
                      <Link 
                        href={getEditRoute(site.id, site.template)} 
                        className={`${styles.actionButton} ${styles.editButton}`}
                      >
                        <FiEdit2 />
                        <span>Editar</span>
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(site.id)}
                        disabled={deleting === site.id}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        <FiTrash2 />
                        <span>{deleting === site.id ? 'Excluindo...' : 'Excluir'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}