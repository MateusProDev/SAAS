import { useEffect, useState } from 'react';
import api from '../../utils/api';

export interface SiteData {
  id: string;
  title: string;
  description: string;
  template: string;
  slug?: string;
  published?: boolean;
  settings?: {
    theme?: string;
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
  };
  // Dados que ainda não estão no Firebase - usando mock
  hero?: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonUrl: string;
  };
  about?: {
    text: string;
  };
  services?: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
  }>;
  contact?: {
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
  };
  gallery?: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
}

/**
 * Hook para buscar e editar dados de um site específico
 * Combina dados reais do Firebase com mock data para campos ainda não implementados
 */
export function useSiteEdit(siteId: string) {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Mock data para campos ainda não implementados no Firebase
  const getMockDataForTemplate = (template: string) => {
    const mockData = {
      barbearia: {
        hero: {
          title: "Barbearia Premium",
          subtitle: "Cortes modernos e clássicos com a qualidade que você merece",
          buttonText: "Agendar Horário",
          buttonUrl: "#contato"
        },
        about: {
          text: "Há mais de 10 anos no mercado, nossa barbearia oferece serviços de alta qualidade com profissionais experientes. Ambiente acolhedor e atendimento personalizado para cada cliente."
        },
        services: [
          { id: "1", name: "Corte Masculino", description: "Corte moderno e personalizado", price: "R$ 35,00" },
          { id: "2", name: "Barba", description: "Aparar e modelar barba", price: "R$ 25,00" },
          { id: "3", name: "Corte + Barba", description: "Pacote completo", price: "R$ 55,00" },
          { id: "4", name: "Sobrancelha", description: "Design de sobrancelha masculina", price: "R$ 15,00" }
        ],
        contact: {
          phone: "(11) 99999-9999",
          email: "contato@barbearia.com",
          address: "Rua das Flores, 123 - Centro",
          whatsapp: "5511999999999"
        },
        gallery: [
          { id: "1", url: "/api/placeholder/300/200", alt: "Ambiente da barbearia" },
          { id: "2", url: "/api/placeholder/300/200", alt: "Corte masculino" },
          { id: "3", url: "/api/placeholder/300/200", alt: "Produtos utilizados" }
        ]
      },
      comercial: {
        hero: {
          title: "Sua Empresa",
          subtitle: "Soluções inovadoras para o seu negócio",
          buttonText: "Entre em Contato",
          buttonUrl: "#contato"
        },
        about: {
          text: "Empresa líder no mercado, oferecendo soluções personalizadas para atender às necessidades específicas de cada cliente."
        },
        services: [
          { id: "1", name: "Consultoria", description: "Consultoria especializada", price: "Sob consulta" },
          { id: "2", name: "Implementação", description: "Implementação de soluções", price: "Sob consulta" }
        ],
        contact: {
          phone: "(11) 99999-9999",
          email: "contato@empresa.com",
          address: "Av. Principal, 456 - Centro",
          whatsapp: "5511999999999"
        },
        gallery: [
          { id: "1", url: "/api/placeholder/300/200", alt: "Escritório" },
          { id: "2", url: "/api/placeholder/300/200", alt: "Equipe" }
        ]
      }
    };
    
    return mockData[template as keyof typeof mockData] || mockData.comercial;
  };

  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await api.get(`/api/sites/${siteId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        
        const firebaseData = res.data;
        const mockData = getMockDataForTemplate(firebaseData.template || 'comercial');
        
        // Combina dados reais do Firebase com mock data
        setSiteData({
          ...mockData,
          id: firebaseData.id,
          title: firebaseData.title || firebaseData.name || 'Seu Site',
          description: firebaseData.description || 'Descrição do seu site',
          template: firebaseData.template || 'comercial',
          slug: firebaseData.slug,
          published: firebaseData.published || false,
          settings: firebaseData.settings || {
            theme: 'light',
            primaryColor: '#3B82F6',
            secondaryColor: '#1F2937',
            fontFamily: 'Inter'
          }
        });
      } catch (err: any) {
        console.error('Erro ao buscar dados do site:', err);
        setError(err.message || 'Erro ao buscar dados do site');
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [siteId]);

  const updateSiteData = (field: string, value: any) => {
    setSiteData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const saveSiteData = async (dataToSave: Partial<SiteData>) => {
    if (!siteId || !siteData) return false;
    
    setSaving(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      // Por enquanto, salva apenas os campos que existem no Firebase
      const firebaseFields = {
        title: dataToSave.title || siteData.title,
        description: dataToSave.description || siteData.description,
        template: dataToSave.template || siteData.template,
        settings: dataToSave.settings || siteData.settings
      };
      
      await api.put(`/api/sites/${siteId}`, firebaseFields, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      // Atualiza o estado local
      setSiteData(prev => prev ? { ...prev, ...dataToSave } : null);
      return true;
    } catch (err: any) {
      console.error('Erro ao salvar dados do site:', err);
      setError(err.message || 'Erro ao salvar dados do site');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    siteData,
    loading,
    error,
    saving,
    updateSiteData,
    saveSiteData
  };
}
