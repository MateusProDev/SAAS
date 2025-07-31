"use client";

import React, { useState } from 'react';
// Update the import path below to the correct location of useRefreshSitesContext
import { useRefreshSites } from '../../../src/hooks/useRefreshSitesContext';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import '../../../src/utils/firebase';


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
      router.push('/dashboard');
    } catch (err: any) {
      setError('Erro ao criar site.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f6fa 0%, #e0e7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 2px 16px #0002',
        padding: 48,
        maxWidth: 420,
        width: '100%'
      }}>
        <h1 style={{
          color: '#4a4e69',
          fontSize: 30,
          marginBottom: 28,
          textAlign: 'center',
          letterSpacing: 0.5
        }}>Criar Novo Site</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#22223b', fontWeight: 600, fontSize: 16 }}>Título</label>
            <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1px solid #e0e7ff', fontSize: 16, marginTop: 6, background: '#f8f9fa' }} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={{ color: '#22223b', fontWeight: 600, fontSize: 16 }}>Descrição</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1px solid #e0e7ff', fontSize: 16, marginTop: 6, background: '#f8f9fa', minHeight: 70 }} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ color: '#22223b', fontWeight: 600, fontSize: 16 }}>Template</label>
            <select value={template} onChange={e => setTemplate(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1px solid #e0e7ff', fontSize: 16, marginTop: 6, background: '#f8f9fa' }}>
              <option value="barbearia">Barbearia</option>
              <option value="comercial">Comercial</option>
              <option value="agencia">Agência de Viagem</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%',
            background: 'linear-gradient(90deg, #4a4e69 0%, #9f86c0 100%)',
            color: '#fff',
            padding: '12px 0',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 18,
            boxShadow: '0 1px 4px #0001',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: 8,
            transition: 'opacity 0.2s'
          }}>
            {loading ? 'Criando...' : 'Criar Site'}
          </button>
          {error && <div style={{ color: '#e63946', marginTop: 10, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}
