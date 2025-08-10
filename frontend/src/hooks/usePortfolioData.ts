import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

export interface PortfolioData {
  // Informações básicas
  personalInfo: {
    name: string;
    title: string;
    subtitle: string;
    profileImage?: string;
    backgroundImage?: string;
    resumeUrl?: string;
    location: string;
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  
  // Sobre
  about: {
    description: string;
    mission?: string;
    vision?: string;
  };
  
  // Habilidades
  skills: {
    technical: string[];
    tools: string[];
    languages: string[];
    soft: string[];
  };
  
  // Projetos
  projects: Array<{
    id: string;
    title: string;
    description: string;
    image?: string;
    images?: string[];
    technologies: string[];
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    category: string;
    startDate?: string;
    endDate?: string;
    status: 'completed' | 'in-progress' | 'planned';
  }>;
  
  // Experiência profissional
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    current: boolean;
    location?: string;
    companyUrl?: string;
    achievements?: string[];
  }>;
  
  // Educação
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    gpa?: string;
    description?: string;
  }>;
  
  // Certificações
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
  }>;
  
  // Serviços (para freelancers)
  services: Array<{
    id: string;
    title: string;
    description: string;
    price?: string;
    duration?: string;
    features: string[];
    icon?: string;
  }>;
  
  // Depoimentos
  testimonials: Array<{
    id: string;
    name: string;
    position: string;
    company: string;
    text: string;
    avatar?: string;
    rating?: number;
  }>;
  
  // Configurações de tema
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    layout: 'modern' | 'classic' | 'minimal' | 'creative';
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
  };
  
  // SEO e metadata
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  
  // Configurações avançadas
  settings: {
    showContactForm: boolean;
    allowDownloadResume: boolean;
    showSocialLinks: boolean;
    enableAnalytics: boolean;
    customDomain?: string;
    favicon?: string;
  };
}

// Dados padrão para novo portfólio
export const defaultPortfolioData: PortfolioData = {
  personalInfo: {
    name: "Seu Nome Aqui",
    title: "Desenvolvedor Full Stack",
    subtitle: "Transformando ideias em soluções digitais",
    location: "São Paulo, Brasil",
    email: "contato@exemplo.com",
    phone: "",
    linkedin: "",
    github: "",
    website: "",
  },
  about: {
    description: "Sou um desenvolvedor apaixonado por tecnologia, sempre em busca de novos desafios e oportunidades de crescimento. Especializado em criar soluções inovadoras e eficientes que fazem a diferença.",
    mission: "",
    vision: "",
  },
  skills: {
    technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
    tools: ["Git", "Docker", "VS Code", "Figma"],
    languages: ["Português - Nativo", "Inglês - Intermediário"],
    soft: ["Comunicação", "Trabalho em equipe", "Liderança", "Resolução de problemas"],
  },
  projects: [
    {
      id: "demo_project_1",
      title: "Projeto Exemplo",
      description: "Este é um projeto de exemplo. Substitua por seus próprios projetos!",
      technologies: ["React", "TypeScript", "Node.js"],
      featured: true,
      category: "Web",
      status: "completed",
      liveUrl: "",
      githubUrl: "",
    }
  ],
  experience: [
    {
      id: "demo_exp_1",
      company: "Empresa Exemplo",
      position: "Desenvolvedor",
      startDate: "2023-01",
      endDate: "",
      current: true,
      description: "Esta é uma experiência de exemplo. Substitua por suas próprias experiências!",
      location: "São Paulo, SP",
    }
  ],
  education: [
    {
      id: "demo_edu_1",
      institution: "Universidade/Curso",
      degree: "Bacharelado/Curso",
      field: "Ciência da Computação/Área",
      startDate: "2020-01",
      endDate: "2023-12",
      current: false,
      description: "Adicione sua formação acadêmica aqui.",
    }
  ],
  certifications: [
    {
      id: "demo_cert_1",
      name: "Certificação Exemplo",
      issuer: "Instituição",
      issueDate: "2023-06",
      credentialId: "",
      credentialUrl: "",
    }
  ],
  services: [
    {
      id: "demo_service_1",
      title: "Desenvolvimento Web",
      description: "Criação de sites e aplicações web modernas e responsivas",
      price: "A partir de R$ 2.500",
      features: ["Design Responsivo", "SEO Otimizado", "Performance Alta"],
      icon: "💻",
    }
  ],
  testimonials: [
    {
      id: "demo_testimonial_1",
      name: "Cliente Exemplo",
      position: "CEO",
      company: "Empresa X",
      text: "Excelente profissional, entrega de qualidade e no prazo!",
      rating: 5,
    }
  ],
  theme: {
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    backgroundColor: "#ffffff",
    textColor: "#333333",
    fontFamily: "Inter, sans-serif",
    layout: "modern",
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
  },
  seo: {
    title: "Meu Portfólio",
    description: "Portfólio profissional - Desenvolvedor Full Stack",
    keywords: ["desenvolvedor", "portfolio", "web developer"],
  },
  settings: {
    showContactForm: true,
    allowDownloadResume: false,
    showSocialLinks: true,
    enableAnalytics: false,
  },
};

export function usePortfolioData(userId: string, siteId: string) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do portfólio
  const loadPortfolioData = async () => {
    if (!userId || !siteId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const docRef = doc(db, 'users', userId, 'sites', siteId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const siteData = docSnap.data();
        
        // Se já tem dados específicos do portfólio, usa eles
        if (siteData.portfolioData) {
          setData(siteData.portfolioData);
        } else {
          // Se não tem, cria com dados padrão
          const newPortfolioData = {
            ...defaultPortfolioData,
            personalInfo: {
              ...defaultPortfolioData.personalInfo,
              name: siteData.name || defaultPortfolioData.personalInfo.name,
              email: siteData.email || defaultPortfolioData.personalInfo.email,
            },
            about: {
              ...defaultPortfolioData.about,
              description: siteData.description || defaultPortfolioData.about.description,
            },
          };
          
          // Salva os dados padrão no Firestore
          await updateDoc(docRef, {
            portfolioData: newPortfolioData,
            updatedAt: serverTimestamp(),
          });
          
          setData(newPortfolioData);
        }
      } else {
        // Site não existe, cria um novo
        const newSiteData = {
          id: siteId,
          name: "Meu Portfólio",
          template: "portfolio",
          portfolioData: defaultPortfolioData,
          isPublished: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        
        await setDoc(docRef, newSiteData);
        setData(defaultPortfolioData);
      }
    } catch (err) {
      console.error('Erro ao carregar dados do portfólio:', err);
      setError('Erro ao carregar dados do portfólio');
    } finally {
      setLoading(false);
    }
  };

  // Salvar dados do portfólio
  const savePortfolioData = async (newData: PortfolioData) => {
    if (!userId || !siteId) return;
    
    try {
      const docRef = doc(db, 'users', userId, 'sites', siteId);
      
      await updateDoc(docRef, {
        portfolioData: newData,
        updatedAt: serverTimestamp(),
        // Atualiza também os campos básicos do site
        name: newData.personalInfo.name,
        description: newData.about.description,
      });
      
      setData(newData);
      return true;
    } catch (err) {
      console.error('Erro ao salvar dados do portfólio:', err);
      setError('Erro ao salvar dados do portfólio');
      return false;
    }
  };

  // Atualizar seção específica
  const updateSection = async (section: keyof PortfolioData, sectionData: PortfolioData[keyof PortfolioData]) => {
    if (!data) return false;
    
    const updatedData = {
      ...data,
      [section]: sectionData,
    };
    
    return await savePortfolioData(updatedData);
  };

  // Adicionar projeto
  const addProject = async (project: Omit<PortfolioData['projects'][0], 'id'>) => {
    if (!data) return false;
    
    const newProject = {
      ...project,
      id: `project_${Date.now()}`,
    };
    
    const updatedProjects = [...data.projects, newProject];
    return await updateSection('projects', updatedProjects);
  };

  // Atualizar projeto
  const updateProject = async (projectId: string, projectData: Partial<PortfolioData['projects'][0]>) => {
    if (!data) return false;
    
    const updatedProjects = data.projects.map(project =>
      project.id === projectId ? { ...project, ...projectData } : project
    );
    
    return await updateSection('projects', updatedProjects);
  };

  // Remover projeto
  const removeProject = async (projectId: string) => {
    if (!data) return false;
    
    const updatedProjects = data.projects.filter(project => project.id !== projectId);
    return await updateSection('projects', updatedProjects);
  };

  // Funções similares para experiência, educação, etc.
  const addExperience = async (experience: Omit<PortfolioData['experience'][0], 'id'>) => {
    if (!data) return false;
    
    const newExperience = {
      ...experience,
      id: `exp_${Date.now()}`,
    };
    
    const updatedExperience = [...data.experience, newExperience];
    return await updateSection('experience', updatedExperience);
  };

  const updateExperience = async (expId: string, expData: Partial<PortfolioData['experience'][0]>) => {
    if (!data) return false;
    
    const updatedExperience = data.experience.map(exp =>
      exp.id === expId ? { ...exp, ...expData } : exp
    );
    
    return await updateSection('experience', updatedExperience);
  };

  const removeExperience = async (expId: string) => {
    if (!data) return false;
    
    const updatedExperience = data.experience.filter(exp => exp.id !== expId);
    return await updateSection('experience', updatedExperience);
  };

  // Publicar portfólio
  const publishPortfolio = async () => {
    if (!userId || !siteId || !data) return false;
    try {
      // Atualiza o site como publicado apenas na subcoleção do usuário
      const siteRef = doc(db, 'users', userId, 'sites', siteId);
      await updateDoc(siteRef, {
        isPublished: true,
        publishedAt: serverTimestamp(),
        portfolioData: data,
        slug: `${data.personalInfo.name.toLowerCase().replace(/\s+/g, '-')}-${siteId}`,
      });
      return true;
    } catch (err) {
      console.error('Erro ao publicar portfólio:', err);
      return false;
    }
  };

  useEffect(() => {
    loadPortfolioData();
  }, [userId, siteId]);

  return {
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
    publishPortfolio,
    reload: loadPortfolioData,
  };
}
