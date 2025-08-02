
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BarbeariaTemplate } from "../../../src/templates/BarbeariaTemplate";
import { ComercialTemplate } from "../../../src/templates/ComercialTemplate";
import { AgenciaViagemTemplate } from "../../../src/templates/AgenciaViagemTemplate";
import { PortfolioTemplate } from "../../../src/templates/PortfolioTemplate";
import styles from './site-detail.module.css';

export default function SiteDetailPage() {
  const { id } = useParams();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState<string>("");

  // Busca o site na coleção 'sites' do Firestore
  useEffect(() => {
    async function fetchSite() {
      setLoading(true);
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("../../../src/utils/firebase");
        const ref = doc(db, "sites", id as string);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setSite({ id: snap.id, ...snap.data() });
          setTemplateId(snap.data().template || "");
        } else {
          setSite(null);
        }
      } catch {
        setSite(null);
      }
      setLoading(false);
    }
    if (id) fetchSite();
  }, [id]);

  if (loading) {
    return (
      <div className={styles['site-detail-loading']}>
        ⏳ Carregando site...
      </div>
    );
  }
  
  if (!site) {
    return (
      <div className={styles['site-detail-not-found']}>
        <h1>❌ Site não encontrado</h1>
        <p>O site que você está procurando não existe ou foi removido.</p>
        <Link href="/sites" className={styles['site-detail-back-link']}>
          ← Voltar aos Sites
        </Link>
      </div>
    );
  }

  // Se o template da barbearia existir e for o selecionado, renderize o HTML do template


  if (templateId === "barbearia") {
    return <BarbeariaTemplate site={site} />;
  }
  if (templateId === "comercial") {
    return <ComercialTemplate site={site} />;
  }
  if (templateId === "agencia") {
    return <AgenciaViagemTemplate site={site} />;
  }
  if (templateId === "portfolio") {
    return <PortfolioTemplate site={site} />;
  }

  // Fallback: renderização responsiva premium
  return (
    <div className={styles['site-detail-root']}>
      <div className={styles['site-detail-fallback']}>
        <div className={styles['site-detail-header']}>
          <h1 className={styles['site-detail-title']}>
            {site.name || site.title}
          </h1>
          <p className={styles['site-detail-description']}>
            {site.description}
          </p>
        </div>

        <div className={styles['site-detail-info']}>
          {site.address && (
            <div className={styles['site-detail-info-card']}>
              <div className={styles['site-detail-info-label']}>
                📍 Endereço
              </div>
              <div className={styles['site-detail-info-value']}>
                {site.address}
              </div>
            </div>
          )}
          
          {site.email && (
            <div className={styles['site-detail-info-card']}>
              <div className={styles['site-detail-info-label']}>
                📧 Email
              </div>
              <div className={styles['site-detail-info-value']}>
                {site.email}
              </div>
            </div>
          )}
          
          {site.phone && (
            <div className={styles['site-detail-info-card']}>
              <div className={styles['site-detail-info-label']}>
                📞 Telefone
              </div>
              <div className={styles['site-detail-info-value']}>
                {site.phone}
              </div>
            </div>
          )}
          
          <div className={styles['site-detail-info-card']}>
            <div className={styles['site-detail-info-label']}>
              🎨 Template
            </div>
            <div className={styles['site-detail-info-value']}>
              {site.template === 'barbearia' && '🪒 Barbearia'}
              {site.template === 'comercial' && '🏢 Comercial'}
              {site.template === 'agencia' && '✈️ Agência de Viagem'}
              {!['barbearia', 'comercial', 'agencia'].includes(site.template) && site.template}
            </div>
          </div>
        </div>

        {site.services && site.services.length > 0 && (
          <div className={styles['site-detail-services']}>
            <h2 className={styles['site-detail-services-title']}>
              🛠️ Serviços
            </h2>
            <div className={styles['site-detail-services-grid']}>
              {site.services.map((srv: any, idx: number) => (
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
