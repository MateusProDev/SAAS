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
                  <textarea
                    value={siteData.portfolioData.skills.technical.join(', ')}
                    onChange={(e) => {
                      const newSkills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                      updateSkills({ technical: newSkills });
                    }}
                    placeholder="JavaScript, React, Node.js, Python..."
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
                      color: '#333',
                      marginBottom: '15px'
                    }}
                  />
                  
                  <h3 style={{ color: '#333', marginBottom: '15px' }}>Ferramentas:</h3>
                  <textarea
                    value={siteData.portfolioData.skills.tools.join(', ')}
                    onChange={(e) => {
                      const newSkills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                      updateSkills({ tools: newSkills });
                    }}
                    placeholder="Git, Docker, VS Code, Figma..."
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
                      color: '#333',
                      marginBottom: '15px'
                    }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <h3 style={{ color: '#333', marginBottom: '15px' }}>Idiomas:</h3>
                      <textarea
                        value={siteData.portfolioData.skills.languages.join(', ')}
                        onChange={(e) => {
                          const newSkills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                          updateSkills({ languages: newSkills });
                        }}
                        placeholder="Português, Inglês..."
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
                      <h3 style={{ color: '#333', marginBottom: '15px' }}>Habilidades Interpessoais:</h3>
                      <textarea
                        value={siteData.portfolioData.skills.soft.join(', ')}
                        onChange={(e) => {
                          const newSkills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                          updateSkills({ soft: newSkills });
                        }}
                        placeholder="Comunicação, Liderança, Trabalho em equipe..."
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
                        Tecnologias (separadas por vírgula):
                      </label>
                      <input
                        type="text"
                        value={project.technologies.join(', ')}
                        onChange={(e) => updateProject(project.id, { 
                          technologies: e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech)
                        })}
                        placeholder="React, Node.js, MongoDB..."
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                      <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            style={{
                              padding: '4px 12px',
                              backgroundColor: '#667eea',
                              color: 'white',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
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
