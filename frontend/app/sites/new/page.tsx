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
            subtitle: 'Desenvolvedor apaixonado por tecnologia',
            location: 'São Paulo, Brasil',
            whatsapp: ''
          },
          about: {
            description: description || 'Desenvolvedor apaixonado por tecnologia e inovação.'
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
      if (template === 'portfolio') {
        router.push(`/sites/${docRef.id}/edit`);
      } else {
        router.push(`/sites/${docRef.id}/edit`);
      }
      
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
