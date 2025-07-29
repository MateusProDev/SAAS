import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export function useSitesFirestore() {
  const { user } = useAuth();

  // Cria um novo site no Firestore
  const createSite = async (title: string, description: string, html: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    const siteData = {
      title,
      description,
      content: html,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      published: false,
      userId: user.uid,
    };
    await addDoc(collection(db, 'users', user.uid, 'sites'), siteData);
  };

  // Lê todos os sites do usuário autenticado
  return { createSite };
}
