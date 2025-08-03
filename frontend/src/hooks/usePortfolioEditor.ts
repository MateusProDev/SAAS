"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  onSnapshot,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../utils/firebase';

// Tipos específicos para Portfolio
export interface PortfolioCustomization {
  personalInfo: {
    name: string;
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    whatsapp?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  about: {
    title: string;
    description: string;
    resumeUrl?: string;
  };
  skills: {
    technical: string[];
    tools: string[];
    languages: string[];
    soft: string[];
  };
  projects: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    technologies: string[];
    imageUrl?: string;
    projectUrl?: string;
    githubUrl?: string;
    featured: boolean;
  }>;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    period: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    period: string;
    description?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    icon: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    content: string;
    rating: number;
    position: string;
    company: string;
    imageUrl?: string;
  }>;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    layout: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  settings: {
    showSections: {
      about: boolean;
      skills: boolean;
      projects: boolean;
      experience: boolean;
      education: boolean;
      certifications: boolean;
      services: boolean;
      testimonials: boolean;
      contact: boolean;
    };
    allowDownloadResume: boolean;
    showContactForm: boolean;
    showSocialLinks: boolean;
    enableAnalytics: boolean;
  };
}

export interface PortfolioSiteData {
  id: string;
  title: string;
  description: string;
  template: 'portfolio';
  portfolioData: PortfolioCustomization;
  published: boolean;
  publishedAt?: any;
  createdAt: any;
  updatedAt: any;
  userId: string;
}

// Dados padrão para Portfolio
export const getDefaultPortfolioCustomization = (): PortfolioCustomization => ({
  personalInfo: {
    name: 'Seu Nome Aqui',
    title: 'Desenvolvedor Full Stack',
    subtitle: 'Transformando ideias em soluções digitais',
    email: 'contato@exemplo.com',
    phone: '(11) 99999-9999',
    location: 'São Paulo, Brasil',
    whatsapp: '5511999999999',
    linkedin: '',
    github: '',
    website: '',
  },
  about: {
    title: 'Sobre Mim',
    description: 'Desenvolvedor apaixonado por tecnologia com experiência em criar soluções inovadoras e eficientes. Especializado em desenvolvimento web moderno com foco em experiência do usuário.',
    resumeUrl: '',
  },
  skills: {
    technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL'],
    tools: ['Git', 'Docker', 'VS Code', 'Figma', 'AWS'],
    languages: ['Português', 'Inglês'],
    soft: ['Comunicação', 'Trabalho em equipe', 'Liderança', 'Resolução de problemas'],
  },
  projects: [
    {
      id: '1',
      title: 'E-commerce Moderno',
      description: 'Plataforma de vendas online com carrinho, pagamentos e gestão de produtos',
      category: 'web',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      imageUrl: '',
      projectUrl: '',
      githubUrl: '',
      featured: true,
    },
    {
      id: '2',
      title: 'App Mobile',
      description: 'Aplicativo de produtividade com sincronização em nuvem',
      category: 'mobile',
      technologies: ['React Native', 'Firebase', 'TypeScript'],
      imageUrl: '',
      projectUrl: '',
      githubUrl: '',
      featured: false,
    },
  ],
  experience: [
    {
      id: '1',
      title: 'Desenvolvedor Full Stack',
      company: 'Tech Company',
      period: '2022 - Presente',
      description: 'Desenvolvimento de aplicações web modernas e APIs REST.',
      current: true,
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Ciência da Computação',
      institution: 'Universidade',
      period: '2018 - 2022',
      description: 'Graduação com foco em desenvolvimento de software.',
    },
  ],
  certifications: [],
  services: [
    {
      id: '1',
      name: 'Desenvolvimento Web',
      description: 'Sites e aplicações web modernas e responsivas',
      price: 'A partir de R$ 2.500',
      icon: '💻',
    },
    {
      id: '2',
      name: 'Consultoria Tech',
      description: 'Análise técnica e arquitetura de sistemas',
      price: 'R$ 150/hora',
      icon: '🔧',
    },
  ],
  testimonials: [],
  theme: {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    fontFamily: 'Inter, sans-serif',
    layout: 'modern',
  },
  seo: {
    title: 'Meu Portfólio',
    description: 'Portfólio profissional - Desenvolvedor Full Stack',
    keywords: ['desenvolvedor', 'portfolio', 'web developer'],
  },
  settings: {
    showSections: {
      about: true,
      skills: true,
      projects: true,
      experience: true,
      education: false,
      certifications: false,
      services: false,
      testimonials: false,
      contact: true,
    },
    allowDownloadResume: false,
    showContactForm: true,
    showSocialLinks: true,
    enableAnalytics: false,
  },
});

export function usePortfolioEditor(userId: string, siteId: string) {
  const [data, setData] = useState<PortfolioSiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Carregar dados do site com listener em tempo real
  useEffect(() => {
    if (!userId || !siteId) return;

    let unsubscribe: Unsubscribe;

    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, 'users', userId, 'sites', siteId);
        
        // Primeiro carregamento
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const siteData = docSnap.data();
          
          // Se não tem portfolioData, cria com dados padrão
          if (!siteData.portfolioData) {
            const defaultPortfolioData = getDefaultPortfolioCustomization();
            const updatedData = {
              ...siteData,
              portfolioData: defaultPortfolioData,
            };
            
            await updateDoc(docRef, {
              portfolioData: defaultPortfolioData,
              updatedAt: serverTimestamp(),
            });
            
            setData(updatedData as PortfolioSiteData);
          } else {
            setData(siteData as PortfolioSiteData);
          }
          
          // Configura listener para atualizações em tempo real
          unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
              setData(doc.data() as PortfolioSiteData);
            }
          });
          
        } else {
          setError('Site não encontrado');
        }
      } catch (err) {
        console.error('Erro ao carregar dados do site:', err);
        setError('Erro ao carregar dados do site');
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, siteId]);

  // Salvar dados no Firebase
  const saveSiteData = useCallback(async (newData: Partial<PortfolioSiteData>) => {
    if (!userId || !siteId || !data) return false;

    try {
      setSaving(true);
      const docRef = doc(db, 'users', userId, 'sites', siteId);
      
      const updateData = {
        ...newData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(docRef, updateData);
      return true;
    } catch (err) {
      console.error('Erro ao salvar dados do site:', err);
      setError('Erro ao salvar dados do site');
      return false;
    } finally {
      setSaving(false);
    }
  }, [userId, siteId, data]);

  // Atualizar portfolioData
  const updatePortfolioData = useCallback(async (updates: Partial<PortfolioCustomization>) => {
    if (!data) return false;

    const newPortfolioData = {
      ...data.portfolioData,
      ...updates,
    } as PortfolioCustomization;

    return await saveSiteData({ portfolioData: newPortfolioData });
  }, [data, saveSiteData]);

  // Publicar/despublicar site
  const togglePublish = useCallback(async () => {
    if (!data) return false;

    const newPublishedState = !data.published;
    const updateData: Partial<PortfolioSiteData> = {
      published: newPublishedState,
    };

    if (newPublishedState) {
      updateData.publishedAt = serverTimestamp();
    }

    return await saveSiteData(updateData);
  }, [data, saveSiteData]);

  // Helpers para diferentes seções
  const updatePersonalInfo = useCallback((updates: Partial<PortfolioCustomization['personalInfo']>) => {
    if (!data) return Promise.resolve(false);
    return updatePortfolioData({
      personalInfo: { ...data.portfolioData.personalInfo, ...updates }
    });
  }, [data, updatePortfolioData]);

  const updateAbout = useCallback((updates: Partial<PortfolioCustomization['about']>) => {
    if (!data) return Promise.resolve(false);
    return updatePortfolioData({
      about: { ...data.portfolioData.about, ...updates }
    });
  }, [data, updatePortfolioData]);

  const updateSkills = useCallback((updates: Partial<PortfolioCustomization['skills']>) => {
    if (!data) return Promise.resolve(false);
    return updatePortfolioData({
      skills: { ...data.portfolioData.skills, ...updates }
    });
  }, [data, updatePortfolioData]);

  const updateTheme = useCallback((updates: Partial<PortfolioCustomization['theme']>) => {
    if (!data) return Promise.resolve(false);
    return updatePortfolioData({
      theme: { ...data.portfolioData.theme, ...updates }
    });
  }, [data, updatePortfolioData]);

  const updateSettings = useCallback((updates: Partial<PortfolioCustomization['settings']>) => {
    if (!data) return Promise.resolve(false);
    return updatePortfolioData({
      settings: { ...data.portfolioData.settings, ...updates }
    });
  }, [data, updatePortfolioData]);

  // CRUD para projetos
  const addProject = useCallback((project: Omit<PortfolioCustomization['projects'][0], 'id'>) => {
    if (!data) return Promise.resolve(false);
    
    const newProject = {
      ...project,
      id: Date.now().toString(),
    };
    
    return updatePortfolioData({
      projects: [...data.portfolioData.projects, newProject]
    });
  }, [data, updatePortfolioData]);

  const updateProject = useCallback((projectId: string, updates: Partial<PortfolioCustomization['projects'][0]>) => {
    if (!data) return Promise.resolve(false);
    
    const updatedProjects = data.portfolioData.projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    
    return updatePortfolioData({ projects: updatedProjects });
  }, [data, updatePortfolioData]);

  const removeProject = useCallback((projectId: string) => {
    if (!data) return Promise.resolve(false);
    
    const filteredProjects = data.portfolioData.projects.filter(project => project.id !== projectId);
    
    return updatePortfolioData({ projects: filteredProjects });
  }, [data, updatePortfolioData]);

  // CRUD para experiências
  const addExperience = useCallback((experience: Omit<PortfolioCustomization['experience'][0], 'id'>) => {
    if (!data) return Promise.resolve(false);
    
    const newExperience = {
      ...experience,
      id: Date.now().toString(),
    };
    
    return updatePortfolioData({
      experience: [...data.portfolioData.experience, newExperience]
    });
  }, [data, updatePortfolioData]);

  const updateExperience = useCallback((experienceId: string, updates: Partial<PortfolioCustomization['experience'][0]>) => {
    if (!data) return Promise.resolve(false);
    
    const updatedExperience = data.portfolioData.experience.map(exp =>
      exp.id === experienceId ? { ...exp, ...updates } : exp
    );
    
    return updatePortfolioData({ experience: updatedExperience });
  }, [data, updatePortfolioData]);

  const removeExperience = useCallback((experienceId: string) => {
    if (!data) return Promise.resolve(false);
    
    const filteredExperience = data.portfolioData.experience.filter(exp => exp.id !== experienceId);
    
    return updatePortfolioData({ experience: filteredExperience });
  }, [data, updatePortfolioData]);

  // CRUD para serviços
  const addService = useCallback((service: Omit<PortfolioCustomization['services'][0], 'id'>) => {
    if (!data) return Promise.resolve(false);
    
    const newService = {
      ...service,
      id: Date.now().toString(),
    };
    
    return updatePortfolioData({
      services: [...data.portfolioData.services, newService]
    });
  }, [data, updatePortfolioData]);

  const updateService = useCallback((serviceId: string, updates: Partial<PortfolioCustomization['services'][0]>) => {
    if (!data) return Promise.resolve(false);
    
    const updatedServices = data.portfolioData.services.map(service =>
      service.id === serviceId ? { ...service, ...updates } : service
    );
    
    return updatePortfolioData({ services: updatedServices });
  }, [data, updatePortfolioData]);

  const removeService = useCallback((serviceId: string) => {
    if (!data) return Promise.resolve(false);
    
    const filteredServices = data.portfolioData.services.filter(service => service.id !== serviceId);
    
    return updatePortfolioData({ services: filteredServices });
  }, [data, updatePortfolioData]);

  return {
    data,
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
  };
}
