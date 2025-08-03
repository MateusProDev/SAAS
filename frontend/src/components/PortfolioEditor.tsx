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

  // Função auxiliar para adicionar tags com suporte a vírgulas
  const addTagsFromInput = (input: HTMLInputElement, currentTags: string[], updateFn: (tags: string[]) => void) => {
    const text = input.value.trim();
    if (!text) return;

    // Se contém vírgula, dividir em múltiplas tags
    if (text.includes(',')) {
      const newTags = text.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0 && !currentTags.includes(tag));
      
      if (newTags.length > 0) {
        updateFn([...currentTags, ...newTags]);
        input.value = '';
      }
    } else {
      // Tag única
      if (!currentTags.includes(text)) {
        updateFn([...currentTags, text]);
        input.value = '';
      }
    }
  };

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
                  <div style={additionalStyles.inputWithButton}>
                    <input
                      type="text"
                      placeholder="Digite habilidades separadas por vírgula (ex: JavaScript, React, Node.js) ou pressione Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          addTagsFromInput(input, data.skills.technical, (tags) => updateSkills('technical', tags));
                        }
                      }}
                      onInput={(e) => {
                        // Log para verificar se vírgulas estão funcionando
                        const input = e.target as HTMLInputElement;
                        console.log('Technical skills input:', input.value);
                      }}
                    />
                    <button
                      type="button"
                      style={additionalStyles.addTagButton}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.background = '#0056b3';
                        (e.target as HTMLElement).style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = '#007bff';
                        (e.target as HTMLElement).style.transform = 'scale(1)';
                      }}
                      onClick={() => {
                        const input = document.querySelector(`.${styles.skillsInput} input`) as HTMLInputElement;
                        addTagsFromInput(input, data.skills.technical, (tags) => updateSkills('technical', tags));
                      }}
                      title="Adicionar habilidade(s)"
                    >
                      +
                    </button>
                  </div>
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
                  <div style={additionalStyles.inputWithButton}>
                    <input
                      type="text"
                      placeholder="Digite uma ferramenta (ex: VS Code, Git) e pressione Enter ou clique no +"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const newTool = input.value.trim();
                          if (newTool && !data.skills.tools.includes(newTool)) {
                            updateSkills('tools', [...data.skills.tools, newTool]);
                            input.value = '';
                          }
                        }
                      }}
                      onInput={(e) => {
                        // Permitir digitação normal incluindo vírgulas
                        const input = e.target as HTMLInputElement;
                        console.log('Tools input value:', input.value);
                      }}
                    />
                    <button
                      type="button"
                      style={additionalStyles.addTagButton}
                      onClick={() => {
                        const inputs = document.querySelectorAll(`.${styles.skillsInput} input`);
                        const toolInput = inputs[1] as HTMLInputElement; // Segunda input (tools)
                        const newTool = toolInput.value.trim();
                        if (newTool && !data.skills.tools.includes(newTool)) {
                          updateSkills('tools', [...data.skills.tools, newTool]);
                          toolInput.value = '';
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
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
                  <div style={additionalStyles.inputWithButton}>
                    <input
                      type="text"
                      placeholder="Digite um idioma (ex: Português - Nativo) e pressione Enter ou clique no +"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const newLanguage = input.value.trim();
                          if (newLanguage && !data.skills.languages.includes(newLanguage)) {
                            updateSkills('languages', [...data.skills.languages, newLanguage]);
                            input.value = '';
                          }
                        }
                      }}
                      onInput={(e) => {
                        // Permitir digitação normal incluindo vírgulas
                        const input = e.target as HTMLInputElement;
                        console.log('Languages input value:', input.value);
                      }}
                    />
                    <button
                      type="button"
                      style={additionalStyles.addTagButton}
                      onClick={() => {
                        const inputs = document.querySelectorAll(`.${styles.skillsInput} input`);
                        const languageInput = inputs[2] as HTMLInputElement; // Terceira input (languages)
                        const newLanguage = languageInput.value.trim();
                        if (newLanguage && !data.skills.languages.includes(newLanguage)) {
                          updateSkills('languages', [...data.skills.languages, newLanguage]);
                          languageInput.value = '';
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
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

              <div className={styles.field}>
                <label>Habilidades Interpessoais (Soft Skills)</label>
                <div className={styles.skillsInput}>
                  <div style={additionalStyles.inputWithButton}>
                    <input
                      type="text"
                      placeholder="Digite uma soft skill (ex: Liderança, Comunicação) e pressione Enter ou clique no +"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          const newSoftSkill = input.value.trim();
                          if (newSoftSkill && !data.skills.soft.includes(newSoftSkill)) {
                            updateSkills('soft', [...data.skills.soft, newSoftSkill]);
                            input.value = '';
                          }
                        }
                      }}
                      onInput={(e) => {
                        // Permitir digitação normal incluindo vírgulas
                        const input = e.target as HTMLInputElement;
                        console.log('Soft skills input value:', input.value);
                      }}
                    />
                    <button
                      type="button"
                      style={additionalStyles.addTagButton}
                      onClick={() => {
                        const inputs = document.querySelectorAll(`.${styles.skillsInput} input`);
                        const softSkillInput = inputs[3] as HTMLInputElement; // Quarta input (soft skills)
                        const newSoftSkill = softSkillInput.value.trim();
                        if (newSoftSkill && !data.skills.soft.includes(newSoftSkill)) {
                          updateSkills('soft', [...data.skills.soft, newSoftSkill]);
                          softSkillInput.value = '';
                        }
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className={styles.skillsTags}>
                    {data.skills.soft.map((skill: string, index: number) => (
                      <span key={index} className={styles.skillTag}>
                        {skill}
                        <button
                          onClick={() => {
                            const updatedSoftSkills = data.skills.soft.filter((_: string, i: number) => i !== index);
                            updateSkills('soft', updatedSoftSkills);
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

                    <div className={styles.field}>
                      <label>Tecnologias</label>
                      <div className={styles.skillsInput}>
                        <div style={additionalStyles.inputWithButton}>
                          <input
                            type="text"
                            placeholder="Digite tecnologias separadas por vírgula (ex: React, Node.js, MongoDB) ou pressione Enter"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                addTagsFromInput(input, project.technologies, (techs) => 
                                  updateProject(project.id, { technologies: techs })
                                );
                              }
                            }}
                            onInput={(e) => {
                              // Log para verificar se vírgulas estão funcionando
                              const input = e.target as HTMLInputElement;
                              console.log('Project tech input:', input.value);
                            }}
                          />
                          <button
                            type="button"
                            style={additionalStyles.addTagButton}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.background = '#0056b3';
                              (e.target as HTMLElement).style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.background = '#007bff';
                              (e.target as HTMLElement).style.transform = 'scale(1)';
                            }}
                            onClick={(e) => {
                              const projectCard = (e.target as HTMLElement).closest(`.${styles.projectCard}`);
                              const input = projectCard?.querySelector('input[placeholder*="tecnologia"]') as HTMLInputElement;
                              if (input) {
                                addTagsFromInput(input, project.technologies, (techs) => 
                                  updateProject(project.id, { technologies: techs })
                                );
                              }
                            }}
                            title="Adicionar tecnologia(s)"
                          >
                            +
                          </button>
                        </div>
                        <div className={styles.skillsTags}>
                          {project.technologies.map((tech: string, index: number) => (
                            <span key={index} className={styles.skillTag}>
                              {tech}
                              <button
                                onClick={() => {
                                  const updatedTechs = project.technologies.filter((_: string, i: number) => i !== index);
                                  updateProject(project.id, { technologies: updatedTechs });
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
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

          {activeTab === 'experience' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Experiência Profissional</h2>
                <button
                  onClick={() => {
                    addExperience({
                      company: 'Nova Empresa',
                      position: 'Cargo',
                      startDate: '2023-01',
                      description: 'Descrição da experiência profissional',
                      current: false,
                    });
                  }}
                  className={styles.addButton}
                >
                  + Adicionar Experiência
                </button>
              </div>

              <div className={styles.projectsList}>
                {data.experience.map((exp: PortfolioData['experience'][0]) => (
                  <div key={exp.id} className={styles.projectCard}>
                    <div className={styles.projectHeader}>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        className={styles.projectTitle}
                        placeholder="Cargo/Posição"
                      />
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className={styles.deleteButton}
                      >
                        🗑️
                      </button>
                    </div>

                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label>Empresa</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          placeholder="Nome da empresa"
                        />
                      </div>

                      <div className={styles.field}>
                        <label>Localização</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          placeholder="Cidade, Estado"
                        />
                      </div>
                    </div>

                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label>Data de Início</label>
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        />
                      </div>

                      <div className={styles.field}>
                        <label>Data de Fim</label>
                        <input
                          type="month"
                          value={exp.endDate || ''}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                          disabled={exp.current}
                        />
                      </div>
                    </div>

                    <div className={styles.checkboxField}>
                      <label>
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, { 
                            current: e.target.checked,
                            endDate: e.target.checked ? undefined : exp.endDate
                          })}
                        />
                        Trabalho atual
                      </label>
                    </div>

                    <div className={styles.field}>
                      <label>Descrição</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        placeholder="Descreva suas responsabilidades e conquistas..."
                        rows={4}
                      />
                    </div>

                    <div className={styles.field}>
                      <label>URL da Empresa (opcional)</label>
                      <input
                        type="url"
                        value={exp.companyUrl || ''}
                        onChange={(e) => updateExperience(exp.id, { companyUrl: e.target.value })}
                        placeholder="https://empresa.com"
                      />
                    </div>
                  </div>
                ))}

                {data.experience.length === 0 && (
                  <div className={styles.emptyState}>
                    <p>📋 Nenhuma experiência adicionada ainda.</p>
                    <p>Clique em "Adicionar Experiência" para começar!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// CSS adicional para os novos elementos
const additionalStyles = {
  inputWithButton: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  } as React.CSSProperties,
  addTagButton: {
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    flexShrink: 0
  } as React.CSSProperties
};
