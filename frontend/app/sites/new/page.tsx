"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRefreshSites } from '../../../src/hooks/useRefreshSitesContext';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import '../../../src/utils/firebase';
import styles from './new-site.module.css';


export default function NewSitePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState('barbearia');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refreshSites = useRefreshSites();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não autenticado');
      
      const db = getFirestore();
      
      // ✅ USAR APENAS A NOVA ESTRUTURA users/{uid}/sites
      const userSiteRef = collection(db, 'users', user.uid, 'sites');
      
      // ✅ PREPARAR DADOS DO SITE BASEADO NO TEMPLATE
      let siteData: any = {
        title,
        description,
        template,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
        published: false
      };
      
      // ✅ SE FOR PORTFÓLIO, CRIAR ESTRUTURA COMPLETA
      if (template === 'portfolio') {
        siteData.portfolioData = {
          personalInfo: {
            name: user.displayName || title || 'Seu Nome',
            email: user.email || 'contato@exemplo.com',
            phone: '',
            title: 'Desenvolvedor Full Stack',
            subtitle: 'Transformando ideias em soluções digitais',
            location: 'São Paulo, Brasil',
            whatsapp: '',
            linkedin: '',
            github: '',
            website: '',
          },
          about: {
            description: description || 'Sou um desenvolvedor apaixonado por tecnologia, sempre em busca de novos desafios e oportunidades de crescimento. Especializado em criar soluções inovadoras e eficientes que fazem a diferença.',
            mission: '',
            vision: '',
          },
          skills: {
            technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'],
            tools: ['Git', 'Docker', 'VS Code', 'Figma'],
            languages: ['Português - Nativo', 'Inglês - Intermediário'],
            soft: ['Comunicação', 'Trabalho em equipe', 'Liderança', 'Resolução de problemas']
          },
          projects: [
            {
              id: 'demo_project_1',
              title: 'Projeto Exemplo',
              description: 'Este é um projeto de exemplo. Substitua por seus próprios projetos!',
              technologies: ['React', 'TypeScript', 'Node.js'],
              featured: true,
              category: 'Web',
              status: 'completed',
              liveUrl: '',
              githubUrl: '',
            }
          ],
          experience: [
            {
              id: 'demo_exp_1',
              company: 'Empresa Exemplo',
              position: 'Desenvolvedor',
              startDate: '2023-01',
              endDate: '',
              current: true,
              description: 'Esta é uma experiência de exemplo. Substitua por suas próprias experiências!',
              location: 'São Paulo, SP',
            }
          ],
          education: [
            {
              id: 'demo_edu_1',
              institution: 'Universidade/Curso',
              degree: 'Bacharelado/Curso',
              field: 'Ciência da Computação/Área',
              startDate: '2020-01',
              endDate: '2023-12',
              current: false,
              description: 'Adicione sua formação acadêmica aqui.',
            }
          ],
          certifications: [
            {
              id: 'demo_cert_1',
              name: 'Certificação Exemplo',
              issuer: 'Instituição',
              issueDate: '2023-06',
              credentialId: '',
              credentialUrl: '',
            }
          ],
          services: [
            {
              id: 'demo_service_1',
              title: 'Desenvolvimento Web',
              description: 'Criação de sites e aplicações web modernas e responsivas',
              price: 'A partir de R$ 2.500',
              features: ['Design Responsivo', 'SEO Otimizado', 'Performance Alta'],
              icon: '💻',
            }
          ],
          testimonials: [
            {
              id: 'demo_testimonial_1',
              name: 'Cliente Exemplo',
              position: 'CEO',
              company: 'Empresa X',
              text: 'Excelente profissional, entrega de qualidade e no prazo!',
              rating: 5,
            }
          ],
          theme: {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#ffffff',
            textColor: '#333333',
            layout: 'modern',
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
          settings: {
            showContactForm: true,
            showSocialLinks: true,
            allowDownloadResume: false,
            enableAnalytics: false
          },
          seo: {
            title: title || 'Meu Portfólio',
            description: 'Portfólio profissional - Desenvolvedor Full Stack',
            keywords: ['desenvolvedor', 'portfolio', 'web developer']
          }
        };
      } else {
        // ✅ PARA OUTROS TEMPLATES, CRIAR ESTRUTURA BÁSICA
        siteData.customization = {
          hero: {
            title: title,
            subtitle: description
          },
          about: {
            content: description
          },
          contact: {
            phone: '',
            email: user.email || '',
            address: '',
            whatsapp: ''
          },
          theme: {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            fontFamily: 'Inter, sans-serif'
          }
        };
      }
      
      // ✅ CRIAR SITE NA NOVA ESTRUTURA
      const docRef = await addDoc(userSiteRef, siteData);
      
      console.log('✅ [NEW SITE] Site criado na nova estrutura:', {
        siteId: docRef.id,
        template,
        hasPortfolioData: template === 'portfolio'
      });
      
      if (refreshSites) await refreshSites();
      
      // ✅ REDIRECIONAR PARA O EDITOR ADEQUADO
      router.push(`/sites/${docRef.id}/portfolio`);
      
    } catch (err: any) {
      console.error('❌ [NEW SITE] Erro ao criar site:', err);
      setError('Erro ao criar site.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['new-site-root']}>
      <Link href="/dashboard" className={styles['new-site-back-link']}>
        ← Voltar ao Dashboard
      </Link>
      
      <div className={styles['new-site-container']}>
        <h1 className={styles['new-site-title']}>Criar Novo Site</h1>
        
        <form onSubmit={handleSubmit} className={styles['new-site-form']}>
          <div className={styles['new-site-field']}>
            <label className={styles['new-site-label']}>
              📝 Título
            </label>
            <input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              className={styles['new-site-input']}
              placeholder="Ex: Minha Barbearia"
            />
          </div>
          
          <div className={styles['new-site-field']}>
            <label className={styles['new-site-label']}>
              📋 Descrição
            </label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              required 
              className={styles['new-site-textarea']}
              placeholder="Descreva seu site..."
            />
          </div>
          
          <div className={styles['new-site-field']}>
            <label className={styles['new-site-label']}>
              🎨 Template
            </label>
            <select 
              value={template} 
              onChange={e => setTemplate(e.target.value)} 
              className={styles['new-site-select']}
            >
              <option value="barbearia">🪒 Barbearia</option>
              <option value="comercial">🏢 Comercial</option>
              <option value="agencia">✈️ Agência de Viagem</option>
              <option value="portfolio">👨‍💻 Portfolio</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className={styles['new-site-submit']}
          >
            {loading ? '⏳ Criando...' : '🚀 Criar Site'}
          </button>
          
          {error && (
            <div className={styles['new-site-error']}>
              ❌ {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
