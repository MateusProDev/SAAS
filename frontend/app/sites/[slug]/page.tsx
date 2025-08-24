"use client";

import React, { useState, useEffect } from "react";
import { PlanBadge } from '../../../src/components/PlanBadge';
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
  const { plan } = usePlan();
  const { slug } = useParams();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPublicSiteBySlug(slug as string)
      .then(siteData => {
        setSite(siteData);
        setLoading(false);
      })
      .catch(err => {
        setError('Site não encontrado');
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!site) return null;

  const canUseCustomDomain = plan === 'pro';

  return (
    <div className={styles.container}>
      <PlanBadge />
      {/* Renderização do template */}
      {site.template === "barbearia" && <BarbeariaTemplate site={site} />}
      {site.template === "comercial" && <ComercialTemplate site={site} />}
      {site.template === "agencia" && <AgenciaViagemTemplate site={site} />}
      {site.template === "portfolio" && <PortfolioTemplate site={site} />}
      
      <div style={{marginTop:32}}>
        <h3>Domínio personalizado</h3>
        {canUseCustomDomain && (
          <div style={{color:'#10b981'}}>Configure um domínio personalizado para seu site.</div>
        )}
      </div>
    </div>
  );
}
