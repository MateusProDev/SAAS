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

// Tipos base para diferentes templates
export interface BaseCustomization {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
  about: {
    title: string;
    content: string;
    image?: string;
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsapp?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    layout?: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Extensões específicas por template
export interface BarbeariaCustomization extends BaseCustomization {
  services: Array<{
    id: string;
    name: string;
    price: number;
    duration: string;
    description?: string;
  }>;
  team: Array<{
    id: string;
    name: string;
    role: string;
    photo?: string;
    description?: string;
  }>;
  schedule: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  gallery: string[];
}

export interface ComercialCustomization extends BaseCustomization {
  products: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    image?: string;
    featured: boolean;
  }>;
  categories: Array<{
    id: string;
    name: string;
    description: string;
    icon?: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    content: string;
    rating: number;
    photo?: string;
    company?: string;
  }>;
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface AgenciaCustomization extends BaseCustomization {
  packages: Array<{
    id: string;
    name: string;
    price: number;
    duration: string;
    destinations: string[];
    includes: string[];
    excludes: string[];
    featured: boolean;
  }>;
  destinations: Array<{
    id: string;
    name: string;
    country: string;
    description: string;
    image?: string;
    price_from: number;
    popular: boolean;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    content: string;
    rating: number;
    photo?: string;
    destination: string;
  }>;
}

export type SiteCustomization = BarbeariaCustomization | ComercialCustomization | AgenciaCustomization;

export interface SiteData {
  id: string;
  title: string;
  description: string;
  template: 'barbearia' | 'comercial' | 'agencia';
  customization: SiteCustomization;
  published: boolean;
  publishedAt?: any;
  createdAt: any;
  updatedAt: any;
  userId: string;
}

// Dados padrão por template
export const getDefaultCustomization = (template: string): SiteCustomization => {
  const baseCustomization: BaseCustomization = {
    hero: {
      title: 'Bem-vindo ao nosso negócio',
      subtitle: 'Oferecemos os melhores serviços da região',
    },
    about: {
      title: 'Sobre Nós',
      content: 'Somos uma empresa comprometida com a excelência e qualidade no atendimento.',
    },
    contact: {
      phone: '(11) 99999-9999',
      email: 'contato@empresa.com',
      address: 'Rua das Flores, 123 - Centro',
    },
    theme: {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      fontFamily: 'Inter, sans-serif',
    },
    seo: {
      title: 'Minha Empresa',
      description: 'Descrição da minha empresa',
      keywords: [],
    },
  };

  switch (template) {
    case 'barbearia':
      return {
        ...baseCustomization,
        hero: {
          ...baseCustomization.hero,
          title: 'Barbearia Premium',
          subtitle: 'Cortes modernos e tradicionais com o melhor atendimento da cidade',
        },
        theme: {
          ...baseCustomization.theme,
          primaryColor: '#8B4513',
          secondaryColor: '#DAA520',
        },
        services: [
          { id: '1', name: 'Corte Masculino', price: 30, duration: '30min' },
          { id: '2', name: 'Barba', price: 20, duration: '20min' },
          { id: '3', name: 'Corte + Barba', price: 45, duration: '45min' },
        ],
        team: [],
        schedule: {
          monday: { open: '08:00', close: '18:00', closed: false },
          tuesday: { open: '08:00', close: '18:00', closed: false },
          wednesday: { open: '08:00', close: '18:00', closed: false },
          thursday: { open: '08:00', close: '18:00', closed: false },
          friday: { open: '08:00', close: '18:00', closed: false },
          saturday: { open: '08:00', close: '16:00', closed: false },
          sunday: { open: '08:00', close: '12:00', closed: false },
        },
        gallery: [],
      } as BarbeariaCustomization;

    case 'comercial':
      return {
        ...baseCustomization,
        hero: {
          ...baseCustomization.hero,
          title: 'Sua Empresa Comercial',
          subtitle: 'Produtos e serviços de qualidade para você',
        },
        theme: {
          ...baseCustomization.theme,
          primaryColor: '#28a745',
          secondaryColor: '#17a2b8',
        },
        products: [],
        categories: [],
        testimonials: [],
        features: [],
      } as ComercialCustomization;

    case 'agencia':
      return {
        ...baseCustomization,
        hero: {
          ...baseCustomization.hero,
          title: 'Agência de Viagens',
          subtitle: 'Transformamos seus sonhos em experiências inesquecíveis',
        },
        theme: {
          ...baseCustomization.theme,
          primaryColor: '#007bff',
          secondaryColor: '#6610f2',
        },
        packages: [],
        destinations: [],
        testimonials: [],
      } as AgenciaCustomization;

    default:
      return baseCustomization as SiteCustomization;
  }
};

export function useSiteEditor(userId: string, siteId: string) {
  const [data, setData] = useState<SiteData | null>(null);
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
          
          // Se não tem customization, cria com dados padrão
          if (!siteData.customization) {
            const defaultCustomization = getDefaultCustomization(siteData.template || 'barbearia');
            const updatedData = {
              ...siteData,
              customization: defaultCustomization,
            };
            
            await updateDoc(docRef, {
              customization: defaultCustomization,
              updatedAt: serverTimestamp(),
            });
            
            setData(updatedData as SiteData);
          } else {
            setData(siteData as SiteData);
          }
          
          // Configura listener para atualizações em tempo real
          unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
              setData(doc.data() as SiteData);
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
  const saveSiteData = useCallback(async (newData: Partial<SiteData>) => {
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

  // Atualizar customização
  const updateCustomization = useCallback(async (updates: Partial<SiteCustomization>) => {
    if (!data) return false;

    const newCustomization = {
      ...data.customization,
      ...updates,
    } as SiteCustomization;

    return await saveSiteData({ customization: newCustomization });
  }, [data, saveSiteData]);

  // Publicar/despublicar site
  const togglePublish = useCallback(async () => {
    if (!data) return false;

    const newPublishedState = !data.published;
    const updateData: Partial<SiteData> = {
      published: newPublishedState,
    };

    if (newPublishedState) {
      updateData.publishedAt = serverTimestamp();
    }

    return await saveSiteData(updateData);
  }, [data, saveSiteData]);

  // Helpers para diferentes seções
  const updateHero = useCallback((updates: Partial<BaseCustomization['hero']>) => {
    if (!data) return Promise.resolve(false);
    return updateCustomization({
      ...data.customization,
      hero: { ...data.customization.hero, ...updates }
    } as SiteCustomization);
  }, [data, updateCustomization]);

  const updateAbout = useCallback((updates: Partial<BaseCustomization['about']>) => {
    if (!data) return Promise.resolve(false);
    return updateCustomization({
      ...data.customization,
      about: { ...data.customization.about, ...updates }
    } as SiteCustomization);
  }, [data, updateCustomization]);

  const updateContact = useCallback((updates: Partial<BaseCustomization['contact']>) => {
    if (!data) return Promise.resolve(false);
    return updateCustomization({
      ...data.customization,
      contact: { ...data.customization.contact, ...updates }
    } as SiteCustomization);
  }, [data, updateCustomization]);

  const updateTheme = useCallback((updates: Partial<BaseCustomization['theme']>) => {
    if (!data) return Promise.resolve(false);
    return updateCustomization({
      ...data.customization,
      theme: { ...data.customization.theme, ...updates }
    } as SiteCustomization);
  }, [data, updateCustomization]);

  // Helpers específicos para template barbearia
  const addService = useCallback((service: Omit<BarbeariaCustomization['services'][0], 'id'>) => {
    if (!data || data.template !== 'barbearia') return Promise.resolve(false);
    
    const customization = data.customization as BarbeariaCustomization;
    const newService = {
      ...service,
      id: Date.now().toString(),
    };
    
    return updateCustomization({
      ...customization,
      services: [...customization.services, newService]
    } as SiteCustomization);
  }, [data, updateCustomization]);

  const updateService = useCallback((serviceId: string, updates: Partial<BarbeariaCustomization['services'][0]>) => {
    if (!data || data.template !== 'barbearia') return Promise.resolve(false);
    
    const customization = data.customization as BarbeariaCustomization;
    const updatedServices = customization.services.map(service =>
      service.id === serviceId ? { ...service, ...updates } : service
    );
    
    return updateCustomization({
      ...customization,
      services: updatedServices
    } as SiteCustomization);
  }, [data, updateCustomization]);

  const removeService = useCallback((serviceId: string) => {
    if (!data || data.template !== 'barbearia') return Promise.resolve(false);
    
    const customization = data.customization as BarbeariaCustomization;
    const filteredServices = customization.services.filter(service => service.id !== serviceId);
    
    return updateCustomization({
      ...customization,
      services: filteredServices
    } as SiteCustomization);
  }, [data, updateCustomization]);

  return {
    data,
    loading,
    error,
    saving,
    saveSiteData,
    updateCustomization,
    togglePublish,
    updateHero,
    updateAbout,
    updateContact,
    updateTheme,
    // Helpers específicos para barbearia
    addService,
    updateService,
    removeService,
  };
}
