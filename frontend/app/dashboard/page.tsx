"use client";

import React, { useState, useEffect } from 'react';
import { UpsellBanner } from '../../src/components/UpsellBanner';
import { PlanBadge } from '../../src/components/PlanBadge';
import { usePlan } from '../../src/contexts/PlanContext';
import Link from 'next/link';
import { 
  FiSettings, FiPlus, FiGlobe, FiEdit2, FiEye, FiTrash2, FiLogOut,
  FiCheckCircle, FiClock, FiAlertCircle, FiUpload, FiActivity, FiSun, FiMoon 
} from 'react-icons/fi';
import { useUserSitesFirestore } from '../../src/hooks/useUserSitesFirestore';
import { useFirebaseAuthUser } from '../../src/hooks/useFirebaseAuthUser';
import { deleteSite } from '../../src/hooks/deleteSite';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { plan } = usePlan();
  const { user, loading: loadingUser } = useFirebaseAuthUser();
  const router = useRouter();
  const { sites, loading: loadingSites, refreshSites } = useUserSitesFirestore(user?.uid || "");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Alterna manualmente o modo
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  // Detecta o modo de cor do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const handler = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

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
    const toastId = toast.loading('Excluindo site...');
    try {
      await deleteSite(user.uid, siteId);
      toast.success('Site excluído com sucesso!', { id: toastId });
      await refreshSites();
    } catch (error) {
      toast.error('Erro ao excluir site', { id: toastId });
    } finally {
      setDeleting(null);
    }
  }

  async function handleLogout() {
    setLogoutLoading(true);
    const toastId = toast.loading('Saindo...');
    try {
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('../../src/utils/firebase');
      await signOut(auth);
      toast.success('Logout realizado!', { id: toastId });
      window.location.href = '/login';
    } catch {
      toast.error('Erro ao deslogar', { id: toastId });
    } finally {
      setLogoutLoading(false);
    }
  }

  // Função para obter status real do site
  const getSiteStatus = (site: any) => {
    if (site.published) {
      return {
        type: 'active',
        label: 'Ativo',
        icon: <FiActivity />,
        color: 'primary'
      };
    } else {
      return {
        type: 'draft',
        label: 'Rascunho',
        icon: <FiClock />,
        color: 'warning'
      };
    }
  };

  return (
    <div className={`${styles.dashboard} ${isDarkMode ? styles.darkMode : ''}`}>
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
            <button onClick={toggleDarkMode} className={styles.toggleThemeButton} aria-label="Alternar tema">
              {isDarkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
            </button>
            {user && (
              <div className={styles.userProfile}>
                <div className={`${styles.avatar} ${styles.avatarGlow}`}>
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
            
            <Link href="/sites/new" className={styles.createButton}>
              <FiPlus />
              <span>Criar site</span>
              <div className={styles.buttonPulse}></div>
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
              <Link href="/sites/new" className={styles.createButton}>
                <FiPlus />
                <span>Criar primeiro site</span>
                <div className={styles.buttonPulse}></div>
              </Link>
            </div>
          )}

          {!loadingUser && !loadingSites && sites.length > 0 && (
            <div className={styles.sitesGrid}>
              {sites.map((site, index) => {
                const status = getSiteStatus(site);
                return (
                  <div 
                    key={site.id} 
                    className={styles.siteCard}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={styles.cardHeader}>
                      <h3>{site.name || site.title || site.id}</h3>
                      <div className={styles.statusBadge} data-status={status.color}>
                        {status.icon}
                        <span>{status.label}</span>
                      </div>
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
                          {deleting === site.id ? (
                            <div className={styles.buttonLoader}></div>
                          ) : (
                            <>
                              <FiTrash2 />
                              <span>Excluir</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}