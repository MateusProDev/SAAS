"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirebaseAuthUser } from '../../../../src/hooks/useFirebaseAuthUser';
import PortfolioEditor from '../../../../src/components/PortfolioEditor';
import Link from 'next/link';
import styles from './portfolio-edit.module.css';

export default function PortfolioEditPage() {
  const { user, loading: loadingUser } = useFirebaseAuthUser();
  const router = useRouter();
  const params = useParams();
  const siteId = params?.id as string;

  // Protege a rota: se não autenticado e não carregando, redireciona para login
  useEffect(() => {
    if (!loadingUser && !user) {
      router.replace('/login');
    }
  }, [user, loadingUser, router]);

  if (loadingUser) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado
  }

  if (!siteId) {
    return (
      <div className={styles.error}>
        <h2>Site não encontrado</h2>
        <p>ID do site não foi fornecido.</p>
        <Link href="/dashboard" className={styles.backButton}>
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/dashboard" className={styles.backLink}>
          ← Voltar ao Dashboard
        </Link>
        <div className={styles.navActions}>
          <Link 
            href={`/sites/${siteId}`} 
            className={styles.previewLink}
            target="_blank"
          >
            👁️ Visualizar Site
          </Link>
        </div>
      </nav>

      <PortfolioEditor siteId={siteId} />
    </div>
  );
}
