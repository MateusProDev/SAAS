'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useFirebaseAuthUser } from '../../../../src/hooks/useFirebaseAuthUser';
import { useSiteEditor, BarbeariaCustomization, ComercialCustomization, AgenciaCustomization } from '../../../../src/hooks/useSiteEditor';
import { BarbeariaTemplate } from '../../../../src/templates/BarbeariaTemplate';
import { ComercialTemplate } from '../../../../src/templates/ComercialTemplate';
import { AgenciaViagemTemplate } from '../../../../src/templates/AgenciaViagemTemplate';

interface PageProps {
  params: {
    userId: string;
    siteId: string;
  };
}

export default function PreviewPage({ params }: PageProps) {
  const { user } = useFirebaseAuthUser();
  const {
    data: siteData,
    loading,
    error
  } = useSiteEditor(params.userId, params.siteId);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid #e3e3e3',
            borderTop: '3px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Carregando preview...</p>
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center', color: '#dc3545' }}>
          <h2>Erro ao carregar preview</h2>
          <p>{error || 'Site não encontrado'}</p>
          <button 
            onClick={() => window.history.back()}
            style={{ 
              color: '#007bff', 
              textDecoration: 'none',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '10px'
            }}
          >
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  // Converter dados do Firebase para formato compatível com templates
  const templateData = {
    id: siteData.id,
    name: siteData.title,
    title: siteData.title,
    description: siteData.description,
    template: siteData.template,
    published: siteData.published,
    
    // Dados do hero com compatibilidade
    hero: {
      title: siteData.customization.hero.title,
      subtitle: siteData.customization.hero.subtitle,
      buttonText: siteData.customization.hero.ctaText || 'Entrar em Contato',
      buttonUrl: siteData.customization.hero.ctaUrl || '#contact'
    },
    
    // Dados sobre
    about: {
      text: siteData.customization.about.content
    },
    
    // Dados de contato
    phone: siteData.customization.contact.phone,
    email: siteData.customization.contact.email,
    address: siteData.customization.contact.address,
    whatsapp: siteData.customization.contact.whatsapp,
    
    // Configurações visuais
    settings: {
      primaryColor: siteData.customization.theme.primaryColor,
      secondaryColor: siteData.customization.theme.secondaryColor,
      fontFamily: siteData.customization.theme.fontFamily,
    }
  };

  // Adicionar dados específicos por template com conversões corretas
  if (siteData.template === 'barbearia') {
    const barbeariaData = siteData.customization as BarbeariaCustomization;
    (templateData as any).services = Array.isArray(barbeariaData.services)
      ? barbeariaData.services.map(service => {
          let priceFormatted = '';
          if (typeof service.price === 'number') {
            priceFormatted = `R$ ${service.price.toFixed(2).replace('.', ',')}`;
          } else if (typeof service.price === 'string') {
            priceFormatted = (service.price && String(service.price).startsWith('R$')) ? service.price : `R$ ${service.price}`;
          }
          return {
            id: service.id,
            name: service.name,
            description: `Duração: ${service.duration}`,
            price: priceFormatted
          };
        })
      : [];
  }
  
  if (siteData.template === 'comercial') {
    const comercialData = siteData.customization as ComercialCustomization;
    (templateData as any).products = comercialData.products?.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: `R$ ${product.price.toFixed(2).replace('.', ',')}`,
      category: product.category,
      image: product.image,
      featured: product.featured
    })) || [];
    (templateData as any).categories = comercialData.categories || [];
    (templateData as any).testimonials = comercialData.testimonials || [];
    (templateData as any).features = comercialData.features || [];
  }
  
  if (siteData.template === 'agencia') {
    const agenciaData = siteData.customization as AgenciaCustomization;
    (templateData as any).packages = agenciaData.packages?.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: `Duração: ${pkg.duration} | Destinos: ${pkg.destinations.join(', ')}`,
      price: `R$ ${pkg.price.toFixed(2).replace('.', ',')}`,
      duration: pkg.duration,
      destination: pkg.destinations[0] || '',
      category: pkg.featured ? 'Premium' : 'Standard'
    })) || [];
    (templateData as any).destinations = agenciaData.destinations || [];
    (templateData as any).testimonials = agenciaData.testimonials || [];
  }

  // Renderizar template baseado no tipo
  switch (siteData.template) {
    case 'barbearia':
      return <BarbeariaTemplate site={templateData} />;
    case 'comercial':
      return <ComercialTemplate site={templateData} />;
    case 'agencia':
      return <AgenciaViagemTemplate site={templateData} />;
    default:
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h2>Template não suportado</h2>
            <p>Template "{siteData.template}" não está disponível</p>
          </div>
        </div>
      );
  }
}
