'use client';

import React, { useState } from 'react';

interface PageProps {
  params: {
    id: string;
  };
}

// Dados de exemplo (mock) - substitui Firebase por enquanto
const getMockSiteData = (siteId: string) => ({
  id: siteId,
  title: 'Minha Barbearia',
  description: 'A melhor barbearia da cidade',
  template: 'barbearia',
  customization: {
    hero: {
      title: 'Barbearia Premium',
      subtitle: 'Cortes modernos e tradicionais com o melhor atendimento da cidade'
    },
    about: {
      title: 'Sobre Nós',
      content: 'Somos uma barbearia com mais de 10 anos de experiência, oferecendo os melhores cortes e cuidados masculinos.'
    },
    services: [
      { id: '1', name: 'Corte Masculino', price: 30, duration: '30min' },
      { id: '2', name: 'Barba', price: 20, duration: '20min' },
      { id: '3', name: 'Corte + Barba', price: 45, duration: '45min' }
    ],
    contact: {
      phone: '(11) 99999-9999',
      email: 'contato@barbearia.com',
      address: 'Rua das Flores, 123 - Centro',
      whatsapp: '11999999999',
      instagram: '@barbeariapremium'
    },
    theme: {
      primaryColor: '#8B4513',
      secondaryColor: '#DAA520',
      fontFamily: 'Roboto'
    },
    gallery: [
      'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Foto+1',
      'https://via.placeholder.com/300x200/DAA520/FFFFFF?text=Foto+2'
    ]
  },
  published: false
});

export default function EditSitePage({ params }: PageProps) {
  const [siteData, setSiteData] = useState(getMockSiteData(params.id));
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simula salvamento
    setTimeout(() => {
      setSaving(false);
      alert(`Site ${params.id} salvo com sucesso! (Simulação)`);
    }, 1000);
  };

  const handlePublish = () => {
    setSiteData(prev => ({ ...prev, published: !prev.published }));
    alert(`Site ${siteData.published ? 'despublicado' : 'publicado'} com sucesso! (Simulação)`);
  };

  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      name: 'Novo Serviço',
      price: 0,
      duration: '30min'
    };
    setSiteData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        services: [...prev.customization.services, newService]
      }
    }));
  };

  const removeService = (serviceId: string) => {
    setSiteData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        services: prev.customization.services.filter(s => s.id !== serviceId)
      }
    }));
  };

  const updateService = (serviceId: string, field: string, value: any) => {
    setSiteData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        services: prev.customization.services.map(service =>
          service.id === serviceId ? { ...service, [field]: value } : service
        )
      }
    }));
  };

  const tabs = [
    { id: 'hero', label: 'Principal', icon: '🏠' },
    { id: 'about', label: 'Sobre', icon: 'ℹ️' },
    { id: 'services', label: 'Serviços', icon: '⚡' },
    { id: 'contact', label: 'Contato', icon: '📞' },
    { id: 'theme', label: 'Tema', icon: '🎨' },
    { id: 'gallery', label: 'Galeria', icon: '🖼️' }
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
              Editando: {siteData.title} (ID: {params.id})
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => window.location.href = '/sites'}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f0f0f0',
                border: '1px solid #ccc',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Voltar
            </button>
            <button 
              onClick={handlePublish}
              style={{
                padding: '10px 20px',
                backgroundColor: siteData.published ? '#ffc107' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {siteData.published ? '📤 Despublicar' : '📢 Publicar'}
            </button>
            <button 
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? '💾 Salvando...' : '💾 Salvar'}
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
                    value={siteData.customization.hero.title}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      customization: {
                        ...prev.customization,
                        hero: { ...prev.customization.hero, title: e.target.value }
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Subtítulo:
                  </label>
                  <textarea
                    value={siteData.customization.hero.subtitle}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      customization: {
                        ...prev.customization,
                        hero: { ...prev.customization.hero, subtitle: e.target.value }
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '100px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none'
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
                    value={siteData.customization.about.title}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      customization: {
                        ...prev.customization,
                        about: { ...prev.customization.about, title: e.target.value }
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Conteúdo:
                  </label>
                  <textarea
                    value={siteData.customization.about.content}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      customization: {
                        ...prev.customization,
                        about: { ...prev.customization.about, content: e.target.value }
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '150px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚡ Serviços
                </h2>
                <button
                  onClick={addService}
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
                {siteData.customization.services.map((service) => (
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
                          onChange={(e) => updateService(service.id, 'name', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Preço (R$):</label>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => updateService(service.id, 'price', Number(e.target.value))}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>Duração:</label>
                        <input
                          type="text"
                          value={service.duration}
                          onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            outline: 'none'
                          }}
                        />
                      </div>
                      <button
                        onClick={() => removeService(service.id)}
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
                    value={siteData.customization.contact.phone}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      customization: {
                        ...prev.customization,
                        contact: { ...prev.customization.contact, phone: e.target.value }
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Email:</label>
                  <input
                    type="email"
                    value={siteData.customization.contact.email}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      customization: {
                        ...prev.customization,
                        contact: { ...prev.customization.contact, email: e.target.value }
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Endereço:</label>
                  <input
                    type="text"
                    value={siteData.customization.contact.address}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      customization: {
                        ...prev.customization,
                        contact: { ...prev.customization.contact, address: e.target.value }
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>WhatsApp:</label>
                  <input
                    type="text"
                    value={siteData.customization.contact.whatsapp}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      customization: {
                        ...prev.customization,
                        contact: { ...prev.customization.contact, whatsapp: e.target.value }
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Instagram:</label>
                  <input
                    type="text"
                    value={siteData.customization.contact.instagram}
                    onChange={(e) => setSiteData(prev => ({
                      ...prev,
                      customization: {
                        ...prev.customization,
                        contact: { ...prev.customization.contact, instagram: e.target.value }
                      }
                    }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none'
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
                      value={siteData.customization.theme.primaryColor}
                      onChange={(e) => setSiteData(prev => ({
                        ...prev,
                        customization: {
                          ...prev.customization,
                          theme: { ...prev.customization.theme, primaryColor: e.target.value }
                        }
                      }))}
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
                      value={siteData.customization.theme.primaryColor}
                      onChange={(e) => setSiteData(prev => ({
                        ...prev,
                        customization: {
                          ...prev.customization,
                          theme: { ...prev.customization.theme, primaryColor: e.target.value }
                        }
                      }))}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Cor Secundária:</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={siteData.customization.theme.secondaryColor}
                      onChange={(e) => setSiteData(prev => ({
                        ...prev,
                        customization: {
                          ...prev.customization,
                          theme: { ...prev.customization.theme, secondaryColor: e.target.value }
                        }
                      }))}
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
                      value={siteData.customization.theme.secondaryColor}
                      onChange={(e) => setSiteData(prev => ({
                        ...prev,
                        customization: {
                          ...prev.customization,
                          theme: { ...prev.customization.theme, secondaryColor: e.target.value }
                        }
                      }))}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
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
                    backgroundColor: siteData.customization.theme.primaryColor,
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Cor Primária</h4>
                    <div style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      backgroundColor: siteData.customization.theme.secondaryColor,
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

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🖼️ Galeria de Imagens
              </h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Funcionalidade de upload de imagens será implementada em breve.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {siteData.customization.gallery.map((imageUrl, index) => (
                  <div key={index} style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <img 
                      src={imageUrl} 
                      alt={`Galeria ${index + 1}`}
                      style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                    />
                    <div style={{ padding: '10px', textAlign: 'center' }}>
                      <button style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}>
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '40px',
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                  cursor: 'pointer'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
                  <p style={{ margin: 0, color: '#666' }}>Clique para adicionar imagem</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
