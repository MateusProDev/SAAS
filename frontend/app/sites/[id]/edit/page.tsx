'use client';

import React, { useState } from 'react';
import { useFirebaseAuthUser } from '../../../../src/hooks/useFirebaseAuthUser';
import { useSiteEditor, BarbeariaCustomization } from '../../../../src/hooks/useSiteEditor';
import { usePortfolioEditor } from '../../../../src/hooks/usePortfolioEditor';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditSitePage({ params }: PageProps) {
  const { user } = useFirebaseAuthUser();
  
  // Primeiro carrega dados básicos para verificar template
  const {
    data: siteData,
    loading: siteLoading,
    error: siteError,
    saving: siteSaving,
    togglePublish: siteTogglePublish,
    updateHero: siteUpdateHero,
    updateAbout: siteUpdateAbout,
    updateContact: siteUpdateContact,
    updateTheme: siteUpdateTheme,
    addService: siteAddService,
    updateService: siteUpdateService,
    removeService: siteRemoveService,
  } = useSiteEditor(user?.uid || '', params.id);
  
  // Hook específico para portfólio (ativo apenas se for portfolio)
  const portfolioHook = usePortfolioEditor(
    user?.uid || '', 
    params.id
  );

  // Detecta se é portfolio e usa dados apropriados
  const isPortfolio = (siteData as any)?.template === 'portfolio' || portfolioHook.data?.template === 'portfolio';
  
  const data = isPortfolio ? portfolioHook.data : siteData;
  const loading = isPortfolio ? portfolioHook.loading : siteLoading;
  const error = isPortfolio ? portfolioHook.error : siteError;
  const saving = isPortfolio ? portfolioHook.saving : siteSaving;
  
  // Funções baseadas no template
  const togglePublish = isPortfolio ? portfolioHook.togglePublish : siteTogglePublish;
  const updateHero = isPortfolio ? portfolioHook.updatePersonalInfo : siteUpdateHero;
  const updateAbout = isPortfolio ? portfolioHook.updateAbout : siteUpdateAbout;
  const updateContact = isPortfolio ? portfolioHook.updatePersonalInfo : siteUpdateContact;
  const updateTheme = isPortfolio ? portfolioHook.updateTheme : siteUpdateTheme;
  const addService = isPortfolio ? portfolioHook.addService : siteAddService;
  const updateService = isPortfolio ? portfolioHook.updateService : siteUpdateService;
  const removeService = isPortfolio ? portfolioHook.removeService : siteRemoveService;

  const [activeTab, setActiveTab] = useState('hero');

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
          <p>Carregando editor...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center', color: '#dc3545' }}>
          <h2>Erro ao carregar editor</h2>
          <p>{error || 'Dados não encontrados'}</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{ 
              color: '#007bff', 
              textDecoration: 'none',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            ← Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handlePublish = async () => {
    const success = await togglePublish();
    if (success) {
      alert(`Site ${data.published ? 'despublicado' : 'publicado'} com sucesso!`);
    } else {
      alert('Erro ao alterar status de publicação');
    }
  };

  const handleAddService = async () => {
    if (isPortfolio && portfolioHook.addService) {
      const success = await portfolioHook.addService({
        name: 'Novo Serviço',
        description: 'Descrição do serviço',
        price: 'A partir de R$ 100',
        icon: '💼'
      });
      if (!success) {
        alert('Erro ao adicionar serviço');
      }
    } else if (siteAddService) {
      const success = await siteAddService({
        name: 'Novo Serviço',
        price: 0,
        duration: '30min'
      });
      if (!success) {
        alert('Erro ao adicionar serviço');
      }
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    if (!window.confirm('Tem certeza que deseja remover este serviço?')) return;
    
    const success = await removeService(serviceId);
    if (!success) {
      alert('Erro ao remover serviço');
    }
  };

  const handleUpdateService = async (serviceId: string, field: string, value: any) => {
    const success = await updateService(serviceId, { [field]: value });
    if (!success) {
      alert('Erro ao atualizar serviço');
    }
  };

  const tabs = [
    { id: 'hero', label: 'Principal', icon: '🏠' },
    { id: 'about', label: 'Sobre', icon: 'ℹ️' },
    { id: 'services', label: 'Serviços', icon: '⚡' },
    { id: 'contact', label: 'Contato', icon: '📞' },
    { id: 'theme', label: 'Tema', icon: '🎨' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '20px',
        borderBottom: '1px solid #e0e0e0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Editor de Site</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Editando: {data.title} (ID: {params.id})
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'none',
                color: '#333'
              }}
            >
              ← Voltar
            </button>
            <button 
              onClick={() => window.open(`/preview/${user?.uid}/${params.id}`, '_blank')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              👁️ Preview
            </button>
            <button 
              onClick={() => {
                // Alternativa: abre no sistema antigo (compatibilidade)
                window.open(`/sites/${params.id}`, '_blank');
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6f42c1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🌐 Ver Site
            </button>
            <button 
              onClick={handlePublish}
              disabled={saving}
              style={{
                padding: '10px 20px',
                backgroundColor: data.published ? '#ffc107' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? '⏳ Salvando...' : (data.published ? '📤 Despublicar' : '📢 Publicar')}
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Tabs Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px 8px 0 0',
          padding: '0',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '15px 20px',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#007bff' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#666',
                  cursor: 'pointer',
                  borderRadius: activeTab === tab.id ? '6px 6px 0 0' : '0',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0 0 8px 8px',
          padding: '30px',
          minHeight: '500px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* Hero Tab */}
          {activeTab === 'hero' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏠 Seção Principal
              </h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Título Principal:
                  </label>
                  <input
                    type="text"
                    value={isPortfolio 
                      ? (data as any).personalInfo?.name || ''
                      : (data as any).customization?.hero?.title || ''
                    }
                    onChange={(e) => updateHero({ title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '16px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Subtítulo:
                  </label>
                  <textarea
                    value={isPortfolio 
                      ? (data as any).personalInfo?.tagline || ''
                      : (data as any).customization?.hero?.subtitle || ''
                    }
                    onChange={(e) => updateHero({ subtitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '100px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ℹ️ Sobre a Empresa
              </h2>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Título da Seção:
                  </label>
                  <input
                    type="text"
                    value={isPortfolio 
                      ? (data as any).about?.title || 'Sobre mim'
                      : (data as any).customization?.about?.title || ''
                    }
                    onChange={(e) => updateAbout({ title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '16px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Conteúdo:
                  </label>
                  <textarea
                    value={isPortfolio 
                      ? (data as any).about?.content || ''
                      : (data as any).customization?.about?.content || ''
                    }
                    onChange={(e) => updateAbout({ content: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '150px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && data.template === 'barbearia' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚡ Serviços
                </h2>
                <button
                  onClick={handleAddService}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  + Adicionar Serviço
                </button>
              </div>
              <div style={{ display: 'grid', gap: '15px' }}>
                {((data as any).customization as BarbeariaCustomization).services.map((service) => (
                  <div key={service.id} style={{
                    padding: '20px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Nome:</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => handleUpdateService(service.id, 'name', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            outline: 'none',
                            backgroundColor: '#fff',
                            color: '#333'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Preço (R$):</label>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => handleUpdateService(service.id, 'price', Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            outline: 'none',
                            backgroundColor: '#fff',
                            color: '#333'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Duração:</label>
                        <input
                          type="text"
                          value={service.duration}
                          onChange={(e) => handleUpdateService(service.id, 'duration', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            outline: 'none',
                            backgroundColor: '#fff',
                            color: '#333'
                          }}
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveService(service.id)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📞 Informações de Contato
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Telefone:</label>
                  <input
                    type="text"
                    value={isPortfolio 
                      ? (data as any).personalInfo?.phone || ''
                      : (data as any).customization?.contact?.phone || ''
                    }
                    onChange={(e) => updateContact({ phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Email:</label>
                  <input
                    type="email"
                    value={isPortfolio 
                      ? (data as any).personalInfo?.email || ''
                      : (data as any).customization?.contact?.email || ''
                    }
                    onChange={(e) => updateContact({ email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Endereço:</label>
                  <input
                    type="text"
                    value={(data as any).customization?.contact?.address || ''}
                    onChange={(e) => updateContact({ address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>WhatsApp:</label>
                  <input
                    type="text"
                    value={(data as any).customization?.contact?.whatsapp || ''}
                    onChange={(e) => updateContact({ whatsapp: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Instagram:</label>
                  <input
                    type="text"
                    value={(data as any).customization?.contact?.instagram || ''}
                    onChange={(e) => updateContact({ instagram: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fff',
                      color: '#333'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎨 Personalização Visual
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Cor Primária:</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={isPortfolio 
                        ? (data as any).theme?.primaryColor || '#007bff'
                        : (data as any).customization?.theme?.primaryColor || '#007bff'
                      }
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      style={{
                        width: '60px',
                        height: '40px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      value={isPortfolio 
                        ? (data as any).theme?.primaryColor || '#007bff'
                        : (data as any).customization?.theme?.primaryColor || '#007bff'
                      }
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#fff',
                        color: '#333'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Cor Secundária:</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={isPortfolio 
                        ? (data as any).theme?.secondaryColor || '#6c757d'
                        : (data as any).customization?.theme?.secondaryColor || '#6c757d'
                      }
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      style={{
                        width: '60px',
                        height: '40px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      value={isPortfolio 
                        ? (data as any).theme?.secondaryColor || '#6c757d'
                        : (data as any).customization?.theme?.secondaryColor || '#6c757d'
                      }
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#fff',
                        color: '#333'
                      }}
                    />
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <h3 style={{ color: '#333', marginBottom: '15px' }}>Preview das Cores:</h3>
                  <div style={{
                    padding: '20px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: isPortfolio 
                      ? (data as any).theme?.primaryColor || '#007bff'
                      : (data as any).customization?.theme?.primaryColor || '#007bff',
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Cor Primária</h4>
                    <div style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      backgroundColor: isPortfolio 
                        ? (data as any).theme?.secondaryColor || '#6c757d'
                        : (data as any).customization?.theme?.secondaryColor || '#6c757d',
                      borderRadius: '4px',
                      color: 'white'
                    }}>
                      Cor Secundária
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}