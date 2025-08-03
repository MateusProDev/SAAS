'use client';

import React, { useState } from 'react';
import { useFirebaseAuthUser } from '../../../../src/hooks/useFirebaseAuthUser';
import { usePortfolioEditor, PortfolioCustomization } from '../../../../src/hooks/usePortfolioEditor';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditPortfolioPage({ params }: PageProps) {
  const { user } = useFirebaseAuthUser();
  const {
    data: siteData,
    loading,
    error,
    saving,
    togglePublish,
    updatePersonalInfo,
    updateAbout,
    updateSkills,
    updateTheme,
    updateSettings,
    addProject,
    updateProject,
    removeProject,
    addExperience,
    updateExperience,
    removeExperience,
    addService,
    updateService,
    removeService,
    updateTestimonials,
    updateEducation,
    updateCertifications,
  } = usePortfolioEditor(user?.uid || '', params.id);

  const [activeTab, setActiveTab] = useState('personal');

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
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Carregando editor do portfólio...</p>
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
          <h2>Erro ao carregar editor</h2>
          <p>{error || 'Dados não encontrados'}</p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{ 
              color: '#667eea', 
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
      alert(`Portfólio ${siteData.published ? 'despublicado' : 'publicado'} com sucesso!`);
    } else {
      alert('Erro ao alterar status de publicação');
    }
  };

  const tabs = [
    { id: 'personal', label: 'Informações Pessoais', icon: '👤' },
    { id: 'about', label: 'Sobre', icon: 'ℹ️' },
    { id: 'projects', label: 'Projetos', icon: '💼' },
    { id: 'experience', label: 'Experiência', icon: '👨‍💼' },
    { id: 'services', label: 'Serviços', icon: '🛠️' },
    { id: 'testimonials', label: 'Depoimentos', icon: '💬' },
    { id: 'education', label: 'Educação', icon: '🎓' },
    { id: 'certifications', label: 'Certificações', icon: '🏆' },
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
            <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Editor de Portfólio</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Editando: {siteData.title} (ID: {params.id})
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
                backgroundColor: '#667eea',
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
              onClick={() => window.open(`/sites/${params.id}`, '_blank')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#764ba2',
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
                backgroundColor: siteData.published ? '#ffc107' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? '⏳ Salvando...' : (siteData.published ? '📤 Despublicar' : '📢 Publicar')}
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
                  backgroundColor: activeTab === tab.id ? '#667eea' : 'transparent',
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
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                👤 Informações Pessoais
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Nome Completo:
                  </label>
                  <input
                    type="text"
                    value={siteData.portfolioData.personalInfo.name}
                    onChange={(e) => updatePersonalInfo({ name: e.target.value })}
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
                    Título Profissional:
                  </label>
                  <input
                    type="text"
                    value={siteData.portfolioData.personalInfo.title}
                    onChange={(e) => updatePersonalInfo({ title: e.target.value })}
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
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Subtítulo:
                  </label>
                  <textarea
                    value={siteData.portfolioData.personalInfo.subtitle}
                    onChange={(e) => updatePersonalInfo({ subtitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '80px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
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
                    value={siteData.portfolioData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo({ email: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Telefone:</label>
                  <input
                    type="text"
                    value={siteData.portfolioData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Endereço/Localização:
                  </label>
                  <input
                    type="text"
                    value={siteData.portfolioData.personalInfo.location || ''}
                    onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                    placeholder="Cidade, Estado, País"
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>LinkedIn:</label>
                  <input
                    type="url"
                    value={siteData.portfolioData.personalInfo.linkedin || ''}
                    onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/seuperfil"
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>GitHub:</label>
                  <input
                    type="url"
                    value={siteData.portfolioData.personalInfo.github || ''}
                    onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                    placeholder="https://github.com/seuperfil"
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>Website Pessoal:</label>
                  <input
                    type="url"
                    value={siteData.portfolioData.personalInfo.website || ''}
                    onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                    placeholder="https://meusite.com"
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

          {/* About Tab */}
          {activeTab === 'about' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ℹ️ Sobre Você
              </h2>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                  Descrição Pessoal:
                </label>
                <textarea
                  value={siteData.portfolioData.about.description}
                  onChange={(e) => updateAbout({ description: e.target.value })}
                  placeholder="Conte um pouco sobre você, sua experiência e seus objetivos profissionais..."
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '16px',
                    minHeight: '200px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    outline: 'none',
                    backgroundColor: '#fff',
                    color: '#333',
                    lineHeight: '1.6'
                  }}
                />
                
                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ color: '#333', marginBottom: '15px' }}>Habilidades Técnicas:</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="text"
                      id="tech-skills-input"
                      placeholder="Digite uma habilidade técnica e pressione Enter..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const newSkill = input.value.trim();
                          if (newSkill && !siteData.portfolioData.skills.technical.includes(newSkill)) {
                            const newSkills = [...siteData.portfolioData.skills.technical, newSkill];
                            updateSkills({ technical: newSkills });
                            input.value = '';
                          }
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#fff',
                        color: '#333'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('tech-skills-input') as HTMLInputElement;
                        if (input) {
                          const newSkill = input.value.trim();
                          if (newSkill && !siteData.portfolioData.skills.technical.includes(newSkill)) {
                            const newSkills = [...siteData.portfolioData.skills.technical, newSkill];
                            updateSkills({ technical: newSkills });
                            input.value = '';
                          }
                        }
                      }}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      + Adicionar
                    </button>
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    fontStyle: 'italic',
                    marginBottom: '10px'
                  }}>
                    💡 Digite uma habilidade e pressione Enter ou clique em "Adicionar"
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {siteData.portfolioData.skills.technical.map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#667eea',
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          const newSkills = siteData.portfolioData.skills.technical.filter((_, i) => i !== index);
                          updateSkills({ technical: newSkills });
                        }}
                        title="Clique para remover"
                      >
                        {skill}
                        <span style={{ fontSize: '14px', opacity: 0.8 }}>×</span>
                      </span>
                    ))}
                  </div>
                  
                  <h3 style={{ color: '#333', marginBottom: '15px' }}>Ferramentas:</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="text"
                      id="tools-input"
                      placeholder="Digite uma ferramenta e pressione Enter..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const newTool = input.value.trim();
                          if (newTool && !siteData.portfolioData.skills.tools.includes(newTool)) {
                            const newTools = [...siteData.portfolioData.skills.tools, newTool];
                            updateSkills({ tools: newTools });
                            input.value = '';
                          }
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#fff',
                        color: '#333'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('tools-input') as HTMLInputElement;
                        if (input) {
                          const newTool = input.value.trim();
                          if (newTool && !siteData.portfolioData.skills.tools.includes(newTool)) {
                            const newTools = [...siteData.portfolioData.skills.tools, newTool];
                            updateSkills({ tools: newTools });
                            input.value = '';
                          }
                        }
                      }}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      + Adicionar
                    </button>
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666',
                    fontStyle: 'italic',
                    marginBottom: '10px'
                  }}>
                    💡 Digite uma ferramenta e pressione Enter ou clique em "Adicionar"
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {siteData.portfolioData.skills.tools.map((tool, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          const newTools = siteData.portfolioData.skills.tools.filter((_, i) => i !== index);
                          updateSkills({ tools: newTools });
                        }}
                        title="Clique para remover"
                      >
                        {tool}
                        <span style={{ fontSize: '14px', opacity: 0.8 }}>×</span>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h3 style={{ color: '#333', marginBottom: '15px' }}>Idiomas:</h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          type="text"
                          id="languages-input"
                          placeholder="Digite um idioma e pressione Enter..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const newLanguage = input.value.trim();
                              if (newLanguage && !siteData.portfolioData.skills.languages.includes(newLanguage)) {
                                const newLanguages = [...siteData.portfolioData.skills.languages, newLanguage];
                                updateSkills({ languages: newLanguages });
                                input.value = '';
                              }
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '8px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '6px',
                            fontSize: '12px',
                            outline: 'none',
                            backgroundColor: '#fff',
                            color: '#333'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('languages-input') as HTMLInputElement;
                            if (input) {
                              const newLanguage = input.value.trim();
                              if (newLanguage && !siteData.portfolioData.skills.languages.includes(newLanguage)) {
                                const newLanguages = [...siteData.portfolioData.skills.languages, newLanguage];
                                updateSkills({ languages: newLanguages });
                                input.value = '';
                              }
                            }
                          }}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#ffc107',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {siteData.portfolioData.skills.languages.map((language, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#ffc107',
                              color: 'white',
                              borderRadius: '15px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              const newLanguages = siteData.portfolioData.skills.languages.filter((_, i) => i !== index);
                              updateSkills({ languages: newLanguages });
                            }}
                            title="Clique para remover"
                          >
                            {language}
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>×</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 style={{ color: '#333', marginBottom: '15px' }}>Habilidades Interpessoais:</h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          type="text"
                          id="soft-skills-input"
                          placeholder="Digite uma soft skill e pressione Enter..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const newSoftSkill = input.value.trim();
                              if (newSoftSkill && !siteData.portfolioData.skills.soft.includes(newSoftSkill)) {
                                const newSoftSkills = [...siteData.portfolioData.skills.soft, newSoftSkill];
                                updateSkills({ soft: newSoftSkills });
                                input.value = '';
                              }
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '8px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '6px',
                            fontSize: '12px',
                            outline: 'none',
                            backgroundColor: '#fff',
                            color: '#333'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('soft-skills-input') as HTMLInputElement;
                            if (input) {
                              const newSoftSkill = input.value.trim();
                              if (newSoftSkill && !siteData.portfolioData.skills.soft.includes(newSoftSkill)) {
                                const newSoftSkills = [...siteData.portfolioData.skills.soft, newSoftSkill];
                                updateSkills({ soft: newSoftSkills });
                                input.value = '';
                              }
                            }
                          }}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {siteData.portfolioData.skills.soft.map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#17a2b8',
                              color: 'white',
                              borderRadius: '15px',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              const newSoftSkills = siteData.portfolioData.skills.soft.filter((_, i) => i !== index);
                              updateSkills({ soft: newSoftSkills });
                            }}
                            title="Clique para remover"
                          >
                            {skill}
                            <span style={{ fontSize: '12px', opacity: 0.8 }}>×</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ color: '#333', marginBottom: '10px' }}>Preview das Habilidades:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {[...siteData.portfolioData.skills.technical, ...siteData.portfolioData.skills.tools].slice(0, 10).map((skill, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#667eea',
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💼 Projetos
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => addProject({
                    title: 'Novo Projeto',
                    description: 'Descrição do projeto...',
                    category: 'web',
                    imageUrl: '',
                    projectUrl: '',
                    githubUrl: '',
                    technologies: ['HTML', 'CSS', 'JavaScript'],
                    featured: false
                  })}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Projeto
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {siteData.portfolioData.projects.map((project, index) => (
                  <div key={project.id} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Projeto #{index + 1}</h3>
                      <button
                        onClick={() => removeProject(project.id)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Título:
                        </label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => updateProject(project.id, { title: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Link do Projeto:
                        </label>
                        <input
                          type="url"
                          value={project.projectUrl || ''}
                          onChange={(e) => updateProject(project.id, { projectUrl: e.target.value })}
                          placeholder="https://..."
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

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                        Descrição:
                      </label>
                      <textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, { description: e.target.value })}
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

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                        Tecnologias:
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                          type="text"
                          id={`tech-input-${project.id}`}
                          placeholder="Digite uma tecnologia e pressione Enter..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const newTech = input.value.trim();
                              if (newTech && !project.technologies.includes(newTech)) {
                                updateProject(project.id, { 
                                  technologies: [...project.technologies, newTech] 
                                });
                                input.value = '';
                              }
                            }
                          }}
                          style={{
                            flex: 1,
                            padding: '12px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: '#fff',
                            color: '#333'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById(`tech-input-${project.id}`) as HTMLInputElement;
                            if (input) {
                              const newTech = input.value.trim();
                              if (newTech && !project.technologies.includes(newTech)) {
                                updateProject(project.id, { 
                                  technologies: [...project.technologies, newTech] 
                                });
                                input.value = '';
                              }
                            }
                          }}
                          style={{
                            padding: '12px 16px',
                            backgroundColor: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          + Adicionar
                        </button>
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#666',
                        fontStyle: 'italic',
                        marginBottom: '10px'
                      }}>
                        💡 Digite uma tecnologia e pressione Enter ou clique em "Adicionar"
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#667eea',
                              color: 'white',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              // Permitir remover clicando na tag
                              const newTechs = project.technologies.filter((_, i) => i !== techIndex);
                              updateProject(project.id, { technologies: newTechs });
                            }}
                            title="Clique para remover"
                          >
                            {tech}
                            <span style={{ fontSize: '14px', opacity: 0.8 }}>×</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                👨‍💼 Experiência Profissional
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => addExperience({
                    title: 'Novo Cargo',
                    company: 'Nome da Empresa',
                    period: '2024 - Presente',
                    description: 'Descrição das responsabilidades e conquistas...',
                    current: true
                  })}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Experiência
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {siteData.portfolioData.experience.map((exp, index) => (
                  <div key={exp.id || index} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Experiência #{index + 1}</h3>
                      <button
                        onClick={() => removeExperience(exp.id || `exp-${index}`)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Cargo:
                        </label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id || `exp-${index}`, { title: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Empresa:
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id || `exp-${index}`, { company: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Período:
                        </label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => updateExperience(exp.id || `exp-${index}`, { period: e.target.value })}
                          placeholder="Ex: 2023 - Presente"
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Localização:
                        </label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(exp.id || `exp-${index}`, { location: e.target.value })}
                          placeholder="Ex: São Paulo, SP"
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

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                        Descrição:
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id || `exp-${index}`, { description: e.target.value })}
                        placeholder="Descreva suas responsabilidades, conquistas e impacto..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          minHeight: '120px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={exp.current || false}
                          onChange={(e) => updateExperience(exp.id || `exp-${index}`, { current: e.target.checked })}
                          style={{ transform: 'scale(1.2)' }}
                        />
                        <span style={{ fontWeight: 'bold', color: '#555' }}>Trabalho atual</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🛠️ Serviços
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => addService({
                    name: 'Novo Serviço',
                    description: 'Descrição do serviço oferecido...',
                    price: 'A partir de R$ 1.000',
                    icon: '💻'
                  })}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Serviço
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {siteData.portfolioData.services.map((service, index) => (
                  <div key={service.id || index} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Serviço #{index + 1}</h3>
                      <button
                        onClick={() => removeService(service.id || `service-${index}`)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Nome do Serviço:
                        </label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(service.id || `service-${index}`, { name: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Preço:
                        </label>
                        <input
                          type="text"
                          value={service.price || ''}
                          onChange={(e) => updateService(service.id || `service-${index}`, { price: e.target.value })}
                          placeholder="Ex: A partir de R$ 1.000"
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Ícone:
                        </label>
                        <input
                          type="text"
                          value={service.icon || '💻'}
                          onChange={(e) => updateService(service.id || `service-${index}`, { icon: e.target.value })}
                          placeholder="Ex: 💻 🎨 📱"
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

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                        Descrição:
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id || `service-${index}`, { description: e.target.value })}
                        placeholder="Descreva o serviço em detalhes..."
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
                ))}
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💬 Depoimentos
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => {
                    const newTestimonials = [...(siteData.portfolioData.testimonials || []), {
                      id: Date.now().toString(),
                      name: 'Nome do Cliente',
                      content: 'Depoimento sobre o trabalho realizado...',
                      rating: 5,
                      position: 'CEO',
                      company: 'Empresa do Cliente',
                      imageUrl: ''
                    }];
                    updateTestimonials(newTestimonials);
                  }}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Depoimento
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {(siteData.portfolioData.testimonials || []).map((testimonial, index) => (
                  <div key={testimonial.id || index} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Depoimento #{index + 1}</h3>
                      <button
                        onClick={() => {
                          const newTestimonials = siteData.portfolioData.testimonials.filter((_, i) => i !== index);
                          updateTestimonials(newTestimonials);
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Nome do Cliente:
                        </label>
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => {
                            const newTestimonials = [...siteData.portfolioData.testimonials];
                            newTestimonials[index] = { ...testimonial, name: e.target.value };
                            updateTestimonials(newTestimonials);
                          }}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Cargo/Posição:
                        </label>
                        <input
                          type="text"
                          value={testimonial.position || ''}
                          onChange={(e) => {
                            const newTestimonials = [...siteData.portfolioData.testimonials];
                            newTestimonials[index] = { ...testimonial, position: e.target.value };
                            updateTestimonials(newTestimonials);
                          }}
                          placeholder="Ex: CEO, Diretor, etc."
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Empresa:
                        </label>
                        <input
                          type="text"
                          value={testimonial.company || ''}
                          onChange={(e) => {
                            const newTestimonials = [...siteData.portfolioData.testimonials];
                            newTestimonials[index] = { ...testimonial, company: e.target.value };
                            updateTestimonials(newTestimonials);
                          }}
                          placeholder="Nome da empresa"
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Avaliação (1-5):
                        </label>
                        <select
                          value={testimonial.rating}
                          onChange={(e) => {
                            const newTestimonials = [...siteData.portfolioData.testimonials];
                            newTestimonials[index] = { ...testimonial, rating: parseInt(e.target.value) };
                            updateTestimonials(newTestimonials);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5 estrelas)</option>
                          <option value={4}>⭐⭐⭐⭐ (4 estrelas)</option>
                          <option value={3}>⭐⭐⭐ (3 estrelas)</option>
                          <option value={2}>⭐⭐ (2 estrelas)</option>
                          <option value={1}>⭐ (1 estrela)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                        Depoimento:
                      </label>
                      <textarea
                        value={testimonial.content}
                        onChange={(e) => {
                          const newTestimonials = [...siteData.portfolioData.testimonials];
                          newTestimonials[index] = { ...testimonial, content: e.target.value };
                          updateTestimonials(newTestimonials);
                        }}
                        placeholder="O que o cliente disse sobre o trabalho..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          minHeight: '120px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎓 Educação
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => {
                    const newEducation = [...(siteData.portfolioData.education || []), {
                      id: Date.now().toString(),
                      institution: 'Nome da Instituição',
                      degree: 'Grau/Curso',
                      period: '2020 - 2024',
                      description: 'Descrição da formação...'
                    }];
                    updateEducation(newEducation);
                  }}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Formação
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {(siteData.portfolioData.education || []).map((edu, index) => (
                  <div key={edu.id || index} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Formação #{index + 1}</h3>
                      <button
                        onClick={() => {
                          const newEducation = siteData.portfolioData.education.filter((_, i) => i !== index);
                          updateEducation(newEducation);
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Instituição:
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const newEducation = [...siteData.portfolioData.education];
                            newEducation[index] = { ...edu, institution: e.target.value };
                            updateEducation(newEducation);
                          }}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Grau/Curso:
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEducation = [...siteData.portfolioData.education];
                            newEducation[index] = { ...edu, degree: e.target.value };
                            updateEducation(newEducation);
                          }}
                          placeholder="Ex: Bacharelado, Tecnólogo, Curso Técnico"
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Área de Estudo:
                        </label>
                        <input
                          type="text"
                          value={edu.field || ''}
                          onChange={(e) => {
                            const newEducation = [...siteData.portfolioData.education];
                            newEducation[index] = { ...edu, field: e.target.value };
                            updateEducation(newEducation);
                          }}
                          placeholder="Ex: Ciência da Computação, Design"
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Período:
                        </label>
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => {
                            const newEducation = [...siteData.portfolioData.education];
                            newEducation[index] = { ...edu, period: e.target.value };
                            updateEducation(newEducation);
                          }}
                          placeholder="Ex: 2020 - 2024"
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

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                        Descrição:
                      </label>
                      <textarea
                        value={edu.description || ''}
                        onChange={(e) => {
                          const newEducation = [...siteData.portfolioData.education];
                          newEducation[index] = { ...edu, description: e.target.value };
                          updateEducation(newEducation);
                        }}
                        placeholder="Descreva a formação, projetos importantes, notas relevantes..."
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
                ))}
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏆 Certificações
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => {
                    const newCertifications = [...(siteData.portfolioData.certifications || []), {
                      id: Date.now().toString(),
                      name: 'Nome da Certificação',
                      issuer: 'Organização Emissora',
                      date: '2024',
                      url: ''
                    }];
                    updateCertifications(newCertifications);
                  }}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Certificação
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {(siteData.portfolioData.certifications || []).map((cert, index) => (
                  <div key={cert.id || index} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Certificação #{index + 1}</h3>
                      <button
                        onClick={() => {
                          const newCertifications = siteData.portfolioData.certifications.filter((_, i) => i !== index);
                          updateCertifications(newCertifications);
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Nome da Certificação:
                        </label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const newCertifications = [...siteData.portfolioData.certifications];
                            newCertifications[index] = { ...cert, name: e.target.value };
                            updateCertifications(newCertifications);
                          }}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Organização:
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const newCertifications = [...siteData.portfolioData.certifications];
                            newCertifications[index] = { ...cert, issuer: e.target.value };
                            updateCertifications(newCertifications);
                          }}
                          placeholder="Ex: Google, Microsoft, AWS"
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Data:
                        </label>
                        <input
                          type="text"
                          value={cert.date}
                          onChange={(e) => {
                            const newCertifications = [...siteData.portfolioData.certifications];
                            newCertifications[index] = { ...cert, date: e.target.value };
                            updateCertifications(newCertifications);
                          }}
                          placeholder="Ex: 2024, Janeiro 2024"
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Link da Credencial:
                        </label>
                        <input
                          type="url"
                          value={cert.url || ''}
                          onChange={(e) => {
                            const newCertifications = [...siteData.portfolioData.certifications];
                            newCertifications[index] = { ...cert, url: e.target.value };
                            updateCertifications(newCertifications);
                          }}
                          placeholder="https://..."
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
                ))}
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                👨‍💼 Experiência Profissional
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => addExperience({
                    title: 'Novo Cargo',
                    company: 'Nome da Empresa',
                    period: '2024 - Presente',
                    description: 'Descrição das responsabilidades e conquistas...',
                    current: true
                  })}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Experiência
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {(siteData.portfolioData.experience || []).map((exp, index) => (
                  <div key={exp.id || index} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Experiência #{index + 1}</h3>
                      <button
                        onClick={() => removeExperience(exp.id || `exp-${index}`)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Cargo:
                        </label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id || `exp-${index}`, { title: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Empresa:
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id || `exp-${index}`, { company: e.target.value })}
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

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                        Descrição:
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id || `exp-${index}`, { description: e.target.value })}
                        placeholder="Descreva suas responsabilidades, conquistas e impacto..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          minHeight: '120px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🛠️ Serviços
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => addService({
                    name: 'Novo Serviço',
                    description: 'Descrição do serviço oferecido...',
                    price: 'A partir de R$ 1.000',
                    icon: '💻'
                  })}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Serviço
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {(siteData.portfolioData.services || []).map((service, index) => (
                  <div key={service.id || index} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Serviço #{index + 1}</h3>
                      <button
                        onClick={() => removeService(service.id || `service-${index}`)}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Nome do Serviço:
                        </label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => updateService(service.id || `service-${index}`, { name: e.target.value })}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Preço:
                        </label>
                        <input
                          type="text"
                          value={service.price || ''}
                          onChange={(e) => updateService(service.id || `service-${index}`, { price: e.target.value })}
                          placeholder="Ex: A partir de R$ 1.000"
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

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                        Descrição:
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) => updateService(service.id || `service-${index}`, { description: e.target.value })}
                        placeholder="Descreva o serviço em detalhes..."
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
                ))}
              </div>
            </div>
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💬 Depoimentos
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => {
                    const newTestimonials = [...(siteData.portfolioData.testimonials || []), {
                      id: Date.now().toString(),
                      name: 'Nome do Cliente',
                      content: 'Depoimento sobre o trabalho realizado...',
                      rating: 5,
                      position: 'CEO',
                      company: 'Empresa do Cliente'
                    }];
                    updateTestimonials(newTestimonials);
                  }}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Depoimento
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {(siteData.portfolioData.testimonials || []).map((testimonial, index) => (
                  <div key={testimonial.id || index} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Depoimento #{index + 1}</h3>
                      <button
                        onClick={() => {
                          const newTestimonials = siteData.portfolioData.testimonials.filter((_, i) => i !== index);
                          updateTestimonials(newTestimonials);
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Nome do Cliente:
                        </label>
                        <input
                          type="text"
                          value={testimonial.name}
                          onChange={(e) => {
                            const newTestimonials = [...siteData.portfolioData.testimonials];
                            newTestimonials[index] = { ...testimonial, name: e.target.value };
                            updateTestimonials(newTestimonials);
                          }}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Empresa:
                        </label>
                        <input
                          type="text"
                          value={testimonial.company || ''}
                          onChange={(e) => {
                            const newTestimonials = [...siteData.portfolioData.testimonials];
                            newTestimonials[index] = { ...testimonial, company: e.target.value };
                            updateTestimonials(newTestimonials);
                          }}
                          placeholder="Nome da empresa"
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

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                        Depoimento:
                      </label>
                      <textarea
                        value={testimonial.content}
                        onChange={(e) => {
                          const newTestimonials = [...siteData.portfolioData.testimonials];
                          newTestimonials[index] = { ...testimonial, content: e.target.value };
                          updateTestimonials(newTestimonials);
                        }}
                        placeholder="O que o cliente disse sobre o trabalho..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          minHeight: '120px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎓 Educação
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => {
                    const newEducation = [...(siteData.portfolioData.education || []), {
                      id: Date.now().toString(),
                      institution: 'Nome da Instituição',
                      degree: 'Grau/Curso',
                      period: '2020 - 2024',
                      description: 'Descrição da formação...'
                    }];
                    updateEducation(newEducation);
                  }}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Formação
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {(siteData.portfolioData.education || []).map((edu, index) => (
                  <div key={edu.id || index} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Formação #{index + 1}</h3>
                      <button
                        onClick={() => {
                          const newEducation = siteData.portfolioData.education.filter((_, i) => i !== index);
                          updateEducation(newEducation);
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Instituição:
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const newEducation = [...siteData.portfolioData.education];
                            newEducation[index] = { ...edu, institution: e.target.value };
                            updateEducation(newEducation);
                          }}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Grau/Curso:
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEducation = [...siteData.portfolioData.education];
                            newEducation[index] = { ...edu, degree: e.target.value };
                            updateEducation(newEducation);
                          }}
                          placeholder="Ex: Bacharelado, Tecnólogo"
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
                ))}
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div>
              <h2 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏆 Certificações
              </h2>
              
              <div style={{ marginBottom: '30px' }}>
                <button
                  onClick={() => {
                    const newCertifications = [...(siteData.portfolioData.certifications || []), {
                      id: Date.now().toString(),
                      name: 'Nome da Certificação',
                      issuer: 'Organização Emissora',
                      date: '2024'
                    }];
                    updateCertifications(newCertifications);
                  }}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ➕ Adicionar Certificação
                </button>
              </div>

              <div style={{ display: 'grid', gap: '30px' }}>
                {(siteData.portfolioData.certifications || []).map((cert, index) => (
                  <div key={cert.id || index} style={{
                    padding: '25px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Certificação #{index + 1}</h3>
                      <button
                        onClick={() => {
                          const newCertifications = siteData.portfolioData.certifications.filter((_, i) => i !== index);
                          updateCertifications(newCertifications);
                        }}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Nome da Certificação:
                        </label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const newCertifications = [...siteData.portfolioData.certifications];
                            newCertifications[index] = { ...cert, name: e.target.value };
                            updateCertifications(newCertifications);
                          }}
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
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                          Organização:
                        </label>
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const newCertifications = [...siteData.portfolioData.certifications];
                            newCertifications[index] = { ...cert, issuer: e.target.value };
                            updateCertifications(newCertifications);
                          }}
                          placeholder="Ex: Google, Microsoft"
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
                ))}
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
                      value={siteData.portfolioData.theme.primaryColor}
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
                      value={siteData.portfolioData.theme.primaryColor}
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
                      value={siteData.portfolioData.theme.secondaryColor}
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
                      value={siteData.portfolioData.theme.secondaryColor}
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
                    background: `linear-gradient(135deg, ${siteData.portfolioData.theme.primaryColor} 0%, ${siteData.portfolioData.theme.secondaryColor} 100%)`,
                    color: 'white',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Gradiente Portfolio</h4>
                    <div style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '4px',
                      color: 'white'
                    }}>
                      Exemplo de Card
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
