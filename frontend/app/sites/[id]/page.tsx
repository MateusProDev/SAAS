
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { BarbeariaTemplate } from "../../../src/templates/BarbeariaTemplate";
import { ComercialTemplate } from "../../../src/templates/ComercialTemplate";
import { AgenciaViagemTemplate } from "../../../src/templates/AgenciaViagemTemplate";

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

  if (loading) return <div>Carregando...</div>;
  if (!site) return <div>Site não encontrado.</div>;

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

  // Fallback: renderização padrão
  return (
    <div style={{ padding: 32 }}>
      <h1>{site.name || site.title}</h1>
      <p>{site.description}</p>
      <p><b>Endereço:</b> {site.address}</p>
      <p><b>Email:</b> {site.email}</p>
      <p><b>Telefone:</b> {site.phone}</p>
      <p><b>Template:</b> {site.template}</p>
      <h2>Serviços</h2>
      <ul>
        {site.services && site.services.map((srv: any, idx: number) => (
          <li key={idx}><b>{srv.name}:</b> {srv.description}</li>
        ))}
      </ul>
    </div>
  );
}
