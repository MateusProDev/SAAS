
"use client";


import React, { useState, useEffect } from "react";
import { PlanBadge } from '../../../src/components/PlanBadge';
import { UpsellBanner } from '../../../src/components/UpsellBanner';
import { usePlan } from '../../../src/contexts/PlanContext';
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
  const { plan, isTrialActive } = usePlan();
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
  // Update the type for site to include "portfolio" in the template property
  type SiteTemplateType = "barbearia" | "comercial" | "agencia" | "portfolio";
  interface SiteType {
    template: SiteTemplateType;
    title: string;
    description: string;
    customization?: {
      contact?: {
        address?: string;
        email?: string;
        phone?: string;
      };
      services?: any[];
    };
    // ...other properties
  }
  const { data: site, loading, error } = useSiteEditor(userId || '', id as string) as { data: SiteType | null, loading: boolean, error: any };

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

  // Exemplo: proteção de domínio personalizado
  const canUseCustomDomain = plan === 'pro' || isTrialActive;

  return (
    <div>
      <PlanBadge />
      {!canUseCustomDomain && <UpsellBanner />}
      {/* Renderização do template */}
      {site.template === "barbearia" && <BarbeariaTemplate site={site} />}
      {site.template === "comercial" && <ComercialTemplate site={site} />}
      {site.template === "agencia" && <AgenciaViagemTemplate site={site} />}
      {site.template === "portfolio" && <PortfolioTemplate site={site} />}
      {/* Exemplo de recurso premium bloqueado */}
      <div style={{marginTop:32}}>
        <h3>Domínio personalizado</h3>
        {canUseCustomDomain ? (
          <div style={{color:'#10b981'}}>Você pode configurar seu domínio personalizado aqui.</div>
        ) : (
          <div style={{color:'#ef4444'}}>Recurso disponível apenas para plano PRO. <UpsellBanner /></div>
        )}
      </div>
    </div>
  );
}
