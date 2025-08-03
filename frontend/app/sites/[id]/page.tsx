
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { BarbeariaTemplate } from "../../../src/templates/BarbeariaTemplate";
import { ComercialTemplate } from "../../../src/templates/ComercialTemplate";
import { AgenciaViagemTemplate } from "../../../src/templates/AgenciaViagemTemplate";
import { PortfolioTemplate } from "../../../src/templates/PortfolioTemplate";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../src/utils/firebase";
import styles from './site-detail.module.css';

export default function SiteDetailPage() {
  const { id } = useParams();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState<string>("");

  // Busca o site APENAS na nova estrutura users/{userId}/sites/{siteId}
  useEffect(() => {
    async function fetchSite() {
      // ✅ VERIFICAR SE ESTÁ NO CLIENTE E SE DB ESTÁ DISPONÍVEL
      if (typeof window === 'undefined' || !db) {
        console.log('⚠️ [SITE DETAIL] Aguardando cliente e Firebase...');
        setTimeout(fetchSite, 100); // Tentar novamente em 100ms
        return;
      }
      
      setLoading(true);
      console.log('🔍 [SITE DETAIL] Iniciando busca do site ID:', id);
      console.log('🔧 [SITE DETAIL] Firebase DB disponível:', !!db);
      
      try {
        console.log('🎯 [SITE DETAIL] Buscando DIRETAMENTE na nova estrutura...');
        
        // ✅ BUSCAR DIRETAMENTE NO USUÁRIO CORRETO
        const targetUserId = 'abUZtZNaIFbYnzJReSuC01AsepS2';
        console.log('🎯 [SITE DETAIL] Procurando pelo site:', id, 'no usuário:', targetUserId);
        
        const directSiteRef = doc(db, "users", targetUserId, "sites", id as string);
        console.log('📍 [SITE DETAIL] Referência criada:', directSiteRef.path);
        
        const directSiteSnap = await getDoc(directSiteRef);
        console.log('📊 [SITE DETAIL] Snapshot obtido. Existe?', directSiteSnap.exists());
        
        if (directSiteSnap.exists()) {
          console.log('✅ [SITE DETAIL] Site encontrado diretamente!');
          const siteData = directSiteSnap.data();
          console.log('📊 [SITE DETAIL] Dados do site:', siteData);
          
          // ✅ BUSCAR DADOS DO USUÁRIO
          const userRef = doc(db, "users", targetUserId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};
          
          console.log('📊 [SITE DETAIL] Dados do site:', siteData);
          console.log('👤 [SITE DETAIL] Dados do usuário:', userData);
          
          // ✅ MAPEAR DADOS DO PORTFÓLIO
          const foundSite = {
            id: directSiteSnap.id,
            name: siteData.portfolioData?.personalInfo?.name || userData.displayName || siteData.title || 'Nome do Portfólio',
            title: siteData.portfolioData?.personalInfo?.name || userData.displayName || siteData.title || 'Nome do Portfólio',
            description: siteData.portfolioData?.about?.description || siteData.description || 'Subtítulo do Portfólio',
            template: siteData.template,
            published: siteData.published,
            userId: targetUserId,
            
            portfolioData: siteData.portfolioData,
            personalInfo: siteData.portfolioData?.personalInfo,
            
            about: {
              text: siteData.portfolioData?.about?.description || 'Desenvolvedor apaixonado por tecnologia',
              skills: [
                ...(siteData.portfolioData?.skills?.technical || []),
                ...(siteData.portfolioData?.skills?.tools || [])
              ],
              experience: siteData.portfolioData?.experience || []
            },
            
            portfolio: (siteData.portfolioData?.projects && siteData.portfolioData.projects.length > 0) 
              ? siteData.portfolioData.projects.map((project: any) => ({
                  id: project.id,
                  title: project.title,
                  description: project.description,
                  category: project.category || 'web',
                  technologies: project.technologies || [],
                  link: project.projectUrl || project.githubUrl,
                  image: project.imageUrl
                }))
              : [],
            
            services: siteData.portfolioData?.services || [],
            skills: siteData.portfolioData?.skills,
            projects: siteData.portfolioData?.projects,
            experience: siteData.portfolioData?.experience,
            education: siteData.portfolioData?.education,
            testimonials: siteData.portfolioData?.testimonials,
            certifications: siteData.portfolioData?.certifications,
            
            settings: {
              primaryColor: siteData.portfolioData?.theme?.primaryColor || '#667eea',
              secondaryColor: siteData.portfolioData?.theme?.secondaryColor || '#764ba2',
              fontFamily: siteData.portfolioData?.theme?.fontFamily || 'Inter, sans-serif',
            },
            
            phone: siteData.portfolioData?.personalInfo?.phone || userData.phone || '',
            email: siteData.portfolioData?.personalInfo?.email || userData.email || '',
            address: siteData.portfolioData?.personalInfo?.location || 'São Paulo, Brasil',
            whatsapp: siteData.portfolioData?.personalInfo?.whatsapp || ''
          };
          
          console.log('✅ [SITE DETAIL] Site mapeado com sucesso:', foundSite);
          setSite(foundSite);
          setTemplateId(foundSite.template || "");
          setLoading(false);
          return;
        }
        
        console.log('❌ [SITE DETAIL] Site não encontrado no usuário direto, buscando em todos...');
        
        // ✅ Buscar em todos os usuários como fallback
        const usersRef = collection(db, "users");
        const usersSnap = await getDocs(usersRef);
        
        let foundSite = null;
        let foundUserId = null;
        
        for (const userDoc of usersSnap.docs) {
          console.log('🔍 [SITE DETAIL] Verificando usuário:', userDoc.id);
          const siteRef = doc(db, "users", userDoc.id, "sites", id as string);
          const siteSnap = await getDoc(siteRef);
          
          if (siteSnap.exists()) {
            console.log('✅ [SITE DETAIL] Site encontrado no usuário:', userDoc.id);
            const siteData = siteSnap.data();
            const userData = userDoc.data();
            
            foundUserId = userDoc.id;
            
            console.log('📊 [SITE DETAIL] Dados do site:', siteData);
            console.log('📊 [SITE DETAIL] Dados do usuário:', userData);
            
            // ✅ FOCO NO PORTFÓLIO - Verificar se é portfolio
            if (siteData.template === 'portfolio') {
              console.log('🎯 [SITE DETAIL] Processando site PORTFÓLIO...');
              
              // ✅ GARANTIR que portfolioData existe - se não existir, criar
              if (!siteData.portfolioData) {
                console.log('� [SITE DETAIL] PortfolioData não existe, criando estrutura completa...');
                
                // Criar portfolioData completo baseado nos dados do usuário
                const portfolioData = {
                  personalInfo: {
                    name: userData.displayName || siteData.title || 'Seu Nome',
                    email: userData.email || 'contato@exemplo.com',
                    phone: userData.phone || '',
                    title: 'Desenvolvedor Full Stack',
                    subtitle: 'Desenvolvedor apaixonado por tecnologia',
                    location: 'São Paulo, Brasil',
                    whatsapp: ''
                  },
                  about: {
                    description: siteData.description || 'Desenvolvedor apaixonado por tecnologia e inovação.'
                  },
                  skills: {
                    technical: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
                    tools: ['Git', 'Docker', 'VS Code'],
                    languages: ['Português', 'Inglês'],
                    soft: ['Comunicação', 'Trabalho em equipe', 'Liderança']
                  },
                  projects: [],
                  services: [],
                  experience: [],
                  education: [],
                  certifications: [],
                  testimonials: [],
                  theme: {
                    primaryColor: '#667eea',
                    secondaryColor: '#764ba2',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#ffffff',
                    textColor: '#333333',
                    layout: 'modern'
                  },
                  settings: {
                    showContactForm: true,
                    showSocialLinks: true,
                    allowDownloadResume: false,
                    enableAnalytics: false
                  },
                  showSections: {
                    about: true,
                    skills: true,
                    projects: true,
                    experience: true,
                    education: false,
                    certifications: false,
                    services: false,
                    testimonials: false,
                    contact: true
                  },
                  seo: {
                    title: siteData.title || 'Meu Portfólio',
                    description: 'Portfólio profissional - Desenvolvedor Full Stack',
                    keywords: ['desenvolvedor', 'portfolio', 'web developer']
                  }
                };
                
                // ✅ MIGRAR AUTOMATICAMENTE - Salvar portfolioData no site
                try {
                  await setDoc(siteRef, {
                    ...siteData,
                    portfolioData,
                    updatedAt: new Date()
                  }, { merge: true });
                  
                  console.log('✅ [SITE DETAIL] Site migrado para nova estrutura com portfolioData completo!');
                  siteData.portfolioData = portfolioData;
                } catch (migrateError) {
                  console.error('❌ [SITE DETAIL] Erro ao migrar site:', migrateError);
                }
              }
              
              // ✅ MAPEAR DADOS DO PORTFÓLIO PARA O TEMPLATE
              foundSite = {
                id: siteSnap.id,
                name: siteData.portfolioData?.personalInfo?.name || userData.displayName || siteData.title || 'Nome do Portfólio',
                title: siteData.portfolioData?.personalInfo?.name || userData.displayName || siteData.title || 'Nome do Portfólio',
                description: siteData.portfolioData?.about?.description || siteData.description || 'Subtítulo do Portfólio',
                template: siteData.template,
                published: siteData.published,
                userId: foundUserId,
                
                // ✅ DADOS COMPLETOS DO PORTFÓLIO
                portfolioData: {
                  ...siteData.portfolioData,
                  personalInfo: {
                    ...siteData.portfolioData.personalInfo,
                    email: siteData.portfolioData.personalInfo?.email || userData.email || '',
                    phone: siteData.portfolioData.personalInfo?.phone || userData.phone || '',
                    name: siteData.portfolioData.personalInfo?.name || userData.displayName || ''
                  }
                },
                
                // ✅ COMPATIBILIDADE COM PORTFOLIOTEMPLATE
                personalInfo: {
                  ...siteData.portfolioData.personalInfo,
                  email: siteData.portfolioData.personalInfo?.email || userData.email || '',
                  phone: siteData.portfolioData.personalInfo?.phone || userData.phone || '',
                  name: siteData.portfolioData.personalInfo?.name || userData.displayName || ''
                },
                
                // ✅ SEÇÕES DO PORTFÓLIO
                about: {
                  text: siteData.portfolioData.about?.description || 'Desenvolvedor apaixonado por tecnologia',
                  skills: [
                    ...(siteData.portfolioData.skills?.technical || []),
                    ...(siteData.portfolioData.skills?.tools || [])
                  ],
                  experience: siteData.portfolioData.experience || []
                },
                
                portfolio: (siteData.portfolioData.projects && siteData.portfolioData.projects.length > 0) 
                  ? siteData.portfolioData.projects.map((project: any) => ({
                      id: project.id,
                      title: project.title,
                      description: project.description,
                      category: project.category || 'web',
                      technologies: project.technologies || [],
                      link: project.projectUrl || project.githubUrl,
                      image: project.imageUrl
                    }))
                  : [],
                
                services: siteData.portfolioData.services || [],
                skills: siteData.portfolioData.skills,
                projects: siteData.portfolioData.projects,
                experience: siteData.portfolioData.experience,
                education: siteData.portfolioData.education,
                testimonials: siteData.portfolioData.testimonials,
                certifications: siteData.portfolioData.certifications,
                
                // ✅ CONFIGURAÇÕES VISUAIS
                settings: {
                  primaryColor: siteData.portfolioData.theme?.primaryColor || '#667eea',
                  secondaryColor: siteData.portfolioData.theme?.secondaryColor || '#764ba2',
                  fontFamily: siteData.portfolioData.theme?.fontFamily || 'Inter, sans-serif',
                },
                
                // ✅ DADOS DE CONTATO
                phone: siteData.portfolioData.personalInfo?.phone || userData.phone || '',
                email: siteData.portfolioData.personalInfo?.email || userData.email || '',
                address: siteData.portfolioData.personalInfo?.location || 'São Paulo, Brasil',
                whatsapp: siteData.portfolioData.personalInfo?.whatsapp || ''
              };
              
              console.log('✅ [SITE DETAIL] Site portfólio mapeado:', foundSite);
              
            } else {
              // ✅ OUTROS TEMPLATES (barbearia, comercial, agencia)
              console.log('🎯 [SITE DETAIL] Processando site não-portfolio...');
              
              foundSite = {
                id: siteSnap.id,
                name: siteData.title,
                title: siteData.title,
                description: siteData.description,
                template: siteData.template,
                published: siteData.published,
                userId: foundUserId,
                
                hero: siteData.customization?.hero,
                about: { text: siteData.customization?.about?.content },
                
                // ✅ INTEGRAR DADOS DO USUÁRIO
                phone: siteData.customization?.contact?.phone || userData.phone || '',
                email: siteData.customization?.contact?.email || userData.email || '',
                address: siteData.customization?.contact?.address || '',
                whatsapp: siteData.customization?.contact?.whatsapp || '',
                
                settings: {
                  primaryColor: siteData.customization?.theme?.primaryColor,
                  secondaryColor: siteData.customization?.theme?.secondaryColor,
                  fontFamily: siteData.customization?.theme?.fontFamily,
                },
                
                ...(siteData.template === 'barbearia' && siteData.customization?.services && {
                  services: siteData.customization.services.map((service: any) => ({
                    id: service.id,
                    name: service.name,
                    description: `Duração: ${service.duration}`,
                    price: `R$ ${service.price.toFixed(2).replace('.', ',')}`
                  }))
                })
              };
            }
            
            // ✅ SITE ENCONTRADO - DEFINIR E PARAR
            setSite(foundSite);
            setTemplateId(foundSite.template || "");
            setLoading(false);
            return;
          }
        }
        
        // ✅ SE CHEGOU AQUI, SITE NÃO EXISTE NA NOVA ESTRUTURA
        console.log('❌ [SITE DETAIL] Site não encontrado na nova estrutura');
        
        // ✅ VERIFICAR SE EXISTE NA ESTRUTURA ANTIGA E MIGRAR
        console.log('🔍 [SITE DETAIL] Verificando se existe na estrutura antiga para migração...');
        
        const oldSiteRef = doc(db, "sites", id as string);
        const oldSiteSnap = await getDoc(oldSiteRef);
        
        if (oldSiteSnap.exists()) {
          console.log('🔧 [SITE DETAIL] Site encontrado na estrutura antiga - MIGRANDO...');
          const oldSiteData = oldSiteSnap.data();
          
          // ✅ MIGRAR AUTOMATICAMENTE PARA A NOVA ESTRUTURA
          // Determinar o usuário (pode ser do campo userId ou usar o primeiro usuário como fallback)
          let targetUserId = oldSiteData.userId;
          
          if (!targetUserId && usersSnap.docs.length > 0) {
            targetUserId = usersSnap.docs[0].id;
            console.log('⚠️ [SITE DETAIL] Site sem userId definido, usando primeiro usuário:', targetUserId);
          }
          
          if (targetUserId) {
            const targetUserRef = doc(db, "users", targetUserId);
            const targetUserSnap = await getDoc(targetUserRef);
            
            if (targetUserSnap.exists()) {
              const userData = targetUserSnap.data();
              
              // ✅ CRIAR SITE NA NOVA ESTRUTURA
              const newSiteRef = doc(db, "users", targetUserId, "sites", id as string);
              
              let migratedSiteData: any;
              
              if (oldSiteData.template === 'portfolio') {
                // ✅ MIGRAR PORTFÓLIO COM ESTRUTURA COMPLETA
                migratedSiteData = {
                  ...oldSiteData,
                  portfolioData: oldSiteData.portfolioData || {
                    personalInfo: {
                      name: userData.displayName || oldSiteData.title || 'Seu Nome',
                      email: userData.email || 'contato@exemplo.com',
                      phone: userData.phone || '',
                      title: 'Desenvolvedor Full Stack',
                      subtitle: 'Desenvolvedor apaixonado por tecnologia',
                      location: 'São Paulo, Brasil',
                      whatsapp: ''
                    },
                    about: {
                      description: oldSiteData.description || 'Desenvolvedor apaixonado por tecnologia.'
                    },
                    skills: {
                      technical: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
                      tools: ['Git', 'Docker', 'VS Code'],
                      languages: ['Português', 'Inglês'],
                      soft: ['Comunicação', 'Trabalho em equipe', 'Liderança']
                    },
                    projects: [],
                    services: [],
                    experience: [],
                    education: [],
                    certifications: [],
                    testimonials: [],
                    theme: {
                      primaryColor: '#667eea',
                      secondaryColor: '#764ba2',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#ffffff',
                      textColor: '#333333',
                      layout: 'modern'
                    },
                    settings: {
                      showContactForm: true,
                      showSocialLinks: true,
                      allowDownloadResume: false,
                      enableAnalytics: false
                    },
                    showSections: {
                      about: true,
                      skills: true,
                      projects: true,
                      experience: true,
                      education: false,
                      certifications: false,
                      services: false,
                      testimonials: false,
                      contact: true
                    },
                    seo: {
                      title: oldSiteData.title || 'Meu Portfólio',
                      description: 'Portfólio profissional - Desenvolvedor Full Stack',
                      keywords: ['desenvolvedor', 'portfolio', 'web developer']
                    }
                  },
                  userId: targetUserId,
                  migratedAt: new Date(),
                  updatedAt: new Date()
                };
              } else {
                // ✅ MIGRAR OUTROS TEMPLATES
                migratedSiteData = {
                  ...oldSiteData,
                  userId: targetUserId,
                  migratedAt: new Date(),
                  updatedAt: new Date()
                };
              }
              
              try {
                await setDoc(newSiteRef, migratedSiteData);
                console.log('✅ [SITE DETAIL] Site migrado com sucesso para nova estrutura!');
                
                // ✅ PROCESSAR O SITE MIGRADO
                if (migratedSiteData.template === 'portfolio') {
                  foundSite = {
                    id: id,
                    name: migratedSiteData.portfolioData.personalInfo?.name || userData.displayName || migratedSiteData.title,
                    title: migratedSiteData.portfolioData.personalInfo?.name || userData.displayName || migratedSiteData.title,
                    description: migratedSiteData.portfolioData.about?.description || migratedSiteData.description,
                    template: migratedSiteData.template,
                    published: migratedSiteData.published,
                    userId: targetUserId,
                    
                    portfolioData: migratedSiteData.portfolioData,
                    personalInfo: migratedSiteData.portfolioData.personalInfo,
                    
                    about: {
                      text: migratedSiteData.portfolioData.about?.description || 'Desenvolvedor apaixonado por tecnologia',
                      skills: [
                        ...(migratedSiteData.portfolioData.skills?.technical || []),
                        ...(migratedSiteData.portfolioData.skills?.tools || [])
                      ],
                      experience: migratedSiteData.portfolioData.experience || []
                    },
                    
                    portfolio: [],
                    services: [],
                    skills: migratedSiteData.portfolioData.skills,
                    projects: migratedSiteData.portfolioData.projects,
                    experience: migratedSiteData.portfolioData.experience,
                    education: migratedSiteData.portfolioData.education,
                    testimonials: migratedSiteData.portfolioData.testimonials,
                    certifications: migratedSiteData.portfolioData.certifications,
                    
                    settings: {
                      primaryColor: migratedSiteData.portfolioData.theme?.primaryColor || '#667eea',
                      secondaryColor: migratedSiteData.portfolioData.theme?.secondaryColor || '#764ba2',
                      fontFamily: migratedSiteData.portfolioData.theme?.fontFamily || 'Inter, sans-serif',
                    },
                    
                    phone: migratedSiteData.portfolioData.personalInfo?.phone || userData.phone || '',
                    email: migratedSiteData.portfolioData.personalInfo?.email || userData.email || '',
                    address: migratedSiteData.portfolioData.personalInfo?.location || 'São Paulo, Brasil',
                    whatsapp: migratedSiteData.portfolioData.personalInfo?.whatsapp || ''
                  };
                } else {
                  foundSite = {
                    id: id,
                    name: migratedSiteData.title,
                    title: migratedSiteData.title,
                    description: migratedSiteData.description,
                    template: migratedSiteData.template,
                    published: migratedSiteData.published,
                    userId: targetUserId,
                    
                    hero: migratedSiteData.customization?.hero,
                    about: { text: migratedSiteData.customization?.about?.content },
                    
                    phone: migratedSiteData.customization?.contact?.phone || userData.phone || '',
                    email: migratedSiteData.customization?.contact?.email || userData.email || '',
                    address: migratedSiteData.customization?.contact?.address || '',
                    whatsapp: migratedSiteData.customization?.contact?.whatsapp || '',
                    
                    settings: {
                      primaryColor: migratedSiteData.customization?.theme?.primaryColor,
                      secondaryColor: migratedSiteData.customization?.theme?.secondaryColor,
                      fontFamily: migratedSiteData.customization?.theme?.fontFamily,
                    }
                  };
                }
                
                setSite(foundSite);
                setTemplateId(foundSite.template || "");
                setLoading(false);
                console.log('✅ [SITE DETAIL] Site migrado e carregado:', foundSite);
                return;
                
              } catch (migrateError) {
                console.error('❌ [SITE DETAIL] Erro ao migrar site:', migrateError);
              }
            }
          }
        }
        
        // ✅ SITE NÃO ENCONTRADO EM LUGAR NENHUM
        console.log('❌ [SITE DETAIL] Site não encontrado em nenhuma estrutura');
        setSite(null);
        
      } catch (error) {
        console.error('❌ [SITE DETAIL] Erro geral na busca do site:', error);
        setSite(null);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) fetchSite();
  }, [id]);

  if (loading) {
    return (
      <div className={styles['site-detail-loading']}>
        ⏳ Carregando site...
      </div>
    );
  }
  
  if (!site) {
    return (
      <div className={styles['site-detail-not-found']}>
        <h1>❌ Site não encontrado</h1>
        <p>O site que você está procurando não existe ou foi removido.</p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          ID procurado: {id}
        </p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <Link href="/sites" className={styles['site-detail-back-link']}>
            ← Voltar aos Sites
          </Link>
          <Link href="/dashboard" className={styles['site-detail-back-link']}>
            🏠 Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Se o template da barbearia existir e for o selecionado, renderize o HTML do template


  if (templateId === "barbearia") {
    return <BarbeariaTemplate site={site} />;
  }
  if (templateId === "comercial") {
    return <ComercialTemplate site={site} />;
  }
  if (templateId === "agencia") {
    return <AgenciaViagemTemplate site={site} />;
  }
  if (templateId === "portfolio") {
    return <PortfolioTemplate site={site} />;
  }

  // Fallback: renderização responsiva premium
  return (
    <div className={styles['site-detail-root']}>
      <div className={styles['site-detail-fallback']}>
        <div className={styles['site-detail-header']}>
          <h1 className={styles['site-detail-title']}>
            {site.name || site.title}
          </h1>
          <p className={styles['site-detail-description']}>
            {site.description}
          </p>
        </div>

        <div className={styles['site-detail-info']}>
          {site.address && (
            <div className={styles['site-detail-info-card']}>
              <div className={styles['site-detail-info-label']}>
                📍 Endereço
              </div>
              <div className={styles['site-detail-info-value']}>
                {site.address}
              </div>
            </div>
          )}
          
          {site.email && (
            <div className={styles['site-detail-info-card']}>
              <div className={styles['site-detail-info-label']}>
                📧 Email
              </div>
              <div className={styles['site-detail-info-value']}>
                {site.email}
              </div>
            </div>
          )}
          
          {site.phone && (
            <div className={styles['site-detail-info-card']}>
              <div className={styles['site-detail-info-label']}>
                📞 Telefone
              </div>
              <div className={styles['site-detail-info-value']}>
                {site.phone}
              </div>
            </div>
          )}
          
          <div className={styles['site-detail-info-card']}>
            <div className={styles['site-detail-info-label']}>
              🎨 Template
            </div>
            <div className={styles['site-detail-info-value']}>
              {site.template === 'barbearia' && '🪒 Barbearia'}
              {site.template === 'comercial' && '🏢 Comercial'}
              {site.template === 'agencia' && '✈️ Agência de Viagem'}
              {!['barbearia', 'comercial', 'agencia'].includes(site.template) && site.template}
            </div>
          </div>
        </div>

        {site.services && site.services.length > 0 && (
          <div className={styles['site-detail-services']}>
            <h2 className={styles['site-detail-services-title']}>
              🛠️ Serviços
            </h2>
            <div className={styles['site-detail-services-grid']}>
              {site.services.map((srv: any, idx: number) => (
                <div key={idx} className={styles['site-detail-service-item']}>
                  <div className={styles['site-detail-service-name']}>
                    {srv.name}
                  </div>
                  <div className={styles['site-detail-service-description']}>
                    {srv.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
