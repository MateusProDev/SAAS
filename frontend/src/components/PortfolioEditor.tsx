"use client";

import React, { useState } from 'react';
import { usePortfolioData, PortfolioData } from '../hooks/usePortfolioData';
import { useFirebaseAuthUser } from '../hooks/useFirebaseAuthUser';
import styles from './PortfolioEditor.module.css';

interface PortfolioEditorProps {
  siteId: string;
}

export default function PortfolioEditor({ siteId }: PortfolioEditorProps) {
  const { user } = useFirebaseAuthUser();
  const { 
    data, 
    loading, 
    error, 
    savePortfolioData, 
    updateSection,
    addProject,
    updateProject,
    removeProject,
    addExperience,
    updateExperience,
    removeExperience,
    publishPortfolio 
  } = usePortfolioData(user?.uid || '', siteId);

  const [activeTab, setActiveTab] = useState<'personal' | 'about' | 'skills' | 'projects' | 'experience' | 'theme'>('personal');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Carregando editor do portfólio...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.error}>
        <h2>Erro ao carregar editor</h2>
        <p>{error || 'Dados não encontrados'}</p>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    const success = await savePortfolioData(data);
    if (success) {
      alert('Dados salvos com sucesso!');
    } else {
      alert('Erro ao salvar dados');
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    const success = await publishPortfolio();
    if (success) {
      alert('Portfólio publicado com sucesso!');
    } else {
      alert('Erro ao publicar portfólio');
    }
    setPublishing(false);
  };

  const updatePersonalInfo = (field: keyof PortfolioData['personalInfo'], value: string) => {
    const updatedData = {
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    };
    savePortfolioData(updatedData);
  };

  const updateAbout = (field: keyof PortfolioData['about'], value: string) => {
    const updatedData = {
      ...data,
      about: {
        ...data.about,
        [field]: value,
      },
    };
    savePortfolioData(updatedData);
  };

  const updateSkills = (category: keyof PortfolioData['skills'], skills: string[]) => {
    const updatedData = {
      ...data,
      skills: {
        ...data.skills,
        [category]: skills,
      },
    };
    savePortfolioData(updatedData);
  };

  const updateTheme = (field: keyof PortfolioData['theme'], value: PortfolioData['theme'][keyof PortfolioData['theme']]) => {
    const updatedData = {
      ...data,
      theme: {
        ...data.theme,
        [field]: value,
      },
    };
    savePortfolioData(updatedData);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Editor de Portfólio</h1>
        <div className={styles.actions}>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className={styles.saveButton}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button 
            onClick={handlePublish} 
            disabled={publishing}
            className={styles.publishButton}
          >
            {publishing ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </header>

      <div className={styles.editorContainer}>
        <nav className={styles.sidebar}>
          <button 
            className={activeTab === 'personal' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('personal')}
          >
            📝 Informações Pessoais
          </button>
          <button 
            className={activeTab === 'about' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('about')}
          >
            👋 Sobre Mim
          </button>
          <button 
            className={activeTab === 'skills' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('skills')}
          >
            🚀 Habilidades
          </button>
          <button 
            className={activeTab === 'projects' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('projects')}
          >
            💼 Projetos
          </button>
          <button 
            className={activeTab === 'experience' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('experience')}
          >
            🏢 Experiência
          </button>
          <button 
            className={activeTab === 'theme' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('theme')}
          >
            🎨 Tema & Estilo
          </button>
        </nav>

        <main className={styles.content}>
          {activeTab === 'personal' && (
            <div className={styles.section}>
              <h2>Informações Pessoais</h2>
              
              <div className={styles.field}>
                <label>Nome Completo</label>
                <input
                  type="text"
                  value={data.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>

              <div className={styles.field}>
                <label>Título Profissional</label>
                <input
                  type="text"
                  value={data.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  placeholder="Ex: Desenvolvedor Full Stack"
                />
              </div>

              <div className={styles.field}>
                <label>Subtítulo/Slogan</label>
                <input
                  type="text"
                  value={data.personalInfo.subtitle}
                  onChange={(e) => updatePersonalInfo('subtitle', e.target.value)}
                  placeholder="Ex: Transformando ideias em soluções digitais"
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={data.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>

                <div className={styles.field}>
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={data.personalInfo.phone || ''}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Localização</label>
                <input
                  type="text"
                  value={data.personalInfo.location}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  placeholder="São Paulo, Brasil"
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    value={data.personalInfo.linkedin || ''}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/seuperfil"
                  />
                </div>

                <div className={styles.field}>
                  <label>GitHub</label>
                  <input
                    type="url"
                    value={data.personalInfo.github || ''}
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    placeholder="https://github.com/seuperfil"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className={styles.section}>
              <h2>Sobre Mim</h2>
              
              <div className={styles.field}>
                <label>Descrição Pessoal</label>
                <textarea
                  value={data.about.description}
                  onChange={(e) => updateAbout('description', e.target.value)}
                  placeholder="Conte sobre você, sua experiência e paixões..."
                  rows={6}
                />
              </div>

              <div className={styles.field}>
                <label>Missão (Opcional)</label>
                <textarea
                  value={data.about.mission || ''}
                  onChange={(e) => updateAbout('mission', e.target.value)}
                  placeholder="Qual é sua missão profissional?"
                  rows={3}
                />
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className={styles.section}>
              <h2>Habilidades</h2>
              
              <div className={styles.field}>
                <label>Habilidades Técnicas</label>
                <div className={styles.skillsInput}>
                  <input
                    type="text"
                    placeholder="Digite uma habilidade e pressione Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const newSkill = input.value.trim();
                        if (newSkill && !data.skills.technical.includes(newSkill)) {
                          updateSkills('technical', [...data.skills.technical, newSkill]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <div className={styles.skillsTags}>
                    {data.skills.technical.map((skill: string, index: number) => (
                      <span key={index} className={styles.skillTag}>
                        {skill}
                        <button
                          onClick={() => {
                            const updatedSkills = data.skills.technical.filter((_: string, i: number) => i !== index);
                            updateSkills('technical', updatedSkills);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label>Ferramentas</label>
                <div className={styles.skillsInput}>
                  <input
                    type="text"
                    placeholder="Digite uma ferramenta e pressione Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const newTool = input.value.trim();
                        if (newTool && !data.skills.tools.includes(newTool)) {
                          updateSkills('tools', [...data.skills.tools, newTool]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <div className={styles.skillsTags}>
                    {data.skills.tools.map((tool: string, index: number) => (
                      <span key={index} className={styles.skillTag}>
                        {tool}
                        <button
                          onClick={() => {
                            const updatedTools = data.skills.tools.filter((_: string, i: number) => i !== index);
                            updateSkills('tools', updatedTools);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label>Idiomas</label>
                <div className={styles.skillsInput}>
                  <input
                    type="text"
                    placeholder="Digite um idioma e pressione Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const newLanguage = input.value.trim();
                        if (newLanguage && !data.skills.languages.includes(newLanguage)) {
                          updateSkills('languages', [...data.skills.languages, newLanguage]);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <div className={styles.skillsTags}>
                    {data.skills.languages.map((language: string, index: number) => (
                      <span key={index} className={styles.skillTag}>
                        {language}
                        <button
                          onClick={() => {
                            const updatedLanguages = data.skills.languages.filter((_: string, i: number) => i !== index);
                            updateSkills('languages', updatedLanguages);
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Projetos</h2>
                <button
                  onClick={() => {
                    addProject({
                      title: 'Novo Projeto',
                      description: 'Descrição do projeto',
                      technologies: [],
                      featured: false,
                      category: 'Web',
                      status: 'completed',
                    });
                  }}
                  className={styles.addButton}
                >
                  + Adicionar Projeto
                </button>
              </div>

              <div className={styles.projectsList}>
                {data.projects.map((project: PortfolioData['projects'][0]) => (
                  <div key={project.id} className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(project.id, { title: e.target.value })}
                        className={styles.projectTitle}
                      />
                      <button
                        onClick={() => removeProject(project.id)}
                        className={styles.deleteButton}
                      >
                        🗑️
                      </button>
                    </div>

                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(project.id, { description: e.target.value })}
                      placeholder="Descrição do projeto"
                      rows={3}
                    />

                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label>URL do Projeto</label>
                        <input
                          type="url"
                          value={project.liveUrl || ''}
                          onChange={(e) => updateProject(project.id, { liveUrl: e.target.value })}
                          placeholder="https://projeto.com"
                        />
                      </div>

                      <div className={styles.field}>
                        <label>GitHub</label>
                        <input
                          type="url"
                          value={project.githubUrl || ''}
                          onChange={(e) => updateProject(project.id, { githubUrl: e.target.value })}
                          placeholder="https://github.com/projeto"
                        />
                      </div>
                    </div>

                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label>Categoria</label>
                        <select
                          className={styles.select}
                          value={project.category}
                          onChange={(e) => updateProject(project.id, { category: e.target.value })}
                        >
                          <option value="Web">Web</option>
                          <option value="Mobile">Mobile</option>
                          <option value="Desktop">Desktop</option>
                          <option value="API">API</option>
                          <option value="Other">Outro</option>
                        </select>
                      </div>

                      <div className={styles.field}>
                        <label>Status</label>
                        <select
                          className={styles.select}
                          value={project.status}
                          onChange={(e) => updateProject(project.id, { status: e.target.value as any })}
                        >
                          <option value="completed">Concluído</option>
                          <option value="in-progress">Em andamento</option>
                          <option value="planned">Planejado</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.checkboxField}>
                      <label>
                        <input
                          type="checkbox"
                          checked={project.featured}
                          onChange={(e) => updateProject(project.id, { featured: e.target.checked })}
                        />
                        Projeto em destaque
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className={styles.section}>
              <h2>Tema & Estilo</h2>
              
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Cor Primária</label>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={data.theme.primaryColor}
                    onChange={(e) => updateTheme('primaryColor', e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Cor Secundária</label>
                  <input
                    type="color"
                    className={styles.colorInput}
                    value={data.theme.secondaryColor}
                    onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label>Layout</label>
                <select
                  className={styles.select}
                  value={data.theme.layout}
                  onChange={(e) => updateTheme('layout', e.target.value)}
                >
                  <option value="modern">Moderno</option>
                  <option value="classic">Clássico</option>
                  <option value="minimal">Minimalista</option>
                  <option value="creative">Criativo</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>Fonte</label>
                <select
                  className={styles.select}
                  value={data.theme.fontFamily}
                  onChange={(e) => updateTheme('fontFamily', e.target.value)}
                >
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Roboto, sans-serif">Roboto</option>
                  <option value="Poppins, sans-serif">Poppins</option>
                  <option value="Playfair Display, serif">Playfair Display</option>
                </select>
              </div>

              <h3>Seções Visíveis</h3>
              {Object.entries(data.theme.showSections).map(([section, visible]) => (
                <div key={section} className={styles.checkboxField}>
                  <label>
                    <input
                      type="checkbox"
                      checked={visible as boolean}
                      onChange={(e) => {
                        const updatedSections = {
                          ...data.theme.showSections,
                          [section]: e.target.checked,
                        };
                        updateTheme('showSections', updatedSections);
                      }}
                    />
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
