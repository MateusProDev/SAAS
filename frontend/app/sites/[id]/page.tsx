
"use client";


import React, { useState, useEffect } from "react";
import { fetchPublicSiteBySlug } from '../../../src/utils/fetchPublicSite';
import { useParams } from "next/navigation";
import Link from "next/link";
import { BarbeariaTemplate } from "../../../src/templates/BarbeariaTemplate";
import { ComercialTemplate } from "../../../src/templates/ComercialTemplate";
import { AgenciaViagemTemplate } from "../../../src/templates/AgenciaViagemTemplate";
import { PortfolioTemplate } from "../../../src/templates/PortfolioTemplate";
import { useSiteEditor } from "../../../src/hooks/useSiteEditor";
import styles from './site-detail.module.css'; 

export default function SiteDetailPage() {
  const { id } = useParams();
  // Para buscar igual ao preview, precisamos do userId. Vamos tentar obter do siteId via published_sites (API) se não estiver no contexto.
  const [userId, setUserId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Busca userId via API published_sites (apenas uma vez, usando SLUG)
  useEffect(() => {
    if (!id) return;
    fetchPublicSiteBySlug(id as string)
      .then((data) => {
        setUserId(data.userId);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  // Só busca dados do Firestore se tiver userId
  const { data: site, loading, error } = useSiteEditor(userId || '', id as string);

  if (notFound) {
    return (
      <div className={styles['site-detail-not-found']}>
        <h1>❌ Site não encontrado</h1>
        <p>O site que você está procurando não existe ou foi removido.</p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          ID procurado: {id}
        </p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link href="/sites" className={styles['site-detail-back-link']}>
            ← Voltar aos Sites
          </Link>
          <Link href="/dashboard" className={styles['site-detail-back-link']}>
            🏠 Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !userId) {
    return (
      <div className={styles['site-detail-loading']}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px'
        }}>
          <div style={{
            width: 48,
            height: 48,
            border: '6px solid #e0e7ff',
            borderTop: '6px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ fontSize: '1.1rem', color: '#667eea', fontWeight: 500 }}>Carregando...</span>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className={styles['site-detail-not-found']}>
        <h1>❌ Site não encontrado</h1>
        <p>O site que você está procurando não existe ou foi removido.</p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          ID procurado: {id}
        </p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link href="/sites" className={styles['site-detail-back-link']}>
            ← Voltar aos Sites
          </Link>
          <Link href="/dashboard" className={styles['site-detail-back-link']}>
            🏠 Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!site) return null;
  if (site!.template === "barbearia") {
    return <BarbeariaTemplate site={site!} />;
  }
  if (site!.template === "comercial") {
    return <ComercialTemplate site={site!} />;
  }
  if (site!.template === "agencia") {
    return <AgenciaViagemTemplate site={site!} />;
  }
  if (site!.template === "portfolio") {
    // Renderiza o portfólio completo com todos os campos
    const { PortfolioTemplate } = require("../../../src/templates/PortfolioTemplate");
    return <PortfolioTemplate site={site!} />;
  }
  // Fallback: renderização responsiva premium
  const contact = site!.customization?.contact || {};
  const services = (site!.customization as any)?.services || [];
  return (
    <div className={styles['site-detail-root']}>
      <div className={styles['site-detail-fallback']}>
        <div className={styles['site-detail-header']}>
          <h1 className={styles['site-detail-title']}>
            {site!.title}
          </h1>
          <p className={styles['site-detail-description']}>
            {site!.description}
          </p>
        </div>
        <div className={styles['site-detail-info']}>
          {contact.address && (
            <div className={styles['site-detail-info-card']}>
              <div className={styles['site-detail-info-label']}>
                📍 Endereço
              </div>
              <div className={styles['site-detail-info-value']}>
                {contact.address}
              </div>
            </div>
          )}
          {contact.email && (
            <div className={styles['site-detail-info-card']}>
              <div className={styles['site-detail-info-label']}>
                📧 Email
              </div>
              <div className={styles['site-detail-info-value']}>
                {contact.email}
              </div>
            </div>
          )}
          {contact.phone && (
            <div className={styles['site-detail-info-card']}>
              <div className={styles['site-detail-info-label']}>
                📞 Telefone
              </div>
              <div className={styles['site-detail-info-value']}>
                {contact.phone}
              </div>
            </div>
          )}
          <div className={styles['site-detail-info-card']}>
            <div className={styles['site-detail-info-label']}>
              🎨 Template
            </div>
            <div className={styles['site-detail-info-value']}>
              {site!.template === 'barbearia' && '🪒 Barbearia'}
              {site!.template === 'comercial' && '🏢 Comercial'}
              {site!.template === 'agencia' && '✈️ Agência de Viagem'}
              {!['barbearia', 'comercial', 'agencia'].includes(site!.template) && site!.template}
            </div>
          </div>
        </div>
        {services && services.length > 0 && (
          <div className={styles['site-detail-services']}>
            <h2 className={styles['site-detail-services-title']}>
              🛠️ Serviços
            </h2>
            <div className={styles['site-detail-services-grid']}>
              {services.map((srv: any, idx: number) => (
                <div key={idx} className={styles['site-detail-service-item']}>
                  <div className={styles['site-detail-service-name']}>
                    {srv.name}
                  </div>
                  <div className={styles['site-detail-service-description']}>
                    {srv.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
