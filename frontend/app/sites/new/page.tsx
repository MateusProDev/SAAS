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
      // Adiciona em users/{uid}/sites
      const userSiteRef = collection(db, 'users', user.uid, 'sites');
      const docRef = await addDoc(userSiteRef, {
        title,
        description,
        template,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid
      });
      // Adiciona também em sites global, usando o mesmo ID
      const { doc, setDoc } = await import('firebase/firestore');
      const globalSiteRef = doc(db, 'sites', docRef.id);
      await setDoc(globalSiteRef, {
        id: docRef.id,
        title, 
        description,
        template,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid
      });
      if (refreshSites) await refreshSites();
      
      // Redireciona para o editor específico baseado no template
      if (template === 'portfolio') {
        router.push(`/sites/${docRef.id}/portfolio`);
      } else {
        router.push(`/sites/${docRef.id}/edit`);
      }
    } catch (err: any) {
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
