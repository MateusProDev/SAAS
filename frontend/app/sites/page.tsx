"use client";
import React from 'react';
import Link from 'next/link';
import { useSitesFirestore } from '../../src/hooks/useSitesFirestore';
import styles from './sites.module.css';

export default function SitesPage() {
  const { sites, loading } = useSitesFirestore();

  if (loading) {
    return (
      <div className={styles['sites-root']}>
        <header className={styles['sites-header']}>
          <div className={styles['sites-header-content']}>
            <h1 className={styles['sites-title']}>Sites Públicos</h1>
            <Link href="/dashboard" className={styles['sites-back-link']}>
              ← Voltar ao Dashboard
            </Link>
          </div>
        </header>
        <div className={styles['sites-loading']}>
          ⏳ Carregando sites...
        </div>
      </div>
    );
  }

  return (
    <div className={styles['sites-root']}>
      <header className={styles['sites-header']}>
        <div className={styles['sites-header-content']}>
          <h1 className={styles['sites-title']}>Sites Públicos</h1>
          <Link href="/dashboard" className={styles['sites-back-link']}>
            ← Voltar ao Dashboard
          </Link>
        </div>
      </header>
      
      <main className={styles['sites-main']}>
        {sites.length === 0 ? (
          <div className={styles['sites-empty']}>
            Nenhum site público encontrado.
          </div>
        ) : (
          <div className={styles['sites-grid']}>
            {sites.map((site) => (
              <div key={site.id} className={styles['site-card']}>
                <div className={styles['site-card-header']}>
                  <h2 className={styles['site-card-title']}>
                    <Link href={`/sites/${site.slug || site.id}`} className={styles['site-link']}>
                      🌐 {site.name || site.title}
                    </Link>
                  </h2>
                  <p className={styles['site-card-description']}>
                    {site.description}
                  </p>
                </div>
                
                <div className={styles['site-card-meta']}>
                  <span className={styles['site-card-template']}>
                    {site.template === 'barbearia' && '🪒 Barbearia'}
                    {site.template === 'comercial' && '🏢 Comercial'}
                    {site.template === 'agencia' && '✈️ Agência'}
                    {!['barbearia', 'comercial', 'agencia'].includes(site.template) && `🎨 ${site.template}`}
                  </span>
                  
                  <div className={styles['site-card-actions']}>
                    <Link 
                      href={`/sites/${site.id}`} 
                      className={`${styles['site-card-btn']} ${styles['site-card-btn-view']}`}
                    >
                      🌐 Ver Site
                    </Link>
                    <Link 
                      href={`/sites/${site.id}`} 
                      className={`${styles['site-card-btn']} ${styles['site-card-btn-preview']}`}
                    >
                      �️ Preview
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
