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
  hero: {
    staticDescription: string;
    useStaticDescription: boolean;
  };
  stats: {
    projects: string;
    experience: string;
    satisfaction: string;
  };
  footer: {
    description: string;
    socialLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      github?: string;
      youtube?: string;
      tiktok?: string;
      whatsapp?: string;
    };
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
    location?: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    period: string;
    description?: string;
    field?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    organization?: string;
    date: string;
    url?: string;
    credentialUrl?: string;
    description?: string;
  }>;
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    icon: string;
    features?: string[];
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    content: string;
    text?: string;
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
  hero: {
    staticDescription: 'Criando experiências digitais únicas através de código limpo e design inovador',
    useStaticDescription: false,
  },
  stats: {
    projects: '50+',
    experience: '5+',
    satisfaction: '100%',
  },
  footer: {
    description: 'Desenvolvedor apaixonado por criar soluções inovadoras',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      github: '',
      youtube: '',
      tiktok: '',
      whatsapp: '',
    },
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

export const usePortfolioEditor = (userId: string, siteId: string) => {
  const [data, setData] = useState<PortfolioSiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load site data
  useEffect(() => {
    if (!userId || !siteId) return;

    const siteDocRef = doc(db, 'users', userId, 'sites', siteId);
    
    const unsubscribe: Unsubscribe = onSnapshot(
      siteDocRef,
      (doc) => {
        if (doc.exists()) {
          const siteData = { id: doc.id, ...doc.data() } as PortfolioSiteData;
          
          // Ensure portfolioData has default structure
          if (!siteData.portfolioData) {
            siteData.portfolioData = getDefaultPortfolioCustomization();
          } else {
            // Merge with defaults to ensure all fields exist
            const defaults = getDefaultPortfolioCustomization();
            siteData.portfolioData = {
              ...defaults,
              ...siteData.portfolioData,
              personalInfo: { ...defaults.personalInfo, ...siteData.portfolioData.personalInfo },
              about: { ...defaults.about, ...siteData.portfolioData.about },
              hero: { ...defaults.hero, ...siteData.portfolioData.hero },
              stats: { ...defaults.stats, ...siteData.portfolioData.stats },
              footer: { 
                ...defaults.footer, 
                ...siteData.portfolioData.footer,
                socialLinks: { ...defaults.footer.socialLinks, ...siteData.portfolioData.footer?.socialLinks }
              },
              skills: { ...defaults.skills, ...siteData.portfolioData.skills },
              theme: { ...defaults.theme, ...siteData.portfolioData.theme },
              seo: { ...defaults.seo, ...siteData.portfolioData.seo },
              settings: { 
                ...defaults.settings, 
                ...siteData.portfolioData.settings,
                showSections: { ...defaults.settings.showSections, ...siteData.portfolioData.settings?.showSections }
              },
              projects: siteData.portfolioData.projects || defaults.projects,
              experience: siteData.portfolioData.experience || defaults.experience,
              education: siteData.portfolioData.education || defaults.education,
              certifications: siteData.portfolioData.certifications || defaults.certifications,
              services: siteData.portfolioData.services || defaults.services,
              testimonials: siteData.portfolioData.testimonials || defaults.testimonials,
            };
          }
          
          setData(siteData);
          setError(null);
        } else {
          setError('Site não encontrado');
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error loading site data:', error);
        setError('Erro ao carregar dados do site');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, siteId]);

  // Update portfolio data
  const updatePortfolioData = useCallback(async (updates: Partial<PortfolioCustomization>) => {
    if (!data || !userId || !siteId) return false;

    setSaving(true);
    try {
      const siteDocRef = doc(db, 'users', userId, 'sites', siteId);
      await updateDoc(siteDocRef, {
        portfolioData: { ...data.portfolioData, ...updates },
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating portfolio data:', error);
      return false;
    } finally {
      setSaving(false);
    }
  }, [data, userId, siteId]);

  // Toggle publish status
  const togglePublish = useCallback(async () => {
    if (!data) return false;

    setSaving(true);
    try {
      const siteDocRef = doc(db, 'users', userId, 'sites', siteId);
      const newPublishedStatus = !data.published;
      
      await updateDoc(siteDocRef, {
        published: newPublishedStatus,
        publishedAt: newPublishedStatus ? serverTimestamp() : null,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error toggling publish status:', error);
      return false;
    } finally {
      setSaving(false);
    }
  }, [data, userId, siteId]);

  // Update personal info
  const updatePersonalInfo = useCallback((updates: Partial<PortfolioCustomization['personalInfo']>) => {
    return updatePortfolioData({
      personalInfo: { ...data!.portfolioData.personalInfo, ...updates }
    });
  }, [data, updatePortfolioData]);

  // Update about section
  const updateAbout = useCallback((updates: Partial<PortfolioCustomization['about']>) => {
    return updatePortfolioData({
      about: { ...data!.portfolioData.about, ...updates }
    });
  }, [data, updatePortfolioData]);

  // Update hero section
  const updateHero = useCallback((updates: Partial<PortfolioCustomization['hero']>) => {
    return updatePortfolioData({
      hero: { ...data!.portfolioData.hero, ...updates }
    });
  }, [data, updatePortfolioData]);

  // Update stats section
  const updateStats = useCallback((updates: Partial<PortfolioCustomization['stats']>) => {
    return updatePortfolioData({
      stats: { ...data!.portfolioData.stats, ...updates }
    });
  }, [data, updatePortfolioData]);

  // Update footer section
  const updateFooter = useCallback((updates: Partial<PortfolioCustomization['footer']>) => {
    return updatePortfolioData({
      footer: { 
        ...data!.portfolioData.footer, 
        ...updates,
        socialLinks: { ...data!.portfolioData.footer.socialLinks, ...updates.socialLinks }
      }
    });
  }, [data, updatePortfolioData]);

  // Update skills
  const updateSkills = useCallback((updates: Partial<PortfolioCustomization['skills']>) => {
    return updatePortfolioData({
      skills: { ...data!.portfolioData.skills, ...updates }
    });
  }, [data, updatePortfolioData]);

  // Update theme
  const updateTheme = useCallback((updates: Partial<PortfolioCustomization['theme']>) => {
    return updatePortfolioData({
      theme: { ...data!.portfolioData.theme, ...updates }
    });
  }, [data, updatePortfolioData]);

  // Update settings
  const updateSettings = useCallback((updates: Partial<PortfolioCustomization['settings']>) => {
    return updatePortfolioData({
      settings: { ...data!.portfolioData.settings, ...updates }
    });
  }, [data, updatePortfolioData]);

  // Project management
  const addProject = useCallback((project: Omit<PortfolioCustomization['projects'][0], 'id'>) => {
    if (!data) return Promise.resolve(false);
    
    const newProject = {
      ...project,
      id: Date.now().toString()
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

  // Experience management
  const addExperience = useCallback((experience: Omit<PortfolioCustomization['experience'][0], 'id'>) => {
    if (!data) return Promise.resolve(false);
    
    const newExperience = {
      ...experience,
      id: Date.now().toString()
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

  // Service management
  const addService = useCallback((service: Omit<PortfolioCustomization['services'][0], 'id'>) => {
    if (!data) return Promise.resolve(false);
    
    const newService = {
      ...service,
      id: Date.now().toString()
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

  // Testimonials management
  const updateTestimonials = useCallback((testimonials: PortfolioCustomization['testimonials']) => {
    return updatePortfolioData({ testimonials });
  }, [updatePortfolioData]);

  // Education management
  const updateEducation = useCallback((education: PortfolioCustomization['education']) => {
    return updatePortfolioData({ education });
  }, [updatePortfolioData]);

  // Certifications management
  const updateCertifications = useCallback((certifications: PortfolioCustomization['certifications']) => {
    return updatePortfolioData({ certifications });
  }, [updatePortfolioData]);

  return {
    data,
    loading,
    error,
    saving,
    togglePublish,
    updatePersonalInfo,
    updateAbout,
    updateHero,
    updateStats,
    updateFooter,
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
  };
};
