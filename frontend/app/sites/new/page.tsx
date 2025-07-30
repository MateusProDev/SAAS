"use client";

import React, { useState } from 'react';
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
      router.push('/dashboard');
    } catch (err: any) {
      setError('Erro ao criar site.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Criar Novo Site</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div>
          <label>Título</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div>
          <label>Descrição</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div>
          <label>Template</label>
          <select value={template} onChange={e => setTemplate(e.target.value)} style={{ width: '100%' }}>
            <option value="barbearia">Barbearia</option>
            <option value="comercial">Comercial</option>
            <option value="agencia">Agência de Viagem</option>
          </select>
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? 'Criando...' : 'Criar Site'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}
